const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { generateForgeXResponse } = require("./services/forgeResponse");
const { transcribeAudioBuffer } = require("./services/assemblyTranscription");

dotenv.config({ path: ".env" });

const app = express();
const port = Number(process.env.PORT || 8787);

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, app: "ForgeX", port });
});

app.post(
  "/api/transcribe",
  express.raw({ type: () => true, limit: "20mb" }),
  async (req, res) => {
    try {
      const audioBuffer = Buffer.isBuffer(req.body) ? req.body : Buffer.from([]);

      if (audioBuffer.length === 0) {
        return res.status(400).json({ error: "Audio payload is required." });
      }

      const text = await transcribeAudioBuffer(audioBuffer);
      res.json({ text });
    } catch (error) {
      console.error("ForgeX transcription error:", error);
      res.status(500).json({
        error: "ForgeX could not transcribe the audio.",
        detail: error.message
      });
    }
  }
);

app.post("/api/solve", async (req, res) => {
  try {
    const { prompt, mode, messages } = req.body ?? {};

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Prompt is required." });
    }

    const result = await generateForgeXResponse({
      prompt,
      mode: mode === "guided" ? "guided" : "agent",
      messages: Array.isArray(messages) ? messages : []
    });

    res.json(result);
  } catch (error) {
    console.error("ForgeX API error:", error);
    res.status(500).json({
      error: "ForgeX could not generate a response.",
      detail: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`ForgeX backend running on http://localhost:${port}`);
});
