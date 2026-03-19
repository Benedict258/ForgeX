const ASSEMBLYAI_BASE_URL = process.env.ASSEMBLYAI_BASE_URL || "https://api.assemblyai.com";

function getHeaders(extraHeaders = {}) {
  const apiKey = process.env.ASSEMBLYAI_API_KEY;

  if (!apiKey) {
    throw new Error("ASSEMBLYAI_API_KEY is not configured.");
  }

  return {
    Authorization: apiKey,
    ...extraHeaders
  };
}

async function uploadAudio(buffer) {
  const response = await fetch(`${ASSEMBLYAI_BASE_URL}/v2/upload`, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/octet-stream"
    }),
    body: buffer
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AssemblyAI upload failed with ${response.status}: ${detail}`);
  }

  const payload = await response.json();
  return payload.upload_url;
}

async function createTranscript(uploadUrl) {
  const response = await fetch(`${ASSEMBLYAI_BASE_URL}/v2/transcript`, {
    method: "POST",
    headers: getHeaders({
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      audio_url: uploadUrl
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`AssemblyAI transcript creation failed with ${response.status}: ${detail}`);
  }

  const payload = await response.json();
  return payload.id;
}

async function pollTranscript(transcriptId, timeoutMs = 90000, intervalMs = 1500) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    const response = await fetch(`${ASSEMBLYAI_BASE_URL}/v2/transcript/${transcriptId}`, {
      method: "GET",
      headers: getHeaders()
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`AssemblyAI transcript polling failed with ${response.status}: ${detail}`);
    }

    const payload = await response.json();

    if (payload.status === "completed") {
      return payload.text || "";
    }

    if (payload.status === "error") {
      throw new Error(payload.error || "AssemblyAI transcription failed.");
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new Error("AssemblyAI transcription timed out.");
}

async function transcribeAudioBuffer(buffer) {
  if (!buffer || buffer.length === 0) {
    throw new Error("Audio buffer is empty.");
  }

  const uploadUrl = await uploadAudio(buffer);
  const transcriptId = await createTranscript(uploadUrl);
  return pollTranscript(transcriptId);
}

module.exports = {
  transcribeAudioBuffer
};
