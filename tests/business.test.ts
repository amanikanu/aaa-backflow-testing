import { describe, it, expect } from 'vitest';
import { business, config, serviceAreaStatement } from '../src/content/business';

describe('business config flags', () => {
  it('defaults every publish flag to false', () => {
    expect(config.marinEnabled).toBe(false);
    expect(config.showAddress).toBe(false);
    expect(config.showPrice).toBe(false);
    expect(config.showReviews).toBe(false);
    expect(config.showHoursDays).toBe(false);
  });

  it('phone is a valid tel: target', () => {
    expect(business.phoneHref).toBe('tel:+14155351332');
  });

  it('service area is San Francisco by default', () => {
    expect(serviceAreaStatement()).toBe('City and County of San Francisco');
  });

  it('includes Marin County only when enabled', () => {
    const c = config as { marinEnabled: boolean };
    const prev = c.marinEnabled;
    c.marinEnabled = true;
    expect(serviceAreaStatement()).toContain('Marin County');
    c.marinEnabled = prev; // restore for other tests
  });

  it('never asserts a star rating (guardrail)', () => {
    expect(business.reviews.ratingValue).toBeNull();
  });

  it('keeps the address blank until opted in', () => {
    expect(business.address).toBe('');
  });
});
