const { getKnowledgeContext } = require("./knowledgeBase");

function extractAnthropicText(payload) {
  if (!Array.isArray(payload?.content)) {
    return "";
  }

  return payload.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();
}

function extractJson(value) {
  const trimmed = String(value || "").trim();

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Claude response did not contain JSON.");
  }

  return JSON.parse(match[0]);
}

function normalizeSolution(payload) {
  return {
    status: "solution",
    response: {
      understanding: String(payload.understanding || ""),
      assumptions: Array.isArray(payload.assumptions) ? payload.assumptions.map(String) : [],
      knowledge: [],
      components: Array.isArray(payload.components)
        ? payload.components.map((component) => ({
            name: String(component.name || "Component"),
            quantity: Number(component.quantity || 1),
            purpose: String(component.purpose || "")
          }))
        : [],
      circuit: {
        summary: String(payload.circuit?.summary || ""),
        connections: Array.isArray(payload.circuit?.connections)
          ? payload.circuit.connections.map((connection) => ({
              from: String(connection.from || ""),
              to: String(connection.to || ""),
              note: String(connection.note || "")
            }))
          : []
      },
      steps: Array.isArray(payload.steps) ? payload.steps.map(String) : [],
      code: String(payload.code || ""),
      explanation: String(payload.explanation || "")
    }
  };
}

function buildClarificationPrompt({ prompt, knowledgeContext }) {
  return [
    "<task>",
    "You are in Guided Mode.",
    "Ask exactly one concise engineering clarification question before solving.",
    "Use the knowledge sources only as grounding, not as something to quote.",
    "Return JSON only with this schema:",
    '{"question":"string","reason":"string"}',
    "</task>",
    "<knowledge>",
    knowledgeContext,
    "</knowledge>",
    `<user_request>${prompt}</user_request>`
  ].join("\n");
}

function buildSolutionPrompt({ prompt, mode, messages, knowledgeContext }) {
  const transcript = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  return [
    "<task>",
    `Mode: ${mode}`,
    mode === "agent"
      ? "Make the minimum safe engineering assumptions and complete the full solution."
      : "Use the provided clarification answers to complete the full solution.",
    "Ground your answer in the supplied engineering knowledge when relevant.",
    "Return JSON only using the schema from the system prompt.",
    "</task>",
    "<knowledge>",
    knowledgeContext,
    "</knowledge>",
    transcript ? `<conversation>\n${transcript}\n</conversation>` : "",
    `<latest_user_request>${prompt}</latest_user_request>`
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function callAnthropic({ prompt, mode, messages, systemPrompt }) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const model = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514";

  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const knowledge = getKnowledgeContext({ prompt, messages });
  const shouldClarify =
    mode === "guided" &&
    messages.filter((message) => message.role === "user").length < 2;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      system: `${systemPrompt}\n\n<retrieval_policy>Use the supplied knowledge context as retrieval-augmented grounding.</retrieval_policy>`,
      messages: [
        {
          role: "user",
          content: shouldClarify
            ? buildClarificationPrompt({ prompt, knowledgeContext: knowledge.contextText })
            : buildSolutionPrompt({
                prompt,
                mode,
                messages,
                knowledgeContext: knowledge.contextText
              })
        }
      ]
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Anthropic request failed with ${response.status}: ${detail}`);
  }

  const payload = await response.json();
  const parsed = extractJson(extractAnthropicText(payload));

  if (shouldClarify) {
    return {
      status: "clarification",
      clarification: {
        question: String(parsed.question || "What should ForgeX optimize for in this design?"),
        reason: String(parsed.reason || "One engineering detail is needed before proceeding.")
      },
      knowledge: knowledge.entries
    };
  }

  const solution = normalizeSolution(parsed);
  solution.response.knowledge = knowledge.entries;
  return solution;
}

module.exports = {
  callAnthropic
};
