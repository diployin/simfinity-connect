import nodemailer from "nodemailer";
import { db } from "./db";
import { emailTemplates, settings, users } from "@shared/schema";
import { eq, inArray } from "drizzle-orm";


async function loadSmtpSettings() {
  const keys = [
    "smtp_host",
    "smtp_port",
    "smtp_user",
    "smtp_pass",
    "smtp_from_email",
    "platform_name",
    "platform_tagline",
    "email",
    "phone",
    "help_center_url",
    "facebook_url",
    "instagram_url",
    "twitter_url",
    "linkedin_url",
    "youtube_url"
  ];

  const rows = await db
    .select()
    .from(settings)
    .where(inArray(settings.key, keys));

  const config: any = {};
  for (const row of rows) {
    config[row.key] = row.value;
  }

  return {
    host: config.smtp_host || "",
    port: Number(config.smtp_port || 587),
    user: config.smtp_user || "",
    pass: config.smtp_pass || "",
    fromEmail: config.smtp_from_email || "",
    platformName: config.platform_name || "Voltey",
    platformTagline: config.platform_tagline || "",
    supportEmail: config.email || "support@voltey.com",
    whatsappNumber: config.phone || "",
    helpCenterUrl: config.help_center_url || "#",
    facebookUrl: config.facebook_url || "#",
    instagramUrl: config.instagram_url || "#",
    twitterUrl: config.twitter_url || "#",
    linkedinUrl: config.linkedin_url || "#",
    youtubeUrl: config.youtube_url || "#"
  };
}



let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const smtp = await loadSmtpSettings();

  // If SMTP is not fully configured, disable email sending
  if (!smtp.host || !smtp.user || !smtp.pass) {
    console.log("⚠ SMTP not configured in DB. Email disabled.");
    return null;
  }

  transporter = nodemailer.createTransport({
    host: smtp.host,
    port: smtp.port,
    secure: smtp.port === 465,
    auth: {
      user: smtp.user,
      pass: smtp.pass,
    },
  });

  return transporter;
}


// Check if SMTP is configured
const isSmtpConfigured = !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);

