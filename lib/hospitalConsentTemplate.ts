export interface HospitalDataCategory {
  id: string;
  name: string;
  description: string;
  processingCompany: string;
  dataPurpose: string[];
  technologiesUsed: string[];
  legalBasis: string[];
  processingLocation: string;
  retentionPeriod: string;
  dataCollected: string[];
  transferCountries: string[];
  dataRecipients: Array<{
    recipientName: string;
    recipientContact: string;
    recipientLocation: string;
  }>;
  storageInformation: Array<{
    storageType: string;
    storageLocation: string;
    securityMeasures: string;
  }>;
}

export interface HospitalConsentCategory {
  is_required: boolean;
  consent_category: {
    id: string;
    name: string;
    description: string;
  };
  data_categories: HospitalDataCategory[];
}

export interface HospitalConsentTemplate {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  languageIds: Array<{
    languageCode: string;
    languageName: string;
    languageNativeName: string;
    isEnabled: number;
  }>;
  consentHeading: string;
  consentDescription: string;
  aboutConsentHtml: string;
  templateRetentionPeriod: string;
  grievanceOfficerContact: string;
  version: string;
  status: string;
  applicationDetails: Array<{
    id: number;
    name: string;
    description: string;
    owner: string;
    email: string;
    phone: string;
  }>;
  dataProcessing: {
    is_collection: boolean;
    is_storage: boolean;
    is_analysis: boolean;
    is_sharing: boolean;
    third_party_sharing: boolean;
    retention_period: string;
  };
  consentCategories: HospitalConsentCategory[];
}

