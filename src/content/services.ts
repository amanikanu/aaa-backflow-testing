/**
 * SERVICE PAGE CONTENT (PRD 13.5 routes)
 * ---------------------------------------
 * Centralized, easy-to-edit copy for the four service pages. Every fact here is
 * drawn from the current site's FAQ/About or is plainly educational. No
 * invented prices, hours, or credentials — those come from business.ts.
 */

export interface ServiceSection {
  heading: string;
  paragraphs?: string[];
  list?: string[];
}

export interface ServicePage {
  slug: string;
  h1: string;
  /** Unique <title> (without the site name). Must not collide with other pages. */
  title: string;
  intro: string[];
  sections: ServiceSection[];
  showPrice?: boolean;
}

export const servicePages: Record<string, ServicePage> = {
  'backflow-testing': {
    slug: 'backflow-testing',
    h1: 'Backflow Testing in San Francisco',
    title: 'Backflow Testing Services in San Francisco',
    intro: [
      'AAA Backflow Testing provides certified annual backflow testing for homes, businesses, and property managers across the City and County of San Francisco. We test your device, attach the required DPH tag, and file the paperwork with the city so your property stays in compliance.',
    ],
    sections: [
      {
        heading: 'What is included',
        list: [
          'On-site testing by a certified AWWA tester',
          'DPH tag attached to the device',
          'Test report filed with the city (PUC and DPH)',
          'Clear pass/fail result communicated to you',
        ],
      },
      {
        heading: 'What to expect',
        paragraphs: [
          'Most tests are quick and non-invasive. We locate the assembly, perform the test with a calibrated kit, and record the results. You usually do not need to be present. If the device passes, we tag it and file the report. If it fails, we explain the next step and can handle the repair.',
        ],
      },
      {
        heading: 'Who needs a test',
        paragraphs: [
          'If you received a test notice from the city, your property has an approved backflow assembly that must be tested every year. Common assemblies are on fire sprinkler systems, boilers, irrigation, and certain commercial plumbing.',
        ],
      },
    ],
    showPrice: true,
  },

  'backflow-repair': {
    slug: 'backflow-repair',
    h1: 'Backflow Repair in San Francisco',
    title: 'Backflow Repair in San Francisco',
    intro: [
      'A failed device does not mean a failed inspection forever. We repair failed backflow assemblies, replace worn parts, and perform the required recheck so your property is brought back into compliance and the city is notified.',
    ],
    sections: [
      {
        heading: 'If your device failed',
        paragraphs: [
          'When a device fails, it must be repaired or replaced and then re-tested. We diagnose the failure, perform the repair, and complete the recheck, then file the corrected report with the city.',
        ],
      },
      {
        heading: 'Parts and rechecks',
        list: [
          'Repair or replacement of the failed assembly',
          'Re-test after the repair (recheck)',
          'Updated DPH tag and filed report',
          'Communication of the final pass result',
        ],
      },
    ],
    showPrice: true,
  },

  'new-installations': {
    slug: 'new-installations',
    h1: 'New Installations & Consulting',
    title: 'Backflow Installations & Consulting in San Francisco',
    intro: [
      'Building new or remodeling? AAA Backflow Testing consults with architects, contractors, and property owners on backflow prevention devices and code compliance for new installations.',
    ],
    sections: [
      {
        heading: 'For architects and contractors',
        paragraphs: [
          'We help you plan the right backflow prevention assembly for a project — from single devices to multi-assembly buildings — and coordinate with the requirements of the jurisdiction so the work passes inspection the first time.',
        ],
      },
      {
        heading: 'Code compliance',
        paragraphs: [
          'Backflow prevention is governed by plumbing and water-supply code. We advise on device selection and placement so your installation meets the city’s requirements and the assembly can be tested annually as required.',
        ],
      },
    ],
  },

  'compliance-reporting': {
    slug: 'compliance-reporting',
    h1: 'Compliance Reporting',
    title: 'Backflow Compliance Reporting in San Francisco',
    intro: [
      'Staying compliant is mostly paperwork — and we handle it. AAA Backflow Testing manages the compliance documentation for the city, the Department of Public Health (DPH), and the Public Utilities Commission (PUC).',
    ],
    sections: [
      {
        heading: 'What we file',
        list: [
          'Test reports submitted to the city (PUC and DPH)',
          'DPH tags attached to each device',
          'Corrected reports after any repair or recheck',
        ],
      },
      {
        heading: 'Records retained for 3 years',
        paragraphs: [
          'Per the city’s program, test reports are retained for three years. We keep your records on file so you can demonstrate compliance if the city asks.',
        ],
      },
    ],
  },
};
