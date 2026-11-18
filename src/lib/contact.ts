/**
 * CONTACT FORM SERVER LOGIC (PRD 7.1 F5, 13.6)
 * ---------------------------------------------
 * Pure, dependency-free module shared by:
 *   - src/pages/api/contact.ts   (Astro dev endpoint / Vercel serverless fn)
 *   - api/contact.ts             (standalone Vercel function, optional)
 *
 * No Astro imports here so it bundles anywhere. Validation, honeypot, rate
 * limiting, and email sending all live in one place (single source of truth).
 */

import { business } from '../content/business';

export type PropertyType = 'Home' | 'Business' | 'Property manager' | 'Contractor or architect';

export interface ContactInput {
  fullName?: string;
  phone?: string;
  email?: string;
  propertyType?: string;
  devices?: string;
  message?: string;
  // Honeypot: must stay empty. Real users never see/fill it.
  website?: string;
}

export type FieldErrors = Partial<Record<keyof ContactInput, string>>;

const PROPERTY_TYPES: PropertyType[] = [
  'Home',
  'Business',
  'Property manager',
  'Contractor or architect',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate and sanitize a contact submission. Returns safe values or errors. */
export function validateContact(input: ContactInput): {
  ok: boolean;
  errors: FieldErrors;
  values: Required<Omit<ContactInput, 'website' | 'devices'>> & { devices?: string };
} {
  const errors: FieldErrors = {};

  // Honeypot must be empty.
  if (input.website && input.website.trim() !== '') {
    // Pretend success to the bot; do not leak the reason.
    return {
      ok: false,
      errors: { fullName: ' ' },
      values: { fullName: '', phone: '', email: '', propertyType: '', message: '' },
    };
  }

  const fullName = (input.fullName ?? '').trim();
  const phone = (input.phone ?? '').trim();
  const email = (input.email ?? '').trim();
  const propertyType = (input.propertyType ?? '').trim();
  const devices = (input.devices ?? '').trim();
  const message = (input.message ?? '').trim();

  if (fullName.length < 2) errors.fullName = 'Please enter your name.';
  if (phone.length < 7) errors.phone = 'Please enter a valid phone number.';
  if (!EMAIL_RE.test(email)) errors.email = 'Please enter a valid email address.';
  if (!PROPERTY_TYPES.includes(propertyType as PropertyType))
    errors.propertyType = 'Please choose a property type.';
  if (message.length < 10) errors.message = 'Please enter a short message (at least 10 characters).';
  if (devices && !/^\d{1,3}$/.test(devices))
    errors.devices = 'Enter the number of devices as a whole number, if known.';

  const ok = Object.keys(errors).length === 0;
  return {
    ok,
    errors,
    values: { fullName, phone, email, propertyType, devices: devices || undefined, message },
  };
}

/** Best-effort in-memory rate limit (per instance). Ephemeral on serverless. */
const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

export function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

export interface SendResult {
  sent: boolean;
  reason?: string;
}

/**
 * Send the office notification + customer confirmation. Uses Resend's REST API
 * when RESEND_API_KEY is set; otherwise logs a no-op (dev). The confirmation
 * email states only what the client has approved (no response-time promises).
 */
export async function sendContactEmails(
  values: { fullName: string; phone: string; email: string; propertyType: string; devices?: string; message: string }
): Promise<SendResult> {
  const officeEmail = process.env.OFFICE_EMAIL || business.email;
  const from = process.env.EMAIL_FROM || `AAA Backflow Testing <${business.email}>`;
  const apiKey = process.env.RESEND_API_KEY;

  const deviceLine = values.devices ? `\nDevices (if known): ${values.devices}` : '';
  const text = [
    `New contact submission from ${business.name} website`,
    `Name: ${values.fullName}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Property type: ${values.propertyType}`,
    deviceLine,
    `Message:\n${values.message}`,
  ].join('\n');

  const confirmationText = [
    `Hi ${values.fullName},`,
    ``,
    `Thanks for contacting ${business.name}. We received your message and will follow up using the contact details you provided.`,
    ``,
    `If you need a backflow test right away, you can book online any time:`,
    business.schedulingUrl,
    ``,
    `— ${business.name}`,
    business.phone,
    business.email,
  ].join('\n');

  if (!apiKey) {
    console.warn('[contact] RESEND_API_KEY not set — skipping real send (dev no-op).');
    return { sent: false, reason: 'no-api-key' };
  }

  try {
    const send = (to: string, subject: string, body: string) =>
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from, to, subject, text: body }),
      });

    const office = await send(officeEmail, `Backflow inquiry — ${values.fullName}`, text);
    if (!office.ok) {
      const detail = await office.text();
      console.error('[contact] office email failed:', detail);
      return { sent: false, reason: 'office-send-failed' };
    }
    // Confirmation is best-effort; do not fail the request if it errors.
    await send(values.email, `We received your message — ${business.name}`, confirmationText).catch(
      (e) => console.error('[contact] confirmation email failed:', e)
    );
    return { sent: true };
  } catch (e) {
    console.error('[contact] send error:', e);
    return { sent: false, reason: 'exception' };
  }
}
