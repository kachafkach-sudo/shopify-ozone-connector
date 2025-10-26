export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const order = req.body;

  // التحقق من المفاتيح البيئية
  const clientId = process.env.OZONE_CLIENT_ID;
  const apiKey = process.env.OZONE_API_KEY;

  if (!clientId || !apiKey) {
    return res.status(500).json({ error: 'Missing Ozone API credentials' });
  }

  try {
    // إرسال البيانات إلى Ozone Express
    const response = await fetch('https://api.ozonexpress.ma/api/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': clientId,
        'Api-Key': apiKey,
      },
      body: JSON.stringify({
        order_id: order.id,
        customer_name: order.customer?.first_name + ' ' + order.customer?.last_name,
        address: order.shipping_address?.address1,
        city: order.shipping_address?.city,
        phone: order.shipping_address?.phone,
        cod_amount: order.total_price,
      }),
    });

    const data = await response.json();
    res.status(200).json({ message: 'Order sent to Ozone successfully', data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending order to Ozone' });
  }
}