export const hospitalConsentTemplate: HospitalConsentTemplate = {
  id: "142",
  tenantId: "44",
  name: "Patient Appointment Data Consent",
  description:
    "This consent enables the collection and processing of patient information for appointment booking, communication, and healthcare service delivery.",
  languageIds: [
    {
      languageCode: "hi",
      languageName: "Hindi",
      languageNativeName: "हिन्दी",
      isEnabled: 1,
    },
    {
      languageCode: "en",
      languageName: "English",
      languageNativeName: "English",
      isEnabled: 1,
    },
  ],
  consentHeading: "We collect your information for appointment booking",
  consentDescription:
    "We collect your personal details such as name, phone number, email, and health-related information to schedule appointments, provide healthcare services, and communicate important updates. Your data is securely stored on cloud servers located in India and handled in compliance with applicable data protection laws.",
  aboutConsentHtml:
    "This consent banner is designed to inform you about how we collect, use, and protect your personal data in accordance with applicable privacy regulations.",
  templateRetentionPeriod: "7y",
  grievanceOfficerContact: "dpo@digitalanumati.com",
  version: "v0.0.2",
  status: "published",
  applicationDetails: [
    {
      id: 20,
      name: "Hospital Portal Website",
      description:
        "A comprehensive hospital website offering online appointment booking, doctor search, lab test booking, report downloads, teleconsultation, secure payments, patient records access, emergency support, and real-time updates for patient-centric healthcare services.",
      owner: "Digital Anumati",
      email: "info@digitalanumati.com",
      phone: "+91 995 866 3840",
    },
  ],
  dataProcessing: {
    is_collection: true,
    is_storage: true,
    is_analysis: true,
    is_sharing: true,
    third_party_sharing: true,
    retention_period: "7y",
  },
  consentCategories: [
    {
      is_required: true,
      consent_category: {
        id: "126",
        name: "Core Healthcare Services",
        description:
          "Essential data processing required for appointment booking, treatment, and medical record management.",
      },
      data_categories: [
        {
          id: "100",
          name: "Patient Identification Data",
          description: "Basic personal details used to identify the patient.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Patient identification",
            "Appointment booking",
            "Medical record linking",
          ],
          technologiesUsed: ["Web Forms", "HMS", "Cloud Storage"],
          legalBasis: ["User Consent", "Healthcare Service Requirement"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: ["Full name", "Date of birth", "Gender", "Patient ID"],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "AWS India (Mumbai Region)",
              securityMeasures:
                "Encryption, IAM Policies, Audit Logs, Daily automated backups, Role-Based Access Control (RBAC)",
            },
          ],
        },
        {
          id: "101",
          name: "Contact Information",
          description: "Used to communicate with patients.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Appointment confirmations",
            "Reminders",
            "Emergency communication",
          ],
          technologiesUsed: ["SMS Gateways", "Email Services"],
          legalBasis: ["User Consent"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: ["Phone Number", "Email Address", "Address"],
          transferCountries: ["Not applicable"],
          dataRecipients: [
            {
              recipientName: "Twilio",
              recipientContact: "help@twillio.com",
              recipientLocation: "Global (may include US/India)",
            },
            {
              recipientName: "AWS SES",
              recipientContact: "info@aws.com",
              recipientLocation: "India (preferred region)",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "India (AWS Mumbai Region)",
              securityMeasures:
                "Secure APIs, Audit logs, Role-Based Access Control (RBAC), Masked access",
            },
          ],
        },
        {
          id: "102",
          name: "Health & Medical Information",
          description: "Medical details required for diagnosis and treatment.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Diagnosis support",
            "Treatment planning",
            "Medical history tracking",
          ],
          technologiesUsed: ["EHR", "HMS", "Secure REST APIs"],
          legalBasis: ["Healthcare Service Requirement"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: [
            "Doctor Notes",
            "Prescriptions",
            "Allergies",
            "Medical History",
          ],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "AWS India (HIPAA-aligned setup)",
              securityMeasures:
                "Zero trust architecture, access logging, end-to-end encryption, strict RBAC, encrypted backups",
            },
          ],
        },
        {
          id: "103",
          name: "Appointment & Scheduling Data",
          description: "Information required to manage appointments.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Visit tracking",
            "Doctor allocation",
            "Appointment scheduling",
          ],
          technologiesUsed: ["HMS", "Encrypted relational database"],
          legalBasis: ["User Consent"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: [
            "Visit Type",
            "Appointment Date & Time",
            "Department",
            "Preferred Doctor",
          ],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "India (AWS Mumbai Region)",
              securityMeasures:
                "Encryption, IAM Policies, Audit Logs, Daily automated backups, Role-Based Access Control (RBAC)",
            },
          ],
        },
      ],
    },
    {
      is_required: true,
      consent_category: {
        id: "127",
        name: "Billing & Insurance",
        description: "Processing required for payments and insurance claims.",
      },
      data_categories: [
        {
          id: "104",
          name: "Billing Information",
          description: "Used for invoicing and payments.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Invoice generation",
            "Payment processing",
            "Financial reporting",
          ],
          technologiesUsed: ["Billing Engine", "Payment API"],
          legalBasis: ["User Consent"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: [
            "Billing Address",
            "Transaction Details",
            "Payment Method",
          ],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "India (AWS Mumbai Region)",
              securityMeasures:
                "Encryption, IAM Policies, Audit Logs, Daily automated backups, Role-Based Access Control (RBAC)",
            },
          ],
        },
        {
          id: "105",
          name: "Insurance Data",
          description: "Used for claim processing.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: [
            "Reimbursement processing",
            "Claim submission",
            "Insurance verification",
          ],
          technologiesUsed: ["HMS"],
          legalBasis: ["User Consent"],
          processingLocation: "India",
          retentionPeriod: "7 years",
          dataCollected: [
            "Insurance Provider",
            "Coverage Details",
            "Policy Number",
          ],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "India (AWS Mumbai Region)",
              securityMeasures:
                "Encryption, IAM Policies, Audit Logs, Daily automated backups, Role-Based Access Control (RBAC)",
            },
          ],
        },
      ],
    },
    {
      is_required: false,
      consent_category: {
        id: "128",
        name: "Communication & Engagement",
        description: "Optional communication for patient engagement.",
      },
      data_categories: [
        {
          id: "106",
          name: "Patient Communication",
          description: "Used to send updates and reminders.",
          processingCompany: "Our hospital - Digital Anumati",
          dataPurpose: ["Health tips", "Follow-ups", "Appointment reminders"],
          technologiesUsed: ["HMS"],
          legalBasis: ["User Consent"],
          processingLocation: "India",
          retentionPeriod: "12 months",
          dataCollected: ["Email Address", "Phone Number"],
          transferCountries: ["Not Applicable"],
          dataRecipients: [
            {
              recipientName: "Digital Anumati",
              recipientContact: "info@digitalanumati.com",
              recipientLocation: "India",
            },
          ],
          storageInformation: [
            {
              storageType: "Cloud Database",
              storageLocation: "India (AWS Mumbai Region)",
              securityMeasures:
                "Encryption, IAM Policies, Audit Logs, Daily automated backups, Role-Based Access Control (RBAC)",
            },
          ],
        },
      ],
    },
  ],
};
