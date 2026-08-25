export default async function handler(req, res) {
  const url = req.query.url;
  if (!url || !url.startsWith("https://daichi.")) {
    return res.status(403).send("Forbidden");
  }
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" }
    });
    if (!response.ok) return res.status(response.status).send("Fetch error");
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", response.headers.get("content-type") || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=604800");
    return res.status(200).send(buffer);
  } catch (e) {
    return res.status(500).send("Error");
  }
}
