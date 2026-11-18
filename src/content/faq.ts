/**
 * FAQ CONTENT (PRD 7.2 F9, 13.5 FAQ page)
 * -----------------------------------------
 * The five questions are migrated from the current site's FAQ (substance kept,
 * grammar tidied). "New" items come from search intent.
 *
 * GUARDRAILS:
 *  - No specific statutory numbers (e.g. "1984", "26,000 devices", "Article 12A",
 *    "Title 17") are asserted on the public site until client-verified and
 *    linked to the official source (discrepancy #14). Regulatory statements carry
 *    a `source` link so visitors can verify them.
 *  - Items with status 'todo' are NOT rendered on the public site (definition of
 *    done #6). They stay here for the client to fill in; track in HANDOFF.md.
 *  - The dollar amount is kept out of the static text and injected only when
 *    config.showPrice is true (discrepancy #15).
 */

import { business } from './business';

export interface FaqItem {
  id: string;
  question: string;
  paragraphs: string[];
  /** Shown only when config.showPrice is true (cost question). */
  priceLine?: string;
  source?: { label: string; url: string };
  isNew?: boolean;
  status?: 'ok' | 'todo';
}

const SRC = business.regulatorySource;

export const faqs: FaqItem[] = [
  {
    id: 'cost',
    question: 'How much does a backflow test cost?',
    paragraphs: [
      'We charge a flat rate per device for the annual test. The fee includes the DPH tags and the paperwork filed with the city (PUC and DPH), and it is due whether the device passes or fails — the test and report are performed either way.',
    ],
    priceLine:
      'Our current rate is $160 per device for the annual test, including DPH tags and city paperwork.',
  },
  {
    id: 'failed-device',
    question: 'What happens if my device fails the test?',
    paragraphs: [
      'If a device fails, it must be repaired or replaced and then re-tested. We handle repair work and the required recheck so the device is brought back into compliance, and we file the corrected report with the city.',
    ],
  },
  {
    id: 'who-needs-device',
    question: 'Do I need a backflow prevention device?',
    paragraphs: [
      'Properties with a cross-connection that could let water flow backward into the public supply generally need an approved backflow prevention assembly — common examples include fire sprinkler systems, boilers, irrigation, and some commercial plumbing. The city determines which assemblies are required for your property.',
    ],
    source: { label: SRC.label, url: SRC.url },
  },
  {
    id: 'what-is-backflow',
    question: 'What is backflow, and why is it a hazard?',
    paragraphs: [
      'Backflow is the unwanted reverse flow of water from a property back into the public drinking-water system. It can carry contaminants — chemicals, fertilizers, or bacteria — into water people drink.',
      'It happens in two ways. Backsiphonage occurs when a drop in main pressure pulls water backward (for example during a water-main break or heavy fire flow). Backpressure occurs when pressure on your side is higher than the supply and pushes water back (for example from a boiler or pump).',
    ],
  },
  {
    id: 'why-annual',
    question: 'Why is annual backflow testing required?',
    paragraphs: [
      'Approved backflow assemblies must be tested regularly to confirm they still protect the public supply. San Francisco requires annual testing of these devices by a certified tester, and the results are filed with the city. Devices that are not tested can be disconnected from the water supply.',
      'The city publishes the full program details, including the reasons and the legal basis for the requirement.',
    ],
    source: { label: SRC.label, url: SRC.url },
  },
  {
    id: 'how-often',
    question: 'How often do I need a backflow test?',
    isNew: true,
    paragraphs: [
      'Most approved backflow assemblies in San Francisco are required to be tested once a year. Your test notice or the city’s records will state your device’s due date.',
    ],
    source: { label: SRC.label, url: SRC.url },
  },
  {
    id: 'how-to-prepare',
    question: 'How do I prepare for the test?',
    isNew: true,
    paragraphs: [
      'Make sure the device is accessible — clear any storage around it — and that water service to it is on. We bring the test kit, perform the test, attach the DPH tag, and file the paperwork with the city. You usually do not need to be present.',
    ],
  },
  {
    // Client has not supplied an answer. Filtered out of the public site until
    // provided (definition of done #6). Tracked in HANDOFF.md.
    id: 'how-long',
    question: 'How long does a backflow test take?',
    isNew: true,
    status: 'todo',
    paragraphs: ['Answer to be supplied by the client.'],
  },
];

/** Items safe to show on the public site (excludes TODOs). */
export function publishedFaqs(): FaqItem[] {
  return faqs.filter((f) => f.status !== 'todo');
}

/** First N questions for the homepage preview. */
export function faqPreview(count = 4): FaqItem[] {
  return publishedFaqs().slice(0, count);
}
