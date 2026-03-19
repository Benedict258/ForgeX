const { getKnowledgeContext } = require("./knowledgeBase");

function compactText(value, fallback = "") {
  const text = String(value || fallback).replace(/\s+/g, " ").trim();
  return text || fallback;
}

function classifyPromptIntent(prompt) {
  const value = String(prompt || "").toLowerCase();

  if (
    /\b(troubleshoot|debug|diagnose|why.*not work|why.*isn't working|not working|issue|fault|problem)\b/.test(
      value
    )
  ) {
    return "troubleshooting";
  }

  if (
    /\b(component|sensor|resistor|capacitor|transistor|mosfet|relay|driver|module|which board|which controller|which microcontroller|what part|best part|best component)\b/.test(
      value
    )
  ) {
    return "component_advice";
  }

  if (
    /\b(what is|how does|difference between|compare|when should|why use|explain|tell me about)\b/.test(
      value
    )
  ) {
    return "concept_question";
  }

  return "project_build";
}

function sanitizeComponents(components) {
  if (!Array.isArray(components)) {
    return [];
  }

  return components
    .map((component) => ({
      name: compactText(component.name || "Component", "Component"),
      quantity: Math.max(1, Number(component.quantity || 1)),
      purpose: compactText(component.purpose || "", "")
    }))
    .filter((component) => !/not needed|optional only|placeholder/i.test(component.purpose))
    .filter((component) => component.name.length > 0);
}

function sanitizeConnections(connections) {
  if (!Array.isArray(connections)) {
    return [];
  }

  return connections
    .map((connection) => ({
      from: compactText(connection.from || "", ""),
      to: compactText(connection.to || "", ""),
      note: compactText(connection.note || "", "")
    }))
    .filter((connection) => connection.from && connection.to);
}

function sanitizeSteps(steps) {
  if (!Array.isArray(steps)) {
    return [];
  }

  return steps.map((step) => compactText(step, "")).filter(Boolean);
}

function sanitizeList(items, limit = 5) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items.map((item) => compactText(item, "")).filter(Boolean).slice(0, limit);
}

function sanitizeCode(code) {
  const text = String(code || "").replace(/\r/g, "").trim();

  if (!text) {
    return "";
  }

  const lines = text.split("\n");
  const indents = lines
    .filter((line) => line.trim().length > 0)
    .map((line) => line.match(/^\s*/)?.[0].length || 0);
  const minIndent = indents.length > 0 ? Math.min(...indents) : 0;

  return lines.map((line) => line.slice(minIndent)).join("\n").trim();
}

function extractJson(value) {
  const trimmed = String(value || "").trim();

  if (trimmed.startsWith("{")) {
    return JSON.parse(trimmed);
  }

  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("Groq response did not contain JSON.");
  }

  return JSON.parse(match[0]);
}

function normalizeSolution(payload) {
  return {
    status: "solution",
    response: {
      understanding: compactText(payload.understanding || "", ""),
      assumptions: sanitizeList(payload.assumptions, 5),
      recommendedPlatform: {
        name: compactText(payload.recommendedPlatform?.name || "", ""),
        reason: compactText(payload.recommendedPlatform?.reason || "", "")
      },
      knowledge: [],
      components: sanitizeComponents(payload.components),
      circuit: {
        summary: compactText(payload.circuit?.summary || "", ""),
        connections: sanitizeConnections(payload.circuit?.connections)
      },
      steps: sanitizeSteps(payload.steps),
      code: sanitizeCode(payload.code),
      troubleshooting: {
        likelyIssues: sanitizeList(payload.troubleshooting?.likelyIssues, 5),
        checks: sanitizeList(payload.troubleshooting?.checks, 6),
        nextSteps: sanitizeList(payload.troubleshooting?.nextSteps, 6)
      },
      explanation: compactText(payload.explanation || "", "")
    }
  };
}

function buildClarificationPrompt({ prompt, knowledgeContext }) {
  return [
    "You are in Guided Mode.",
    "Ask exactly one concise engineering clarification question before solving only if a meaningful engineering ambiguity exists.",
    "Use the knowledge sources as grounding for electronics, embedded systems, and build safety.",
    "Ask about the highest-impact design choice only.",
    "Return JSON only with this schema:",
    '{"question":"string","reason":"string"}',
    "<knowledge>",
    knowledgeContext,
    "</knowledge>",
    `<user_request>${prompt}</user_request>`
  ].join("\n");
}

