import * as nodemailer from 'nodemailer';

let transporter: nodemailer.Transporter | null = null;

function obtenerTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  return transporter;
}

// Sin SMTP_HOST configurado, no falla: solo loguea y sigue (permite desarrollar sin credenciales).
export async function enviarCorreo(destinatario: string, asunto: string, html: string): Promise<{ enviado: boolean }> {
  if (!process.env.SMTP_HOST) {
    console.warn(`[mail] SMTP no configurado; se omite envío a ${destinatario}: ${asunto}`);
    return { enviado: false };
  }
  try {
    await obtenerTransporter().sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: destinatario,
      subject: asunto,
      html,
    });
    return { enviado: true };
  } catch (err) {
    console.error('[mail] Error enviando correo:', err);
    return { enviado: false };
  }
}
