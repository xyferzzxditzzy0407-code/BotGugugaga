export default async function handler(req, res) {
  const apiUrl = process.env.TRAFFIC_API_URL;
  const apiKey = process.env.TRAFFIC_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(500).json({
      error: "TRAFFIC_API_URL atau TRAFFIC_API_KEY belum diset"
    });
  }

  try {
    const response = await fetch(apiUrl, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    // Jangan meneruskan messageBody/kode ke Telegram.
    const rows = (data.rows || []).map(row => ({
      id: row.id,
      receivedAt: row.receivedAt,
      clientName: row.clientName,
      sourceAddress: row.sourceAddress,
      rangeName: row.rangeName,
      rangeTemplate: row.rangeTemplate,
      destinationNumber: row.destinationNumber,
      messageBody : row.messageBody,
      rate: row.rate,
      status: row.status
    }));

    return res.status(200).json({
      rows,
      total: data.total ?? rows.length,
      page: data.page,
      pageSize: data.pageSize
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
