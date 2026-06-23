import nodemailer from "nodemailer";

// Build a Gmail SMTP transporter, or null when credentials are missing.
function getTransporter() {
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASS;

  if (!user || !pass) {
    console.warn("MAIL_USER/MAIL_PASS not set: email is disabled");
    return null;
  }

  return nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // SSL on port 465
    auth: { user, pass },
  });
}

// Responsive, email-client-safe welcome template.
// Uses table layout and inline styles because Gmail/Outlook strip <style>
// blocks and don't support fl/grid layouts.
function welcomeTemplate(nombre: string, appUrl: string): string {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 0;margin:0;font-family:Arial,Helvetica,sans-serif">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,0.06)">
          <tr>
            <td style="background:#ea580c;padding:32px;text-align:center">
              <span style="font-size:40px;line-height:1">🍳</span>
              <h1 style="color:#ffffff;margin:8px 0 0;font-size:24px;font-weight:bold">RecetasApp</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px">
              <h2 style="color:#18181b;margin:0 0 12px;font-size:20px">¡Hola ${nombre}! 👋</h2>
              <p style="color:#52525b;font-size:15px;line-height:1.7;margin:0 0 28px">
                Tu cuenta ya está lista. En RecetasApp puedes explorar cientos de
                recetas, guardar tus favoritas y descubrir nuevos platos para
                cocinar. ¡Empecemos a cocinar algo delicioso!
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="border-radius:8px;background:#ea580c">
                    <a href="${appUrl}" target="_blank"
                       style="display:inline-block;padding:13px 30px;color:#ffffff;font-size:15px;font-weight:bold;text-decoration:none">
                      Explorar recetas
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 32px;background:#fafafa;border-top:1px solid #eeeeee;text-align:center">
              <p style="color:#a1a1aa;font-size:12px;line-height:1.6;margin:0">
                Recibiste este correo porque te registraste en RecetasApp.<br/>
                © RecetasApp
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>`;
}

// Welcome email sent after a successful registration.
export async function sendWelcomeEmail(nombre: string, email: string): Promise<void> {
  const transporter = getTransporter();
  if (!transporter) return; // no credentials: skip silently (already warned)

  // The email link must be absolute. Prefer the configured public URL; on
  // Vercel fall back to the auto-injected deployment URL; localhost in dev.
  const appUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  await transporter.sendMail({
    from: `"RecetasApp" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "¡Bienvenido a RecetasApp! 🍳",
    // Plain-text fallback for clients that don't render HTML.
    text: `Hola ${nombre}, tu cuenta en RecetasApp ya está lista. Explora recetas en ${appUrl}`,
    html: welcomeTemplate(nombre, appUrl),
  });
}
