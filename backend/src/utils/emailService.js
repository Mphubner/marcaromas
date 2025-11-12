import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    console.warn("SMTP not configured, skipping email send");
    return;
  }
  await transporter.sendMail({
    from: `"Marc Aromas" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text,
    html,
  });
}

/**
 * Enviar email de confirmação de pagamento
 */
export async function sendPaymentConfirmationEmail(order, user) {
  try {
    if (!process.env.SMTP_HOST) {
      console.warn("SMTP not configured, skipping payment confirmation email");
      return;
    }

    const itemsHtml = order.items
      .map(item => `<tr><td>${item.productId}</td><td>${item.quantity}</td><td>R$ ${item.price.toFixed(2)}</td></tr>`)
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #9b59b6; color: white; padding: 20px; border-radius: 5px; }
            .content { margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f0f0f0; }
            .total { font-size: 18px; font-weight: bold; color: #27ae60; }
            .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pagamento Confirmado! ✓</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <p>Seu pagamento foi processado com sucesso!</p>
              
              <h3>Detalhes do Pedido:</h3>
              <table>
                <tr>
                  <th>Produto</th>
                  <th>Quantidade</th>
                  <th>Preço</th>
                </tr>
                ${itemsHtml}
              </table>
              
              <p class="total">Total: R$ ${order.total.toFixed(2)}</p>
              
              <h3>Informações:</h3>
              <ul>
                <li><strong>ID do Pedido:</strong> #${order.id}</li>
                <li><strong>Status:</strong> ${order.status}</li>
                <li><strong>Data:</strong> ${new Date(order.createdAt).toLocaleDateString('pt-BR')}</li>
              </ul>
              
              <p>Você receberá atualizações sobre o andamento da sua encomenda por email.</p>
              
              <p>Dúvidas? Entre em contato conosco em <a href="mailto:suporte@marcaromas.com">suporte@marcaromas.com</a></p>
            </div>
            
            <div class="footer">
              <p>© 2025 Marc Aromas. Todos os direitos reservados.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendMail({
      to: user.email,
      subject: `Pagamento Confirmado - Pedido #${order.id}`,
      html,
    });

    console.log(`✅ Email de confirmação enviado para ${user.email}`);
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
  }
}

/**
 * Enviar email de falha de pagamento
 */
export async function sendPaymentFailureEmail(order, user, reason) {
  try {
    if (!process.env.SMTP_HOST) {
      console.warn("SMTP not configured, skipping payment failure email");
      return;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #e74c3c; color: white; padding: 20px; border-radius: 5px; }
            .content { margin: 20px 0; }
            .alert { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Pagamento Não Autorizado ✗</h1>
            </div>
            
            <div class="content">
              <p>Olá <strong>${user.name}</strong>,</p>
              <p>Desculpe, não conseguimos processar seu pagamento.</p>
              
              <div class="alert">
                <strong>Motivo:</strong> ${reason}
              </div>
              
              <h3>O que fazer:</h3>
              <ol>
                <li>Verifique os dados do seu cartão</li>
                <li>Certifique-se que tem saldo disponível</li>
                <li>Tente novamente com outro método de pagamento</li>
                <li>Entre em contato conosco se o problema persistir</li>
              </ol>
              
              <h3>Detalhes do Pedido:</h3>
              <ul>
                <li><strong>ID do Pedido:</strong> #${order.id}</li>
                <li><strong>Valor:</strong> R$ ${order.total.toFixed(2)}</li>
              </ul>
              
              <p><a href="${process.env.FRONTEND_URL}/payment/failure?id=${order.id}">Clique aqui para tentar novamente</a></p>
              
              <p>Precisa de ajuda? Entre em contato: <a href="mailto:suporte@marcaromas.com">suporte@marcaromas.com</a></p>
            </div>
          </div>
        </body>
      </html>
    `;

    await sendMail({
      to: user.email,
      subject: `Pagamento Recusado - Pedido #${order.id}`,
      html,
    });

    console.log(`✅ Email de falha enviado para ${user.email}`);
  } catch (error) {
    console.error('Erro ao enviar email de falha:', error);
  }
}
