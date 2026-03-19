const fs = require("fs");
const path = require("path");
const { generateMockResponse } = require("./mockResponse");
const { callAnthropic } = require("./anthropicResponse");
const { callGroq } = require("./groqResponse");

const promptPath = path.resolve(__dirname, "../../prompts/systemPrompt.txt");
const systemPrompt = fs.readFileSync(promptPath, "utf8");

function getProvider() {
  const explicitProvider = String(process.env.AI_PROVIDER || "").trim().toLowerCase();

  if (explicitProvider) {
    return explicitProvider;
  }

  if (process.env.ANTHROPIC_API_KEY) {
    return "anthropic";
  }

  if (process.env.GROQ_API_KEY) {
    return "groq";
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  return "mock";
}

async function generateForgeXResponse({ prompt, mode, messages }) {
  const provider = getProvider();

  if (provider === "anthropic") {
    try {
      return await callAnthropic({ prompt, mode, messages, systemPrompt });
    } catch (error) {
      console.warn("Falling back to local mock response from Anthropic path:", error.message);
      return generateMockResponse({ prompt, mode, messages });
    }
  }

  if (provider === "groq") {
    try {
      return await callGroq({ prompt, mode, messages, systemPrompt });
    } catch (error) {
      console.warn("Falling back to local mock response from Groq path:", error.message);
      return generateMockResponse({ prompt, mode, messages });
    }
  }

  if (provider === "openai") {
    console.warn("OpenAI is configured but Anthropic is the recommended provider for this build. Using local mock fallback.");
  }

  return generateMockResponse({ prompt, mode, messages });
}

module.exports = {
  generateForgeXResponse
};
