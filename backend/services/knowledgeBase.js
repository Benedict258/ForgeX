const fs = require("fs");
const path = require("path");

const knowledgeDir = path.resolve(__dirname, "../../knowledge");

function tokenize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

function loadKnowledgeFiles() {
  if (!fs.existsSync(knowledgeDir)) {
    return [];
  }

  return fs
    .readdirSync(knowledgeDir)
    .filter((fileName) => fileName.endsWith(".md") || fileName.endsWith(".txt"))
    .map((fileName) => {
      const absolutePath = path.join(knowledgeDir, fileName);
      const content = fs.readFileSync(absolutePath, "utf8");

      return {
        id: fileName,
        title: fileName.replace(/\.(md|txt)$/i, ""),
        content,
        tokens: [...tokenize(fileName), ...tokenize(content)]
      };
    });
}

const knowledgeFiles = loadKnowledgeFiles();

function scoreDocument(document, queryTokens) {
  const tokenSet = new Set(document.tokens);
  let score = 0;

  for (const token of queryTokens) {
    if (tokenSet.has(token)) {
      score += 1;
    }
  }

  return score;
}

function getKnowledgeContext({ prompt, messages, limit = 5 }) {
  const query = [
    prompt,
    ...(Array.isArray(messages) ? messages.map((message) => message.content) : [])
  ].join(" ");
  const queryTokens = tokenize(query);

  const matches = knowledgeFiles
    .map((document) => ({
      ...document,
      score: scoreDocument(document, queryTokens)
    }))
    .filter((document) => document.score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit);

  const selectedDocuments = matches.length > 0 ? matches : knowledgeFiles.slice(0, limit);

  return {
    entries: selectedDocuments.map((document) => ({
      id: document.id,
      title: document.title
    })),
    contextText: selectedDocuments
      .map(
        (document) =>
          `<source title="${document.title}">\n${document.content.trim()}\n</source>`
      )
      .join("\n\n")
  };
}

module.exports = {
  getKnowledgeContext
};
