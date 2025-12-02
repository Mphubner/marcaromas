import nodemailer from 'nodemailer';

// Create transporter using SMTP configuration from .env
let transporter = null;

const initializeTransporter = () => {
  if (transporter) return transporter;

  const smtpConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  };

  // Check if SMTP is configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('[Email Service] SMTP not fully configured. Email sending will be disabled.');
    return null;
  }

  transporter = nodemailer.createTransport(smtpConfig);

  // Verify connection
  transporter.verify((error, success) => {
    if (error) {
      console.error('[Email Service] SMTP connection error:', error);
    } else {
      console.log('[Email Service] SMTP server is ready to send emails');
    }
  });

  return transporter;
};

/**
 * Send gift notification email to recipient
 */
export const sendGiftNotificationEmail = async (giftData, planData) => {
  const transport = initializeTransporter();

  if (!transport) {
    console.warn('[Email Service] Skipping email send - SMTP not configured');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const {
      recipientName,
      recipientEmail,
      giverName,
      message,
      duration,
    } = giftData;

    // Generate HTML email with digital card
    const htmlContent = generateGiftCardHTML({
      recipientName,
      giverName,
      message,
      planName: planData.name,
      duration,
    });

    const mailOptions = {
      from: `"Marc Aromas" <${process.env.SMTP_USER}>`,
      to: recipientEmail,
      subject: `🎁 Você recebeu um presente especial de ${giverName}!`,
      html: htmlContent,
    };

    const info = await transport.sendMail(mailOptions);

    console.log('[Email Service] Gift notification sent:', info.messageId);

    return {
      success: true,
      messageId: info.messageId,
    };

  } catch (error) {
    console.error('[Email Service] Error sending gift notification:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Generate HTML for digital gift card
 */
function generateGiftCardHTML({ recipientName, giverName, message, planName, duration }) {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Presente Marc Aromas</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #FAFAF9 0%, #F9F8F6 100%);
      padding: 40px 20px;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #8B7355 0%, #D4A574 100%);
      padding: 60px 40px;
      text-align: center;
      color: white;
    }
    .gift-icon {
      font-size: 64px;
      margin-bottom: 20px;
      animation: bounce 2s infinite;
    }
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .header h1 {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 36px;
      margin-bottom: 10px;
      font-weight: 700;
    }
    .header p {
      font-size: 18px;
      opacity: 0.95;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 20px;
      color: #2C2419;
      margin-bottom: 20px;
      font-weight: 600;
    }
    .message-box {
      background: linear-gradient(135deg, rgba(139, 115, 85, 0.05) 0%, rgba(212, 165, 116, 0.05) 100%);
      border-left: 4px solid #8B7355;
      padding: 24px;
      margin: 30px 0;
      border-radius: 12px;
    }
    .message-text {
      font-size: 16px;
      line-height: 1.8;
      color: #4A4A4A;
      font-style: italic;
      white-space: pre-wrap;
    }
    .message-signature {
      text-align: right;
      margin-top: 16px;
      font-size: 14px;
      color: #8B7355;
      font-weight: 600;
    }
    .gift-details {
      background: #FAFAF9;
      padding: 24px;
      border-radius: 12px;
      margin: 30px 0;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #E5E5E5;
    }
    .detail-row:last-child {
      border-bottom: none;
    }
    .detail-label {
      color: #6B6B6B;
      font-size: 14px;
    }
    .detail-value {
      color: #2C2419;
      font-weight: 600;
      font-size: 14px;
    }
    .highlight {
      background: linear-gradient(135deg, #8B7355 0%, #D4A574 100%);
      color: white;
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 14px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #8B7355 0%, #D4A574 100%);
      color: white;
      padding: 18px 40px;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
      box-shadow: 0 4px 12px rgba(139, 115, 85, 0.3);
      transition: transform 0.2s;
    }
    .cta-button:hover {
      transform: translateY(-2px);
    }
    .benefits {
      margin: 30px 0;
    }
    .benefit-item {
      display: flex;
      align-items: flex-start;
      margin: 16px 0;
    }
    .check-icon {
      color: #8B7355;
      margin-right: 12px;
      font-size: 20px;
      flex-shrink: 0;
    }
    .benefit-text {
      color: #4A4A4A;
      font-size: 14px;
      line-height: 1.6;
    }
    .footer {
      background: #2C2419;
      color: white;
      padding: 40px;
      text-align: center;
    }
    .footer-logo {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 24px;
      margin-bottom: 16px;
      font-weight: 700;
    }
    .footer-text {
      font-size: 14px;
      opacity: 0.8;
      line-height: 1.6;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-link {
      display: inline-block;
      margin: 0 10px;
      color: white;
      text-decoration: none;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="gift-icon">🎁</div>
      <h1>Você Ganhou um Presente!</h1>
      <p>Uma experiência aromática especial espera por você</p>
    </div>

    <!-- Main Content -->
    <div class="content">
      <p class="greeting">Olá, ${recipientName}! 💛</p>
      
      <p style="font-size: 16px; line-height: 1.8; color: #4A4A4A; margin-bottom: 20px;">
        Temos uma surpresa incrível para você! <strong>${giverName}</strong> escolheu presenteá-lo(a) 
        com uma assinatura exclusiva da <strong>Marc Aromas</strong>, uma experiência sensorial única 
        que trará momentos especiais de bem-estar e relaxamento para sua vida.
      </p>

      <!-- Personal Message -->
      ${message ? `
      <div class="message-box">
        <p class="message-text">"${message}"</p>
        <p class="message-signature">- ${giverName}</p>
      </div>
      ` : ''}

      <!-- Gift Details -->
      <div class="gift-details">
        <h3 style="color: #2C2419; margin-bottom: 16px; font-size: 18px;">
          📋 Detalhes do Presente
        </h3>
        <div class="detail-row">
          <span class="detail-label">Plano:</span>
          <span class="detail-value">${planName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Duração:</span>
          <span class="detail-value">
            <span class="highlight">${duration} ${duration === 1 ? 'mês' : 'meses'}</span>
          </span>
        </div>
        <div class="detail-row">
          <span class="detail-label">Primeira entrega:</span>
          <span class="detail-value">Em breve!</span>
        </div>
      </div>

      <!-- Benefits -->
      <div class="benefits">
        <h3 style="color: #2C2419; margin-bottom: 20px; font-size: 18px;">
          ✨ O que você vai receber:
        </h3>
        <div class="benefit-item">
          <span class="check-icon">✓</span>
          <p class="benefit-text">
            <strong>Velas artesanais premium</strong> entregues mensalmente na sua casa
          </p>
        </div>
        <div class="benefit-item">
          <span class="check-icon">✓</span>
          <p class="benefit-text">
            <strong>Aromas exclusivos</strong> cuidadosamente selecionados
          </p>
        </div>
        <div class="benefit-item">
          <span class="check-icon">✓</span>
          <p class="benefit-text">
            <strong>Embalagem premium</strong> perfeita para presente
          </p>
        </div>
        <div class="benefit-item">
          <span class="check-icon">✓</span>
          <p class="benefit-text">
            <strong>Conteúdo exclusivo</strong> sobre aromaterapia e bem-estar
          </p>
        </div>
      </div>

      <!-- CTA Button -->
      <div style="text-align: center; margin: 40px 0;">
        <a href="${process.env.FRONTEND_URL || 'https://marcaromas.com'}" class="cta-button">
          Acessar Minha Conta
        </a>
      </div>

      <p style="font-size: 14px; color: #6B6B6B; text-align: center; margin-top: 30px;">
        Prepare-se para uma jornada aromática inesquecível! 🕯️✨
      </p>
    </div>

    <!-- Footer -->
    <div class="footer">
      <div class="footer-logo">Marc Aromas</div>
      <p class="footer-text">
        Transformando momentos comuns em experiências extraordinárias<br>
        através do poder dos aromas.
      </p>
      <div class="social-links">
        <a href="#" class="social-link">Instagram</a>
        <a href="#" class="social-link">Facebook</a>
        <a href="#" class="social-link">WhatsApp</a>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Send test email (for debugging)
 */
export const sendTestEmail = async (to) => {
  const transport = initializeTransporter();

  if (!transport) {
    throw new Error('SMTP not configured');
  }

  const mailOptions = {
    from: `"Marc Aromas" <${process.env.SMTP_USER}>`,
    to,
    subject: 'Test Email - Marc Aromas',
    html: '<h1>Test Email</h1><p>If you received this, your SMTP is working!</p>',
  };

  const info = await transport.sendMail(mailOptions);
  return info;
};

/**
 * Send generic email
 */
export const sendEmail = async ({ to, subject, html }) => {
  const transport = initializeTransporter();
  if (!transport) {
    console.warn('[Email Service] Skipping email send - SMTP not configured');
    return { success: false, error: 'SMTP not configured' };
  }

  try {
    const info = await transport.sendMail({
      from: `"Marc Aromas" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[Email Service] Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email Service] Error sending email:', error);
    throw error;
  }
};

export default {
  sendGiftNotificationEmail,
  sendTestEmail,
  sendEmail,
};
