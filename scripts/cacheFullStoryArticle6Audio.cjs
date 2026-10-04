const fs = require('fs');
const path = require('path');
const { EdgeTTS } = require('node-edge-tts');

const AUDIO_CACHE_DIR = path.resolve(__dirname, '../data/audio_cache');
const DATA_FILE = path.resolve(__dirname, '../data/persisted_articles.json');

async function synthesizeFullStoryForVoice(fullText, voiceKey, voiceModel) {
  // Clean full text - DO NOT truncate!
  let clean = fullText
    .split(/###\s*Sources/i)[0]
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_~`]/g, "")
    .replace(/---\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // Divide into natural sentence chunks under 2,500 characters
  const chunks = [];
  let remaining = clean;
  while (remaining.length > 0) {
    if (remaining.length <= 2400) {
      chunks.push(remaining);
      break;
    }
    let cut = remaining.lastIndexOf(". ", 2400);
    if (cut === -1) cut = remaining.lastIndexOf(" ", 2400);
    if (cut === -1) cut = 2400;
    chunks.push(remaining.slice(0, cut + 1).trim());
    remaining = remaining.slice(cut + 1).trim();
  }

  console.log(`[TTS] Synthesizing ${chunks.length} chunks for ${voiceKey} (${clean.length} chars total)...`);

  const audioBuffers = [];
  for (let i = 0; i < chunks.length; i++) {
    const tempFile = path.join(AUDIO_CACHE_DIR, `temp_${voiceKey}_${i}.mp3`);
    try {
      const tts = new EdgeTTS({
        voice: voiceModel,
        lang: "en-US",
        outputFormat: "audio-24khz-96kbitrate-mono-mp3",
        timeout: 90000,
        rate: "-3%",
        pitch: "-2Hz"
      });
      await tts.ttsPromise(chunks[i], tempFile);
      if (fs.existsSync(tempFile)) {
        audioBuffers.push(fs.readFileSync(tempFile));
        fs.unlinkSync(tempFile);
      }
      console.log(`  Chunk ${i + 1}/${chunks.length} rendered`);
    } catch (err) {
      console.error(`  Chunk ${i + 1} failed for ${voiceKey}:`, err.message);
    }
  }

  if (audioBuffers.length > 0) {
    const combined = Buffer.concat(audioBuffers);
    const targetFile = path.join(AUDIO_CACHE_DIR, `article_6_${voiceKey}.mp3`);
    fs.writeFileSync(targetFile, combined);
    console.log(`[TTS] SUCCESS: Full story audio saved to ${targetFile} (${combined.length} bytes, ~${Math.round(clean.length / 15 / 60)} minutes of continuous audio)!`);
  }
}

async function run() {
  const articles = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  const art6 = articles.find(a => a.id === 6);
  if (!art6) {
    console.error("Article 6 not found");
    return;
  }

  // Prepend title and excerpt
  const fullTextToRead = `${art6.title}. By ${art6.author.name}. ${art6.excerpt} ${art6.content}`;

  // Synthesize for Christopher first (default literary baritone narrator)
  await synthesizeFullStoryForVoice(fullTextToRead, "Christopher", "en-US-ChristopherNeural");
  
  // Then Guy (warm broadcast narrator)
  await synthesizeFullStoryForVoice(fullTextToRead, "Guy", "en-US-GuyNeural");
}

run().catch(e => console.error(e));