// const transporter = isSmtpConfigured 
//   ? nodemailer.createTransport({
//       host: process.env.SMTP_HOST,
//       port: parseInt(process.env.SMTP_PORT || "587"),
//       secure: process.env.SMTP_PORT === "465",
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//     })
//   : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  // In development mode without SMTP, just log the email
  // if (!isSmtpConfigured) {
  //   console.log(`📧 [DEV MODE] Email would be sent to ${to}: ${subject}`);
  //   console.log(`📧 [DEV MODE] Content:`, text || html.replace(/<[^>]*>/g, "").substring(0, 200));
  //   return; // Don't throw error, just skip sending
  // }

  const smtp = await loadSmtpSettings();
  const transporter = await getTransporter();

  if (!transporter) {
    console.log("❌ Email not sent (SMTP disabled)");
    return;
  }

  try {
    await transporter!.sendMail({
      from: `"${smtp.platformName}" <${smtp.fromEmail}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""),
    });
    console.log(`✅ Email sent to ${to}: ${subject}`);
  } catch (error: any) {
    console.error("❌ Failed to send email:", error.message);
    // In development, don't fail the request if email fails
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️ [DEV MODE] Continuing despite email failure');
      return;
    }
    throw new Error("Failed to send email");
  }
}

// Template renderer function
interface TemplateVariables {
  [key: string]: string | number | undefined;
}

async function renderTemplate(eventType: string, variables: TemplateVariables): Promise<{ subject: string; html: string } | null> {
  try {
    // Fetch template from database
    const template = await db.select().from(emailTemplates).where(eq(emailTemplates.eventType, eventType)).limit(1);

    if (!template || template.length === 0 || !template[0].isActive) {
      return null; // No template found or inactive, will use fallback
    }

    const templateData = template[0];
    let { subject, body } = templateData;

    // Replace all variables in subject and body
    // Variables are in format {{variable_name}}
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      const replacement = value !== undefined && value !== null ? String(value) : '';
      // Use replaceAll to avoid regex escape issues
      subject = subject.replaceAll(placeholder, replacement);
      body = body.replaceAll(placeholder, replacement);
    });

    return { subject, html: body };
  } catch (error) {
    console.error(`❌ Error rendering template for ${eventType}:`, error);
    return null; // Will use fallback
  }
}

export async function generateOTPEmail(
  code: string,
  name?: string,
  email?: string
) {
  // 1️⃣ Try database/email template first
  try {
    const templateRendered = await renderTemplate("otp", {
      customer_name: name || "Customer",
      code,
      platform_name: "Voltey",
      customer_email: email,
    });

    if (templateRendered) {
      return templateRendered;
    }
  } catch (err) {
    // Template failure should never break OTP emails
    console.error("OTP template render failed:", err);
  }

  // 2️⃣ Safely load settings
  const keys = ["platform_name", "platform_tagline", "smtp_from_email"];

  let settingsMap: Record<string, string> = {};

  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, keys));

    for (const row of rows ?? []) {
      if (row?.key && row?.value) {
        settingsMap[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error("Settings fetch failed:", err);
  }

  // 3️⃣ Safe defaults (never undefined)
  const platformName = settingsMap.platform_name || "Voltey";
  const greeting = name ? `Hi ${name}` : "Hello";
  const year = new Date().getFullYear();

  // 4️⃣ Fallback email (guaranteed safe)
  return {
    subject: "Your Login Code",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      ${platformName}
    </h1>
  </div>

  <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px; margin-bottom: 20px;">
      ${greeting},
    </p>

    <p style="font-size: 16px; margin-bottom: 30px;">
      Your verification code is:
    </p>

    <div style="background: white; border: 2px solid #2c7338; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
      <h2 style="color: #2c7338; font-size: 36px; letter-spacing: 8px; margin: 0;">
        ${code}
      </h2>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      This code will expire in 10 minutes.
      If you didn’t request this code, you can safely ignore this email.
    </p>
  </div>

  <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
    <p>© ${year} ${platformName}. All rights reserved.</p>
  </div>

</body>
</html>
    `,
  };
}


export async function generateWelcomeEmail(
  name: string,
  email?: string
) {
  // 1️⃣ Try DB template first (never break flow)
  try {
    const templateRendered = await renderTemplate("welcome", {
      customer_name: name || "Customer",
      customer_email: email || "",
      platform_name: "Voltey",
    });

    if (templateRendered) {
      return templateRendered;
    }
  } catch (err) {
    console.error("Welcome template render failed:", err);
  }

  // 2️⃣ Fetch settings safely
  const keys = ["platform_name"];

  let settingsMap: Record<string, string> = {};

  try {
    const rows = await db
      .select()
      .from(settings)
      .where(inArray(settings.key, keys));

    for (const row of rows ?? []) {
      if (row?.key && row?.value) {
        settingsMap[row.key] = row.value;
      }
    }
  } catch (err) {
    console.error("Settings fetch failed:", err);
  }

  // 3️⃣ Safe defaults
  const platformName = settingsMap.platform_name || "Voltey";
  const customerName = name || "Customer";
  const baseUrl = process.env.BASE_URL || "http://localhost:5000";

  // 4️⃣ Fallback email (guaranteed safe)
  return {
    subject: `Welcome to ${platformName}!`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
</head>
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">

  <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: white; margin: 0; font-size: 28px;">
      Welcome to ${platformName}!
    </h1>
  </div>

  <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
    <p style="font-size: 16px;">
      Hi ${customerName},
    </p>

    <p style="font-size: 16px;">
      Thank you for joining ${platformName}! We're excited to help you stay connected wherever you travel.
    </p>

    <p style="font-size: 16px;">
      With ${platformName}, you can:
    </p>

    <ul style="font-size: 16px; line-height: 1.8;">
      <li>Get instant eSIM delivery</li>
      <li>Browse packages for 150+ countries</li>
      <li>Avoid expensive roaming charges</li>
      <li>Monitor your usage in real-time</li>
      <li>Top up anytime, anywhere</li>
    </ul>

    <div style="text-align: center; margin: 30px 0;">
      <a
        href="${baseUrl}/destinations"
        style="background: #2c7338; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600;"
      >
        Browse Destinations
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      If you have any questions, our support team is here 24/7 to help.
    </p>
  </div>

</body>
</html>
    `,
  };
}


export async function generateOrderConfirmationEmail(order: any) {
  const settings = await loadSmtpSettings();
  const platformName = settings.platformName;
  const baseUrl = process.env.BASE_URL || "https://voltey.com";

  // Fetch customer name from user table if userId is present
  let customerName = order.name || order.customerName || 'Traveler';
  if (order.userId) {
    try {
      const userList = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
      if (userList.length > 0 && userList[0].name) {
        customerName = userList[0].name;
      }
    } catch (err) {
      console.error("Failed to fetch user name for order confirmation email:", err);
    }
  }

  // Try to use database template first
  try {
    const templateRendered = await renderTemplate('esim_purchased', {
      customer_name: customerName,
      order_number: order.displayOrderId || order.displayId || order.id || '',
      esim_iccid: order.iccid || 'Processing',
      country: order.destination || order.packageName || 'Destination',
      data_amount: order.dataAmount || '',
      validity_days: order.validity || '',
      price: order.price ? `$${order.price}` : '',
      qr_code_url: order.qrCodeUrl || '',
      platform_name: platformName,
    });

    if (templateRendered) {
      return templateRendered;
    }
  } catch (err) {
    console.error("Order confirmation template render failed:", err);
  }

  // Fallback to hardcoded template
  return {
    subject: `Order Confirmed: ${order.displayOrderId || order.displayId || order.id} - ${platformName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
          .order-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 25px; margin: 25px 0; }
          .order-title { font-weight: 700; color: #2c7338; margin-top: 0; font-size: 18px; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px; }
          .order-table { width: 100%; font-size: 14px; }
          .order-table td { padding: 8px 0; }
          .label { color: #64748b; font-weight: 500; }
          .value { text-align: right; font-weight: 600; color: #1e293b; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          .btn { background-color: #2c7338; color: #ffffff !important; padding: 12px 24px; text-decoration: none !important; border-radius: 6px; display: inline-block; font-weight: 600; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${platformName}</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">Order Confirmation</p>
          </div>
          <div class="content">
            <p class="greeting">Hi ${customerName},</p>
            <p>Your eSIM order has been successfully processed! We're excited to help you stay connected on your journey.</p>
            
            <div class="order-box">
              <div class="order-title">Order Summary</div>
              <table class="order-table">
                <tr>
                  <td class="label">Order ID:</td>
                  <td class="value">${order.displayOrderId || order.displayId || order.id}</td>
                </tr>
                <tr>
                  <td class="label">Package:</td>
                  <td class="value">${order.destination || order.packageName || 'eSIM Package'}</td>
                </tr>
                <tr>
                  <td class="label">Data:</td>
                  <td class="value">${order.dataAmount || 'N/A'}</td>
                </tr>
                <tr>
                  <td class="label">Validity:</td>
                  <td class="value">${order.validity ? `${order.validity} Days` : 'N/A'}</td>
                </tr>
                ${order.iccid ? `
                <tr>
                  <td class="label">ICCID:</td>
                  <td class="value"><span style="font-family: monospace;">${order.iccid}</span></td>
                </tr>
                ` : ''}
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td class="label" style="padding-top: 15px; font-weight: 700; color: #1e293b;">Total Amount:</td>
                  <td class="value" style="padding-top: 15px; font-size: 18px; color: #2c7338;">$${order.price || '0.00'}</td>
                </tr>
                <tr>
                  <td class="label">Payment Method:</td>
                  <td class="value" style="text-transform: capitalize;">${order.paymentMethod || 'Card'}</td>
                </tr>
                <tr>
                  <td class="label">Order Date:</td>
                  <td class="value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center;">
              <p style="margin-bottom: 10px; font-weight: 600;">Ready to get started?</p>
              <p style="font-size: 14px; color: #64748b;">You will receive another email shortly with detailed installation instructions and your QR code.</p>
              <a href="${process.env.BASE_URL || 'https://voltey.com'}/my-orders" class="btn">View My Orders</a>
            </div>

            <p style="font-size: 14px; color: #6b7280; text-align: center; margin-top: 40px;">
              Need help? <a href="${settings.helpCenterUrl}" style="color: #2c7338; text-decoration: none;">Visit our Help Center</a> or contact <a href="mailto:${settings.supportEmail}" style="color: #2c7338; text-decoration: none;">${settings.supportEmail}</a>
            </p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${platformName}. All rights reserved.</p>
            <p>Stay connected anywhere in the world.</p>
            <div style="margin-top: 15px;">
              <a href="${baseUrl}/pages/terms-and-condition" style="margin: 0 10px; display: inline-block; color: #9ca3af; text-decoration: none;">Terms & Conditions</a>
              <a href="${baseUrl}/pages/privacy-policy" style="margin: 0 10px; display: inline-block; color: #9ca3af; text-decoration: none;">Privacy Policy</a>
            </div>
          </div>  
        </div>
      </body>
      </html>
    `,
  };
}



export async function generateInstallationEmail(order: any) {
  const settings = await loadSmtpSettings();
  const platformName = settings.platformName;

  // Fetch customer name from user table if userId is present
  let customerName = order.name || order.customerName || 'Traveler';
  if (order.userId) {
    try {
      const userList = await db.select().from(users).where(eq(users.id, order.userId)).limit(1);
      if (userList.length > 0 && userList[0].name) {
        customerName = userList[0].name;
      }
    } catch (err) {
      console.error("Failed to fetch user name for installation email:", err);
    }
  }

  // ✅ Try DB template first
  try {
    const templateRendered = await renderTemplate('esim_installation', {
      customer_name: customerName,
      package_name: order.packageName || 'Your Package',
      qr_code_url: order.qrCodeUrl || '',
      esim_iccid: order.iccid || '',
      activation_code: order.activationCode || order.lpaCode || '',
      smdp_address: order.smdpAddress || '',
      short_url: order.shortUrl || '',
      platform_name: platformName,
    });

    if (templateRendered) return templateRendered;
  } catch (err) {
    console.error("Installation template render failed:", err);
  }

  const lpaCodeToUse = order.lpaCode || order.activationCode;

  // Extract matching ID if it's an LPA string
  let activationCode = lpaCodeToUse;
  if (lpaCodeToUse?.startsWith('LPA:')) {
    const parts = lpaCodeToUse.split('$');
    if (parts.length >= 3) {
      activationCode = parts[2];
    }
  }

  // ✅ qrCodeUrl fallback: try provider URL → Google Charts (from LPA) → yellow box
  const fallbackQrUrl = (order.lpaCode || order.qrCode || "").startsWith('LPA:')
    ? `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(order.lpaCode || order.qrCode)}&chs=250x250&choe=UTF-8&chld=L|2`
    : null;

  const finalQrUrlToUse = order.qrCodeUrl || fallbackQrUrl;

  const qrHtml = finalQrUrlToUse
    ? `
      <img
        src="${finalQrUrlToUse}"
        alt="eSIM QR Code"
        style="max-width:250px;border:2px solid #e5e7eb;border-radius:8px;padding:10px;background:white;"
      />
    `
    : `
      <div style="padding:20px;background:#fff3cd;border-radius:8px;">
        <p style="font-size:13px;color:#856404;margin:0;">
          QR code unavailable. Please use the manual installation code below.
        </p>
      </div>
    `;

  return {
    subject: `Install Your eSIM - ${platformName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
          .container { max-width: 600px; margin: 20px auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 40px 20px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
          .content { padding: 40px 30px; }
          .greeting { font-size: 18px; font-weight: 600; margin-bottom: 10px; }
          .intro { color: #4b5563; margin-bottom: 30px; }
          .reminder-box { background: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; margin-bottom: 30px; border-radius: 4px; }
          .reminder-box h3 { margin-top: 0; font-size: 14px; color: #92400e; text-transform: uppercase; letter-spacing: 0.05em; }
          .reminder-box ul { padding-left: 20px; margin: 10px 0 0 0; font-size: 14px; color: #374151; }
          .step-section { margin-bottom: 40px; }
          .step-title { font-size: 20px; font-weight: 700; color: #111827; border-bottom: 2px solid #f3f4f6; padding-bottom: 10px; margin-bottom: 20px; }
          .option-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
          .option-title { font-weight: 700; color: #2c7338; margin-top: 0; font-size: 16px; }
          .qr-code-container { text-align: center; margin: 25px 0; background: white; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb; display: inline-block; width: 100%; box-sizing: border-box; }
          .qr-code-container img { max-width: 250px; height: auto; }
          .manual-info { background: #f1f5f9; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; margin-top: 10px; border: 1px dashed #cbd5e1; }
          .manual-label { font-family: sans-serif; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 600; }
          .footer { background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
          .btn { background-color: #2c7338; color: #ffffff !important; padding: 12px 24px; text-decoration: none !important; border-radius: 6px; display: inline-block; font-weight: 600; margin-top: 10px; }
          .btn span { color: #ffffff !important; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${platformName} - eSIM Installation</h1>
          </div>
          <div class="content">
            <p class="greeting">Hello ${customerName},</p>
            <p class="intro">Thank you for choosing ${platformName}! To get started with your eSIM, please follow these simple steps:</p>

            <div class="reminder-box">
              <h3>REMINDER! Before proceeding, please ensure:</h3>
              <ul>
                <li>Your device is not carrier-locked.</li>
                <li>You have a stable internet connection when installing eSIM/SIM.</li>
                <li>eSIM activation typically takes 5 to 10 minutes. If it takes longer, try toggling Wi-Fi on and off on your device.</li>
                <li><strong>Note:</strong> Most eSIMs can only be installed once; if removed, they cannot be reinstalled.</li>
              </ul>
            </div>

            <div class="step-section">
              <div class="step-title">FOR FIRST TIME TRAVELERS:</div>
              <div style="font-weight: 700; font-size: 18px; margin-bottom: 15px; color: #111827;">STEP 01: INSTALLATION</div>
              <p style="font-weight: 600; margin-bottom: 15px;">A. eSIM</p>

              <div class="option-box">
                <p class="option-title">Option 01: Direct Installation</p>
                <p style="font-size: 14px; margin-bottom: 0;">On <strong>Account > My SIMs</strong> click the <strong>"Install"</strong> button for your eSIM. Allow the eSIM to download and simply keep clicking continue/accept on the steps displayed by your device to install it. If requested, set it up as <strong>"Secondary"</strong>. Your device will notify you when it is successfully installed.</p>
              </div>

              <div class="option-box">
                <p class="option-title">Option 02: QR Code</p>
                <div style="font-size: 14px;">
                  <p><strong>iOS:</strong></p>
                  <p style="margin-top: 5px;">Display the QR code on another device or use a printed copy, open <strong>Settings > Cellular > Add eSIM</strong>, select <strong>'Use QR Code'</strong>, and scan it with your device's camera.</p>
                  
                  <p style="margin-top: 10px;"><strong>Other options:</strong></p>
                  <ul style="margin-top: 5px;">
                    <li>(a) For iOS 17.4 or later: Long-press the QR code, then tap 'Add eSIM' from the menu.</li>
                    <li>(b) For iOS 17.3 or below: Save the QR code as a photo, go to Settings > Cellular > Add eSIM, select 'Use QR Code', and choose the saved image from Photos to scan and install.</li>
                  </ul>

                  <p style="margin-top: 15px;"><strong>ANDROID:</strong></p>
                  <p style="margin-top: 5px;">Go to <strong>Settings > Network & Internet</strong>, then tap the <strong>"+"</strong> icon. Select <strong>"Don’t have a SIM card?"</strong> and tap <strong>"Next"</strong>. Scan the QR code to proceed.</p>
                  
                  <p style="margin-top: 10px;">Allow the eSIM to download and simply keep clicking continue/accept on the steps displayed by your device to install it. If requested, set it up as <strong>"Secondary"</strong>. Your device will notify you when it is successfully installed.</p>
                </div>
                
                <div class="qr-code-container">
                  <p style="font-size: 12px; color: #6b7280; margin-top: 0; margin-bottom: 10px;">Use the following QR Code:</p>
                  ${qrHtml}
                  ${order.shortUrl ? `
                  <div style="margin-top: 20px;">
                    <a href="${order.shortUrl}" class="btn"><span style="color: #ffffff !important;">Quick Install eSIM</span></a>
                  </div>
                  ` : ''}
                  <div style="margin-top: 15px; font-family: monospace; font-size: 14px; font-weight: 600;">SN: ${order.iccid || 'N/A'}</div>
                </div>
              </div>

              <div class="option-box">
                <p class="option-title">Option 03: Manual Installation</p>
                <p style="font-size: 14px;">To manually activate an eSIM, go to the relevant settings on your device: <strong>[Cellular/Mobile Data]</strong> on iPhone, <strong>[Connections] > [SIM Card Manager]</strong> on Samsung Android, or <strong>[Network & Internet]</strong> on Google Android. Enter the SM-DP+ Address and activation code provided below:</p>
                <div class="manual-info">
                  <div class="manual-label">SM-DP+ ADDRESS</div>
                  <div>${order.smdpAddress || 'Unavailable'}</div>
                  <div class="manual-label" style="margin-top: 10px;">ACTIVATION CODE</div>
                  <div>${activationCode || 'Unavailable'}</div>
                </div>
                <p style="font-size: 14px; margin-top: 15px;">Allow the eSIM to download and simply keep clicking continue/accept on the steps displayed by your device to install it. If requested, set it up as <strong>"Secondary"</strong>. Your device will notify you when it is successfully installed.</p>
              </div>

              <p style="font-weight: 600; margin-top: 30px; margin-bottom: 15px;">B. Physical SIM</p>
              <p style="font-size: 14px;">On <strong>Account > Link Starter Pack</strong>, scan the barcode of your Physical SIM card or enter the code manually to activate. Under <strong>Account > My SIMs</strong> you can check if your SIM card was correctly activated. After following STEP 02, install the SIM in your phone by ejecting your current one and replacing it with ${platformName} SIM or installing ${platformName} SIM in an additional slot.</p>
            </div>

            <div class="step-section">
              <div style="font-weight: 700; font-size: 18px; margin-bottom: 15px; color: #111827;">STEP 02: ACTIVATE YOUR PLAN</div>
              <p style="font-size: 14px;">On <strong>Account > My Plans</strong> make sure you have an active plan or activate the desired plan to be used. Make sure to check the coverage of the plan if necessary.</p>
              <p style="font-size: 14px; font-style: italic; color: #6b7280;">Please note that it may take at least 5-15 minutes for your internet to be connected.</p>
            </div>

            <div class="step-section">
              <div style="font-weight: 700; font-size: 18px; margin-bottom: 15px; color: #111827;">STEP 03: NETWORK CONFIGURATION</div>
              <p style="font-size: 14px; margin-bottom: 15px;"><strong>Tip:</strong> By default, your eSIM may be labeled as Secondary, Travel, Business, or another preset name. Tap on it on your device settings and rename it to <strong>${platformName}</strong> or other desired name to make it easier to identify it.</p>
              
              <div style="font-size: 14px;">
                <p><strong>A. Activate the eSIM/SIM and enable Roaming:</strong></p>
                <p>Go to your device's <strong>"Cellular"</strong> or <strong>"Mobile Data"</strong> settings. Make sure your ${platformName} eSIM/SIM is <strong>"On"</strong>. If not, set it to be <strong>"On"</strong>. Make sure <strong>Data Roaming</strong> is enabled for it.</p>
                <p style="margin-top: 10px; color: #6b7280;"><em>Tip: It is recommended to turn off your primary SIM/eSIM (main primary line you use in your home country/town) to avoid unexpected costs due to mistaken configuration.</em></p>

                <p style="margin-top: 20px;"><strong>B. Set Default Network:</strong></p>
                <p>Ensure the correct network is set to come from your ${platformName} eSIM/SIM. If your device connects to the wrong network, disable automatic selection and manually choose a supported network.</p>

                <p style="margin-top: 20px;"><strong>C. Configure APN if needed:</strong></p>
                <p>For iOS devices the APN should be set automatically during installation. For Android devices, manual APN setup is required. Go to <strong>"Mobile Data Network"</strong> settings. Manually enter APN information provided in your plan details under <strong>Account > My Plans</strong> (can be found at plan info email as well). Restart your device.</p>
              </div>
            </div>

            <div class="step-section">
              <div style="font-weight: 700; font-size: 18px; margin-bottom: 15px; color: #111827;">FOR SUBSEQUENT TRAVELS:</div>
              <p style="font-size: 14px;">Make sure the desired plan is activated in your app. On <strong>'Cellular'</strong> or <strong>'Mobile Data'</strong> device settings, tap on the active SIM card label and select the desired eSIM or SIM for use.</p>
            </div>

            <p style="font-weight: 600; margin-top: 40px;">Best Regards,</p>
            <p>Team ${platformName}</p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px;">
              <p style="margin-bottom: 10px;"><a href="${settings.helpCenterUrl}" style="color: #2c7338; text-decoration: none; font-weight: 600;">Visit our Help Center</a></p>
              <p>Contact us at <a href="mailto:${settings.supportEmail}" style="color: #2c7338; text-decoration: none;">${settings.supportEmail}</a></p>
              ${settings.whatsappNumber ? `<p>Message us on WhatsApp at <a href="https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #2c7338; text-decoration: none;">${settings.whatsappNumber}</a></p>` : ''}
              <p style="margin-top: 20px; font-weight: 600; color: #111827;">Stay connected anywhere in the world. Take ${platformName} with you!</p>
            </div>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} ${platformName}. All rights reserved.</p>
            <p><a href="${process.env.BASE_URL || 'https://voltey.com'}/pages/terms-and-condition" style="color: #9ca3af; text-decoration: none; margin: 0 5px;">Terms and Conditions</a> | <a href="${process.env.BASE_URL || 'https://voltey.com'}/pages/privacy-policy" style="color: #9ca3af; text-decoration: none; margin: 0 5px;">Privacy Policy</a></p>
            <div style="margin-top: 15px;">
              ${settings.linkedinUrl !== '#' ? `<a href="${settings.linkedinUrl}" style="margin: 0 10px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="20" alt="LinkedIn"></a>` : ''}
              ${settings.facebookUrl !== '#' ? `<a href="${settings.facebookUrl}" style="margin: 0 10px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" width="20" alt="Facebook"></a>` : ''}
              ${settings.youtubeUrl !== '#' ? `<a href="${settings.youtubeUrl}" style="margin: 0 10px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/1384/1384060.png" width="20" alt="YouTube"></a>` : ''}
              ${settings.instagramUrl !== '#' ? `<a href="${settings.instagramUrl}" style="margin: 0 10px; display: inline-block;"><img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="20" alt="Instagram"></a>` : ''}
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export async function generateLowDataEmail(data: {
  userName: string;
  threshold: string;
  remainingData: string;
  totalData: string;
  packageName: string;
  iccid: string;
  expiryDate?: string;
  topupUrl: string;
}) {
  const { userName, threshold, remainingData, totalData, packageName, iccid, expiryDate, topupUrl } = data;

  // Map threshold to event type
  const eventTypeMap: Record<string, string> = {
    "75_percent": "low_data_75",
    "90_percent": "low_data_90",
    "3_days": "expiring_3days",
    "1_day": "expiring_1day",
  };

  const eventType = eventTypeMap[threshold];

  // Calculate percentage and days for templates
  const dataUsedPercentage = threshold === "75_percent" ? "75" : threshold === "90_percent" ? "90" : "0";
  const daysUntilExpiry = threshold === "3_days" ? "3" : threshold === "1_day" ? "1" : "0";

  // Try to use database template if event type mapped
  if (eventType) {
    const templateRendered = await renderTemplate(eventType, {
      customer_name: userName,
      esim_iccid: iccid,
      country: packageName, // packageName often contains country info
      data_used_percentage: dataUsedPercentage,
      data_remaining: remainingData,
      topup_link: topupUrl,
      expiry_date: expiryDate ? new Date(expiryDate).toLocaleDateString() : '',
      days_until_expiry: daysUntilExpiry,
    });

    if (templateRendered) {
      return templateRendered;
    }
  }

  // Fallback to hardcoded template
  let title = "";
  let urgencyLevel = "";
  let message = "";
  let actionText = "";

  // Customize message based on threshold
  switch (threshold) {
    case "10_percent":
      title = "Usage Update: 10% Data Used";
      urgencyLevel = "Notice";
      message = `You've used 10% of your data on your ${packageName} eSIM. You have ${remainingData} remaining out of ${totalData}.`;
      actionText = "Just a friendly update on your data usage.";
      break;
    case "75_percent":
    case "80_percent":
      title = "Your eSIM Data is Running Low";
      urgencyLevel = "Notice";
      message = `You've used ${threshold === "75_percent" ? "75%" : "80%"} of your data on your ${packageName} eSIM. You have ${remainingData} remaining out of ${totalData}.`;
      actionText = "Consider topping up to avoid running out during your trip.";
      break;
    case "90_percent":
      title = "Almost Out of Data!";
      urgencyLevel = "Warning";
      message = `You've used 90% of your data on your ${packageName} eSIM. Only ${remainingData} remaining out of ${totalData}!`;
      actionText = "Top up now to stay connected.";
      break;
    case "100_percent":
      title = "Out of Data!";
      urgencyLevel = "Urgent";
      message = `You've used 100% of your data on your ${packageName} eSIM. You have no data remaining!`;
      actionText = "Top up immediately to restore connectivity.";
      break;
    case "3_days":
      title = "Your eSIM Expires in 3 Days";
      urgencyLevel = "Notice";
      message = `Your ${packageName} eSIM will expire in 3 days${expiryDate ? ` on ${new Date(expiryDate).toLocaleDateString()}` : ''}.`;
      actionText = "Renew now to continue using your eSIM.";
      break;
    case "1_day":
      title = "Urgent: Your eSIM Expires Tomorrow!";
      urgencyLevel = "Urgent";
      message = `Your ${packageName} eSIM expires tomorrow${expiryDate ? ` on ${new Date(expiryDate).toLocaleDateString()}` : ''}. Don't lose connectivity!`;
      actionText = "Top up immediately to extend your service.";
      break;
  }

  const urgencyColor = urgencyLevel === "Urgent" ? "#dc2626" : urgencyLevel === "Warning" ? "#f59e0b" : "#2c7338";

  return {
    subject: title,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white;">
          <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${smtp.platformName}</h1>
          </div>
          <div style="padding: 40px 30px;">
            <div style="background: ${urgencyColor}15; border-left: 4px solid ${urgencyColor}; padding: 20px; margin-bottom: 30px; border-radius: 4px;">
              <p style="margin: 0; color: ${urgencyColor}; font-weight: bold; font-size: 14px; text-transform: uppercase;">${urgencyLevel}</p>
              <h2 style="margin: 10px 0 0 0; font-size: 20px; color: #1f2937;">${title}</h2>
            </div>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">Hi ${userName},</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">${message}</p>
            <p style="font-size: 16px; line-height: 1.6; color: #374151;">${actionText}</p>
            
            <div style="background: #f0fdf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 16px; color: #1f2937;">eSIM Details</h3>
              <table style="width: 100%; font-size: 14px; color: #6b7280;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Package:</strong></td>
                  <td style="padding: 8px 0;">${packageName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Remaining:</strong></td>
                  <td style="padding: 8px 0;">${remainingData} of ${totalData}</td>
                </tr>
                ${expiryDate ? `
                <tr>
                  <td style="padding: 8px 0;"><strong>Expires:</strong></td>
                  <td style="padding: 8px 0;">${new Date(expiryDate).toLocaleDateString()}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0;"><strong>ICCID:</strong></td>
                  <td style="padding: 8px 0; font-family: monospace; font-size: 12px;">${iccid}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 35px 0;">
              <a href="${topupUrl}" style="display: inline-block; background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: bold; font-size: 16px;">Top Up Now</a>
            </div>
            
            <div style="background: #f0fdf4; border-left: 4px solid #2c7338; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 14px; color: #2c7338;"><strong>Tip:</strong> Top up before you run out to avoid any interruption in service. Your eSIM will continue working seamlessly!</p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">Need help? Contact our support team at ${smtp.supportEmail}</p>
          </div>
          <div style="background: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">© ${new Date().getFullYear()} ${smtp.platformName}. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}

export async function generateCustomNotificationEmail(subject: string, message: string, userName: string, userEmail?: string) {
  // Try to use database template first
  // For custom notifications, we don't use the message variable since admins provide full content
  // But we can still use the template for consistent branding
  const settings = await loadSmtpSettings();
  const templateRendered = await renderTemplate('custom', {
    customer_name: userName,
    customer_email: userEmail || '',
    platform_name: settings.platformName,
  });

  // If template exists, we'll use the admin's custom subject and message instead of template
  // This preserves the custom notification functionality

  // Convert line breaks to <br> tags and convert URLs to links
  const formattedMessage = message
    .replace(/\n/g, '<br>')
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" style="color: #3d9a4d; text-decoration: underline;">$1</a>');

  // Fallback to hardcoded template
  return {
    subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${settings.platformName}</h1>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Hi ${userName},</p>
          <div style="font-size: 16px; line-height: 1.8; color: #374151;">
            ${formattedMessage}
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            If you have any questions, feel free to reach out to our support team.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ${settings.platformName}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };
}

interface EnterpriseQuoteEmailData {
  to: string;
  companyName: string;
  quoteId: string;
  packageName: string;
  destination: string;
  quantity: number;
  unitPrice: string;
  discountPercent: string;
  totalPrice: string;
  validUntil: Date;
  notes: string | null;
}

export async function sendEnterpriseQuoteEmail(data: EnterpriseQuoteEmailData) {
  const settings = await loadSmtpSettings();
  const formattedValidUntil = new Date(data.validUntil).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const discountAmount = parseFloat(data.unitPrice) * (parseFloat(data.discountPercent) / 100) * data.quantity;
  const subtotal = parseFloat(data.unitPrice) * data.quantity;

  const template = {
    subject: `New Bulk eSIM Quote for ${data.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #2c7338 0%, #3d9a4d 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">${settings.platformName}</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Enterprise Quote</p>
        </div>
        <div style="background: #f0fdf4; padding: 40px; border-radius: 0 0 10px 10px;">
          <p style="font-size: 16px; margin-bottom: 20px;">Dear ${data.companyName},</p>
          <p style="font-size: 16px; margin-bottom: 30px;">We're pleased to provide you with a bulk eSIM quote:</p>
          
          <div style="background: white; border-radius: 8px; padding: 25px; margin: 30px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <h2 style="color: #1f2937; font-size: 18px; margin: 0 0 20px 0; padding-bottom: 15px; border-bottom: 2px solid #e5e7eb;">Quote Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Quote ID:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.quoteId}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Package:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.packageName}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Destination:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.destination}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Quantity:</td>
                <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1f2937;">${data.quantity} eSIMs</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Unit Price:</td>
                <td style="padding: 12px 0; text-align: right; color: #1f2937;">$${parseFloat(data.unitPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Subtotal:</td>
                <td style="padding: 12px 0; text-align: right; color: #1f2937;">$${subtotal.toFixed(2)}</td>
              </tr>
              ${parseFloat(data.discountPercent) > 0 ? `
              <tr>
                <td style="padding: 12px 0; color: #10b981; font-size: 14px;">Discount (${data.discountPercent}%):</td>
                <td style="padding: 12px 0; text-align: right; color: #10b981;">-$${discountAmount.toFixed(2)}</td>
              </tr>
              ` : ''}
              <tr style="border-top: 2px solid #e5e7eb;">
                <td style="padding: 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Total Price:</td>
                <td style="padding: 15px 0; text-align: right; color: #2c7338; font-size: 20px; font-weight: 700;">$${parseFloat(data.totalPrice).toFixed(2)}</td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6b7280; font-size: 14px;">Valid Until:</td>
                <td style="padding: 12px 0; text-align: right; color: #ef4444; font-weight: 600;">${formattedValidUntil}</td>
              </tr>
            </table>
            
            ${data.notes ? `
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px 0;">Additional Notes:</p>
              <p style="color: #1f2937; font-size: 14px; margin: 0; line-height: 1.6;">${data.notes}</p>
            </div>
            ` : ''}
          </div>
          
          <p style="font-size: 16px; margin: 30px 0 20px 0;">To accept this quote and place your bulk order, please log in to your enterprise portal or contact our sales team.</p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
            This quote is valid until ${formattedValidUntil}. After this date, pricing and availability may change.
          </p>
          
          <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
            If you have any questions or need to discuss this quote, please don't hesitate to reach out to our enterprise team.
          </p>
        </div>
        <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
          <p>© ${new Date().getFullYear()} ${settings.platformName}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
  };

  await sendEmail({
    to: data.to,
    subject: template.subject,
    html: template.html,
  });
}
