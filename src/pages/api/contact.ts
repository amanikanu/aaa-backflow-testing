import type { APIRoute } from 'astro';
import {
  validateContact,
  rateLimited,
  sendContactEmails,
  type ContactInput,
} from '../../lib/contact';

export const prerender = false;

function clientIp(request: Request, astroClientAddress?: string): string {
  const fwd = request.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return astroClientAddress ?? 'unknown';
}

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export const GET: APIRoute = () => json({ ok: false, message: 'Method not allowed' }, 405);

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (request.headers.get('content-type')?.includes('application/json') === false) {
    return json({ ok: false, message: 'Unsupported content type' }, 415);
  }

  let body: ContactInput;
  try {
    body = (await request.json()) as ContactInput;
  } catch {
    return json({ ok: false, message: 'Invalid JSON' }, 400);
  }

  const ip = clientIp(request, clientAddress);
  if (rateLimited(ip)) {
    return json({ ok: false, message: 'Too many requests. Please call us instead.' }, 429);
  }

  const { ok, errors, values } = validateContact(body);
  if (!ok) {
    // Honeypot hit: return success-shaped response so bots don't retry.
    if (errors.fullName === ' ') return json({ ok: true, message: 'Thanks.' }, 200);
    return json({ ok: false, errors }, 422);
  }

  const result = await sendContactEmails(values);
  if (!result.sent && result.reason === 'no-api-key') {
    // Dev/no-provider mode: accept but tell the operator it wasn't emailed.
    console.warn('[contact] accepted but not emailed (no RESEND_API_KEY).');
  }
  return json(
    {
      ok: true,
      message:
        'Thanks — your message has been sent. We’ll be in touch using the details you provided.',
    },
    200
  );
};
