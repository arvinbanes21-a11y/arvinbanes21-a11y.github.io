import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export async function POST(req: Request) {
  try {
    const { name, email, projectBrief } = await req.json();

    if (
      [name, email, projectBrief].some((field) => typeof field !== 'string') ||
      name.length > 200 || email.length > 320 || projectBrief.length > 5000
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid submission.' },
        { status: 400 }
      );
    }

    if (!name || !email || !projectBrief) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and project brief are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_RECEIVER_EMAIL || 'arvinbanes21@gmail.com';

    if (!apiKey || apiKey === 're_123456789_placeholder') {
      if (process.env.NODE_ENV === 'production') {
        console.error('RESEND_API_KEY is not set; contact message was NOT delivered.');
        return NextResponse.json(
          { success: false, error: 'Messaging is temporarily unavailable. Please email me directly.' },
          { status: 503 }
        );
      }
      console.log('📬 [Demo Contact Form Submission]:', { name, email, projectBrief });
      return NextResponse.json({
        success: true,
        message: 'Demo mode: message logged.',
      });
    }

    const resend = new Resend(apiKey);
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);

    console.log(`📨 Dispathing Resend email via SDK to: ${toEmail} from sender: ${name} (${email})`);

    const { data, error } = await resend.emails.send({
      from: 'Portfolio Inquiry <onboarding@resend.dev>',
      to: [toEmail],
      replyTo: email,
      subject: `✨ New Portfolio Inquiry from ${name.replace(/[\r\n]+/g, ' ')}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8f9fc; margin: 0; padding: 24px; color: #1e293b; }
              .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
              .header { background: linear-gradient(135deg, #1F4075 0%, #0B103C 100%); padding: 32px 28px; text-align: center; }
              .header h1 { margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; }
              .header p { margin: 6px 0 0 0; color: #F9DFA1; font-size: 13px; font-weight: 500; }
              .content { padding: 32px 28px; }
              .field-group { margin-bottom: 20px; }
              .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; color: #64748b; margin-bottom: 6px; }
              .value { font-size: 15px; font-weight: 600; color: #0f172a; }
              .message-box { background: #f1f5f9; border-left: 4px solid #3b82f6; padding: 16px 20px; border-radius: 8px; font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-wrap; margin-top: 8px; }
              .cta-container { text-align: center; margin-top: 32px; }
              .button { display: inline-block; background: #1F4075; color: #ffffff !important; padding: 12px 28px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 12px rgba(31,64,117,0.25); }
              .footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1>New Portfolio Message</h1>
                <p>Inquiry received from your personal website</p>
              </div>
              <div class="content">
                <div class="field-group">
                  <div class="label">Sender Name</div>
                  <div class="value">${safeName}</div>
                </div>
                <div class="field-group">
                  <div class="label">Sender Email</div>
                  <div class="value"><a href="mailto:${safeEmail}" style="color: #3b82f6; text-decoration: none;">${safeEmail}</a></div>
                </div>
                <div class="field-group">
                  <div class="label">Project Brief / Message</div>
                  <div class="message-box">${escapeHtml(projectBrief)}</div>
                </div>
                <div class="cta-container">
                  <a href="mailto:${safeEmail}?subject=Re:%20Portfolio%20Inquiry" class="button">Reply directly to ${safeName}</a>
                </div>
              </div>
              <div class="footer">
                Received on ${new Date().toLocaleString()} • Personal Portfolio Contact Engine
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error('❌ Resend SDK Delivery Error:', error);
      return NextResponse.json(
        { success: false, error: error.message || 'Failed to deliver email.' },
        { status: 400 }
      );
    }

    console.log('✅ Resend Email Dispatched Successfully via SDK! ID:', data?.id);

    return NextResponse.json({
      success: true,
      message: 'Email delivered successfully.',
      id: data?.id,
    });
  } catch (error: any) {
    console.error('Error handling contact API request:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
