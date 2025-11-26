/**
 * Test Resend email integration
 */

import { Resend } from 'resend';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

const resendApiKey = process.env.RESEND_API_KEY;

if (!resendApiKey) {
  console.error('❌ Missing RESEND_API_KEY in .env.local');
  process.exit(1);
}

const resend = new Resend(resendApiKey);

async function testResend() {
  console.log('📧 Testing Resend email integration...\n');

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'twentynineelevenimpactpartners@gmail.com',
      subject: 'VISION Platform - Test Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #2563eb;">Hello from VISION Platform! 🎉</h1>
          <p>Congrats on sending your <strong>first email</strong> with Resend!</p>
          <p>This confirms that your email integration is working correctly.</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 12px;">
            Sent from VISION Platform V2<br>
            Test Date: ${new Date().toLocaleString()}
          </p>
        </div>
      `
    });

    if (error) {
      console.error('❌ Failed to send email:', error);
      return;
    }

    console.log('✅ Email sent successfully!');
    console.log(`   Email ID: ${data?.id}`);
    console.log(`   From: onboarding@resend.dev`);
    console.log(`   To: twentynineelevenimpactpartners@gmail.com`);
    console.log(`   Subject: VISION Platform - Test Email\n`);
    console.log('📬 Check your inbox!');

  } catch (err) {
    console.error('❌ Exception:', err);
  }
}

testResend();
