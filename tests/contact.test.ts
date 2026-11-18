import { describe, it, expect } from 'vitest';
import { validateContact } from '../src/lib/contact';

const valid = {
  fullName: 'Jane Doe',
  phone: '415-555-1234',
  email: 'jane@example.com',
  propertyType: 'Home',
  message: 'I received a test notice for my property and need it done.',
};

describe('validateContact', () => {
  it('accepts a valid submission', () => {
    const r = validateContact(valid);
    expect(r.ok).toBe(true);
    expect(r.errors).toEqual({});
    expect(r.values.fullName).toBe('Jane Doe');
  });

  it('rejects missing required fields', () => {
    const r = validateContact({
      fullName: '',
      phone: '',
      email: 'bad',
      propertyType: '',
      message: 'short',
    });
    expect(r.ok).toBe(false);
    expect(r.errors.fullName).toBeTruthy();
    expect(r.errors.phone).toBeTruthy();
    expect(r.errors.email).toBeTruthy();
    expect(r.errors.propertyType).toBeTruthy();
    expect(r.errors.message).toBeTruthy();
  });

  it('rejects an invalid email', () => {
    const r = validateContact({ ...valid, email: 'not-an-email' });
    expect(r.ok).toBe(false);
    expect(r.errors.email).toBeTruthy();
  });

  it('rejects a non-numeric device count', () => {
    const r = validateContact({ ...valid, devices: 'many' });
    expect(r.ok).toBe(false);
    expect(r.errors.devices).toBeTruthy();
  });

  it('silently rejects a filled honeypot', () => {
    const r = validateContact({ ...valid, website: 'spam' });
    expect(r.ok).toBe(false);
    expect(r.errors.fullName).toBe(' '); // honeypot sentinel, not a visible error
  });
});
