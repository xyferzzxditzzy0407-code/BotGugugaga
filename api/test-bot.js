export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return res.status(500).json({
      error: "TELEGRAM_BOT_TOKEN atau TELEGRAM_CHAT_ID belum diset"
    });
  }

  const message =
`🧪 TEST BOT

Sender: Apple
Client: client07
Country: Pakistan
Status: DELIVERED

TEST CODE: 123456

⚠️ Pesan ini hanya untuk testing.`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message
        })
      }
    );

    const data = await response.json();

    if (!response.ok || !data.ok) {
      return res.status(500).json({
        error: "Telegram gagal mengirim pesan",
        detail: data
      });
    }

    return res.status(200).json({
      success: true,
      message: "Test berhasil dikirim"
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