function buildSolutionPrompt({ prompt, mode, messages, knowledgeContext, intent }) {
  const transcript = messages
    .map((message) => `${message.role.toUpperCase()}: ${message.content}`)
    .join("\n");

  const intentInstructions = {
    troubleshooting: [
      "This is primarily a troubleshooting request.",
      "Focus on diagnosis, failure points, checks, root-cause isolation, and corrective next steps.",
      "Do not force a fresh build plan unless it helps resolve the fault."
    ],
    component_advice: [
      "This is primarily a component-selection or component-understanding request.",
      "Answer the question directly and recommend relevant parts or platforms.",
      "Do not force a full project pipeline. Leave code and build steps empty unless they are truly needed."
    ],
    concept_question: [
      "This is primarily an explanatory engineering question.",
      "Answer directly, clearly, and practically.",
      "Do not force a platform recommendation, component list, code, or build plan if they are not needed."
    ],
    project_build: [
      "This is a build-oriented request.",
      "Provide the implementation plan in full."
    ]
  };

  return [
    `Mode: ${mode}`,
    mode === "agent"
      ? "Make the minimum safe engineering assumptions and complete the full solution."
      : "Use the provided clarification answers to complete the full solution.",
    "Ground your answer in the supplied engineering knowledge when relevant.",
    "Think like a practical electronics tutor, embedded engineer, and troubleshooting expert.",
    "Do not include placeholder parts, unnecessary components, or items marked as not needed.",
    "The component list must be minimal and realistic.",
    "The circuit section and code pin mapping must agree exactly.",
    "List explicit power and ground connections when the design needs them.",
    "For LEDs, show resistor and ground wiring explicitly.",
    "For buttons using INPUT_PULLUP, describe the inverted logic clearly.",
    "Build steps should start with power, ground, and wiring before upload/testing.",
    "If motors, relays, or servos appear, mention driver or power considerations when required.",
    "Recommend the most suitable microcontroller when platform choice matters. Do not force Arduino if ESP32, Pico, or another controller is a better fit.",
    "Avoid generic starter-circuit filler when the user asked for a specific project.",
    "Troubleshooting is mandatory. Include likely issues, checks, and next steps.",
    "Visual circuit quality is not the priority. Focus on detailed guidance and troubleshooting depth.",
    "If the user asked a direct engineering question rather than a project build, answer directly and leave unrelated schema sections empty.",
    ...intentInstructions[intent],
    "Return JSON only using the schema from the system prompt.",
    "<knowledge>",
    knowledgeContext,
    "</knowledge>",
    transcript ? `<conversation>\n${transcript}\n</conversation>` : "",
    `<latest_user_request>${prompt}</latest_user_request>`
  ]
    .filter(Boolean)
    .join("\n\n");
}

async function callGroq({ prompt, mode, messages, systemPrompt }) {
  const apiKey = process.env.GROQ_API_KEY;
  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

  if (!apiKey) {
    throw new Error("GROQ_API_KEY is not configured.");
  }

  const knowledge = getKnowledgeContext({ prompt, messages });
  const intent = classifyPromptIntent(prompt);
  const shouldClarify =
    mode === "guided" &&
    (intent === "project_build" || intent === "troubleshooting") &&
    messages.filter((message) => message.role === "user").length < 2;

  let parsed;
  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.25,
          max_tokens: 1800,
          response_format: {
            type: "json_object"
          },
          messages: [
            {
              role: "system",
              content: `${systemPrompt}\n\nUse the supplied knowledge context as retrieval-grounded engineering guidance.`
            },
            {
              role: "user",
              content: shouldClarify
                ? buildClarificationPrompt({ prompt, knowledgeContext: knowledge.contextText })
                : buildSolutionPrompt({
                    prompt,
                    mode,
                    messages,
                    knowledgeContext: knowledge.contextText,
                    intent
                  })
            }
          ]
        })
      });

      if (!response.ok) {
        const detail = await response.text();
        throw new Error(`Groq request failed with ${response.status}: ${detail}`);
      }

      const payload = await response.json();
      const content = payload?.choices?.[0]?.message?.content ?? "";
      parsed = extractJson(content);
      lastError = null;
      break;
    } catch (error) {
      lastError = error;

      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 350));
      }
    }
  }

  if (lastError) {
    throw lastError;
  }

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
  callGroq
};
