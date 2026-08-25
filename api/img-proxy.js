const ALLOWED_DAICHI_HOSTS = new Set(["daichi.business", "daichi.market"]);

export default async function handler(req, res) {
  const rawUrl = Array.isArray(req.query.url) ? req.query.url[0] : req.query.url;
  let imageUrl;

  try {
    imageUrl = new URL(rawUrl);
  } catch {
    return res.status(400).send("Invalid URL");
  }

  if (imageUrl.protocol !== "https:" || !ALLOWED_DAICHI_HOSTS.has(imageUrl.hostname)) {
    return res.status(403).send("Forbidden");
  }

  try {
    const response = await fetch(imageUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
    });
    if (!response.ok) return res.status(response.status).send("Fetch error");

    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.status(200).send(buffer);
  } catch {
    return res.status(500).send("Error");
  }
}
