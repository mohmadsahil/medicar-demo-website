import axios from "axios";

export interface ConsentVerifyData {
  revokeUrl?: string;
  userId?: string;
  consentRecordId?: string;
}

export interface ConsentVerifyResponse {
  data?: ConsentVerifyData;
}

export async function verifyDigitalAnumatiConsent(
  consentId: string,
  referenceId: string,
  email: string
): Promise<ConsentVerifyResponse> {
  const response = await axios.post(
    `${process.env.DIGITAL_ANUMATI_URL}/api/v1/server/consent/map-consent`,
    { consentId, referenceId, email },
    {
      headers: {
        "Content-Type": "application/json",
        "x-server-key": process.env.DIGITAL_ANUMATI_API_KEY!,
      },
    }
  );
  return response.data;
}
