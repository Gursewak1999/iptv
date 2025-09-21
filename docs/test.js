import fs from "fs";
import fetch from "node-fetch";

const BASE_URL = "http://cf.cdn-959.me";
const USERNAME = "441d5a9cb9cd";
const PASSWORD = "f08039df0e";
const API_URL = "https://iptvnator-playlist-parser-api.vercel.app/xtream";

// Fetch live categories
async function getCategories() {
  const url = `${API_URL}?url=${BASE_URL}&username=${USERNAME}&password=${PASSWORD}&action=get_live_categories`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.payload || [];
}

// Fetch live streams for a category
async function getStreams(categoryId) {
  const url = `${API_URL}?url=${BASE_URL}&username=${USERNAME}&password=${PASSWORD}&action=get_live_streams&category_id=${categoryId}`;
  const res = await fetch(url);
  const data = await res.json();
  return data?.payload || [];
}

// Build M3U playlist
async function buildM3U() {
  let m3u = "#EXTM3U\n";

  const categories = await getCategories();

  for (const category of categories) {
    console.log(`Fetching streams for category: ${category.category_name}`);
    const streams = await getStreams(category.category_id);

    for (const stream of streams) {
      const streamUrl = `${BASE_URL}/live/${USERNAME}/${PASSWORD}/${stream.stream_id}.m3u8`;

      m3u += `#EXTINF:-1 tvg-id="${stream.stream_id}" tvg-name="${stream.name}" tvg-logo="${stream.stream_icon}" group-title="${category.category_name}",${stream.name}\n`;
      m3u += `${streamUrl}\n`;
    }
  }

  fs.writeFileSync("playlist.m3u", m3u);
  console.log("M3U playlist created: playlist.m3u");
}

buildM3U().catch(console.error);
