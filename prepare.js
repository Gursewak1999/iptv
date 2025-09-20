import fs from "fs";
import https from "https";

const jsonUrl =
  "https://raw.githubusercontent.com/AbhijitDeyDev/ipfreetv/refs/heads/master/app/assets/json/IndianChannels.json";
const outputFile = "playlist.m3u";

https
  .get(jsonUrl, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const channels = JSON.parse(data);
        let m3u = "#EXTM3U\n";

        channels.forEach((ch) => {
          const name = ch.name || "Unknown";
          const url = ch.url || "";
          const logo = ch["tvg-logo"] || "";
          const group = ch["group-title"] || "Other";
          const id = ch.id || "";

          if (url) {
            m3u += `#EXTINF:-1 tvg-id="${id}" tvg-name="${name}" tvg-logo="${logo}" group-title="${group}", ${name}\n${url}\n`;
          }
        });

        fs.writeFileSync(outputFile, m3u, "utf8");
        console.log(`✅ Playlist generated: ${outputFile}`);
      } catch (err) {
        console.error("❌ Error parsing JSON:", err.message);
      }
    });
  })
  .on("error", (err) => {
    console.error("❌ Fetch error:", err.message);
  });
