import axios from "axios";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    const order = req.body;

    // ✅ نتأكد أن الأوردر مدفوع
    if (order.financial_status === "paid") {
      const ozoneResponse = await axios.post(
        "https://client.ozoneexpress.ma/api/colis",
        {
          name: `${order.shipping_address.first_name} ${order.shipping_address.last_name}`,
          phone: order.shipping_address.phone,
          city: order.shipping_address.city,
          address: order.shipping_address.address1,
          total: order.total_price,
          reference: order.name
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OZONE_API_KEY}`
          }
        }
      );

      console.log("✅ Ozone response:", ozoneResponse.data);
    }

    res.status(200).json({ message: "OK" });
  } catch (error) {
    console.error("❌ Error sending to Ozone:", error.message);
    res.status(500).json({ error: "Error sending to Ozone" });
  }
}
