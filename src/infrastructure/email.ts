import { EmailClient } from '@azure/communication-email';
import { env } from '@/config/env.js';

const emailClient = new EmailClient(env.ACS_EMAIL_CONNECTION_STRING);

export const sendVerificationEmail = async (recipient: string, verificationUrl: string) => {
  const poller = await emailClient.beginSend({
    senderAddress: env.ACS_EMAIL_SENDER,
    content: {
      subject: 'Verify your account',
      plainText: `Verify your account by opening this link: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #111827;">
          <h2 style="margin-bottom: 16px;">Verify your account</h2>
          <p style="margin-bottom: 16px;">
            Thanks for signing up. Click the button below to verify your email address.
          </p>
          <p style="margin-bottom: 24px;">
            <a
              href="${verificationUrl}"
              style="display: inline-block; padding: 12px 20px; background: #111827; color: #ffffff; text-decoration: none; border-radius: 8px;"
            >
              Verify email
            </a>
          </p>
          <p style="margin-bottom: 0;">
            If the button does not work, copy and paste this link into your browser:
          </p>
          <p>${verificationUrl}</p>
        </div>
      `,
    },
    recipients: {
      to: [{ address: recipient }],
    },
  });

  await poller.pollUntilDone();
};
