import fetch from "node-fetch";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  // Only allow your Xstream domain for security
  if (!url.startsWith("http://cf.cdn-959.me/")) {
    return res.status(403).json({ error: "Invalid target" });
  }

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    // Pass through headers for video streaming
    res.setHeader("Content-Type", response.headers.get("content-type") || "video/MP2T");
    res.setHeader("Access-Control-Allow-Origin", "*"); // CORS for browser
    res.setHeader("Cache-Control", "no-cache");

    const body = await response.arrayBuffer();
    res.status(200).send(Buffer.from(body));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch stream" });
  }
}
