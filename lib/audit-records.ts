// The records in the free audit checklist workbook. Keep this in step with
// content/downloads/Battenkill-Ag-H2A-Audit-Checklist.xlsx.
export type AuditRecord = { text: string; rule: string };
export const auditGroups: { name: string; records: AuditRecord[] }[] = [
  {
    "name": "Application and recruitment",
    "records": [
      {
        "text": "Job order (ETA-790/790A), application (ETA-9142A) and DOL certification",
        "rule": "20 CFR 655.167"
      },
      {
        "text": "Proof the job order was placed with your state workforce agency",
        "rule": "20 CFR 655.121"
      },
      {
        "text": "Letters, texts or calls to U.S. workers from last season",
        "rule": "20 CFR 655.153"
      },
      {
        "text": "Recruitment report",
        "rule": "20 CFR 655.156"
      },
      {
        "text": "Applicant log: every U.S. applicant, the date, the outcome and a lawful reason",
        "rule": "20 CFR 655.135"
      },
      {
        "text": "Contracts with any foreign recruiters that ban charging workers fees",
        "rule": "20 CFR 655.135"
      }
    ]
  },
  {
    "name": "Housing, safety and insurance",
    "records": [
      {
        "text": "Housing inspection certificate, or rental housing compliance statement",
        "rule": "20 CFR 655.122(d)"
      },
      {
        "text": "Housing kept to standard all season: water, toilets, beds, cooking and fire safety",
        "rule": "29 CFR 1910.142"
      },
      {
        "text": "Meals provided, or free and convenient kitchen facilities, as stated in the job order",
        "rule": "20 CFR 655.122(g)"
      },
      {
        "text": "Workers' compensation proof covering the whole contract period",
        "rule": "20 CFR 655.122(e)"
      },
      {
        "text": "Vehicle registrations, insurance and drivers' licenses for worker transport",
        "rule": "20 CFR 655.122(h)"
      },
      {
        "text": "Field sanitation: drinking water, toilets and handwashing at the work site",
        "rule": "29 CFR 1928.110"
      },
      {
        "text": "Tools, supplies and equipment provided at no cost to workers",
        "rule": "20 CFR 655.122(f)"
      }
    ]
  },
  {
    "name": "Contracts, notices and travel",
    "records": [
      {
        "text": "Copy of the job terms given to each worker in a language they understand, with the date given",
        "rule": "20 CFR 655.122(q)"
      },
      {
        "text": "H-2A worker rights poster (WHD-1491) posted where workers can see it, in English and Spanish",
        "rule": "20 CFR 655.135"
      },
      {
        "text": "Inbound travel and daily subsistence reimbursements (paid by the 50% point)",
        "rule": "20 CFR 655.122(h)"
      },
      {
        "text": "Return travel records at the end of the contract",
        "rule": "20 CFR 655.122(h)"
      }
    ]
  },
  {
    "name": "Hours and pay",
    "records": [
      {
        "text": "Wage rate paid is at least the AEWR or other required rate in effect",
        "rule": "20 CFR 655.120"
      },
      {
        "text": "U.S. workers in corresponding jobs paid the same rate and terms",
        "rule": "20 CFR 655.122(a)"
      },
      {
        "text": "Daily hours offered, with guaranteed and extra hours kept separate",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Daily hours worked, with start and stop times",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Reason recorded whenever hours worked were fewer than hours offered",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Field tally records and units produced (piece rate work)",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Payroll summaries: rate of pay and earnings each pay period",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Pay statement for every worker, every pay period, with all required items",
        "rule": "20 CFR 655.122(k)"
      },
      {
        "text": "Every deduction, with the amount and reason",
        "rule": "20 CFR 655.122(p)"
      },
      {
        "text": "Each worker's permanent home address, plus phone and email if available",
        "rule": "20 CFR 655.122(j)"
      },
      {
        "text": "Three-fourths guarantee check at the end of the contract",
        "rule": "20 CFR 655.122(i)"
      }
    ]
  },
  {
    "name": "Departures and changes",
    "records": [
      {
        "text": "Abandonment or termination notices sent to DOL and DHS within 2 working days",
        "rule": "20 CFR 655.122(n)"
      },
      {
        "text": "Warnings, discipline records and the reason for each termination",
        "rule": "20 CFR 655.122(n)"
      },
      {
        "text": "Notices to workers about any delay in your start date",
        "rule": "Job order"
      }
    ]
  },
  {
    "name": "If an audit letter arrives",
    "records": [
      {
        "text": "The audit letter, its due date, and a copy of everything you sent back",
        "rule": "20 CFR 655.180"
      }
    ]
  }
];
export const auditRecordCount = auditGroups.reduce((n, g) => n + g.records.length, 0);
