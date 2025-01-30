import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { influencer } = req.query;
  try {
    const response = await axios.get(`https://api.twitter.com/2/tweets?query=${influencer}`, {
      headers: { Authorization: `Bearer ${process.env.TWITTER_API_KEY}` }
    });
    res.status(200).json({ tweets: response.data });
  } catch (error) {
    res.status(500).json({ error: "Error fetching tweets" });
  }
}
