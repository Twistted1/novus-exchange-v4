const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');

const AUDIO_CACHE_DIR = path.resolve(__dirname, '../data/audio_cache');
const DATA_FILE = path.resolve(__dirname, '../data/persisted_articles.json');

async function run() {
  const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const art8 = articles.find(a => a.id === 8);
  if (!art8) {
    console.error("Article 8 not found");
    return;
  }

  let cleanText = art8.content
    .split(/###\s*Sources/i)[0]
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/---\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Intro header
  cleanText = `${art8.title}. By ${art8.author.name}. ${art8.excerpt} ${cleanText}`;
  if (cleanText.length > 1750) {
    const cut = cleanText.lastIndexOf('.', 1750);
    cleanText = cut > 500 ? cleanText.slice(0, cut + 1) : cleanText.slice(0, 1750);
  }

  const VOICES = [
    { key: "Christopher", model: "en-US-ChristopherNeural" },
    { key: "Guy", model: "en-US-GuyNeural" },
    { key: "Andrew", model: "en-US-AndrewMultilingualNeural" },
    { key: "Brian", model: "en-US-BrianNeural" }
  ];

  for (const v of VOICES) {
    const targetFile = path.join(AUDIO_CACHE_DIR, `article_8_${v.key}.mp3`);
    if (fs.existsSync(targetFile) && fs.statSync(targetFile).size > 5000) {
      console.log(`Audio for ${v.key} already exists (${fs.statSync(targetFile).size} bytes)`);
      continue;
    }

    console.log(`Synthesizing Article 8 with voice ${v.key} (${cleanText.length} chars)...`);
    try {
      const tts = new EdgeTTS({
        voice: v.model,
        lang: "en-US",
        outputFormat: "audio-24khz-96kbitrate-mono-mp3",
        timeout: 90000,
        rate: "-3%",
        pitch: "-2Hz"
      });
      await tts.ttsPromise(cleanText, targetFile);
      console.log(`Successfully generated ${targetFile} (${fs.statSync(targetFile).size} bytes)`);
    } catch (err) {
      console.error(`Failed ${v.key}:`, err.message);
    }
  }
}

run();
