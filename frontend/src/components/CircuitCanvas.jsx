function normalizeEndpointLabel(value) {
  return String(value || "")
    .replace(/\bvia\b.*$/i, "")
    .replace(/\bthrough\b.*$/i, "")
    .trim();
}

function classifyNode(label) {
  const value = String(label || "").toLowerCase();

  if (value.includes("gnd") || value.includes("ground")) {
    return "ground";
  }

  if (value.includes("5v") || value.includes("vcc") || value.includes("power")) {
    return "power";
  }

  if (value.includes("arduino")) {
    return "controller";
  }

  if (value.includes("sensor") || value.includes("echo") || value.includes("trig")) {
    return "sensor";
  }

  if (value.includes("servo") || value.includes("motor") || value.includes("relay")) {
    return "actuator";
  }

  if (value.includes("led") || value.includes("buzzer") || value.includes("display")) {
    return "output";
  }

  return "signal";
}

function nodeAccent(type) {
  if (type === "ground") {
    return "#8cb9ff";
  }

  if (type === "power") {
    return "#ffe27a";
  }

  if (type === "sensor") {
    return "#6ef2be";
  }

  if (type === "actuator") {
    return "#ff9e67";
  }

  if (type === "output") {
    return "#ff6e9b";
  }

  if (type === "controller") {
    return "#9fd068";
  }

  return "#c3d0de";
}

function getNodeLayout(index) {
  const presets = [
    { x: 304, y: 24 },
    { x: 304, y: 102 },
    { x: 304, y: 180 },
    { x: 304, y: 258 },
    { x: 472, y: 62 },
    { x: 472, y: 176 }
  ];

  return presets[index] || { x: 304, y: 24 + index * 78 };
}

function buildCircuitScene(response) {
  const connections = response?.circuit?.connections ?? [];
  const endpointMap = new Map();

  connections.forEach((connection) => {
    [connection.from, connection.to].forEach((endpoint) => {
      const label = normalizeEndpointLabel(endpoint);

      if (
        !label ||
        /^arduino d\d+$/i.test(label) ||
        /^arduino a\d+$/i.test(label) ||
        /^arduino gnd$/i.test(label) ||
        /^arduino 5v$/i.test(label)
      ) {
        return;
      }

      if (!endpointMap.has(label)) {
        endpointMap.set(label, {
          id: label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          label,
          type: classifyNode(label)
        });
      }
    });
  });

  const endpointNodes = Array.from(endpointMap.values()).slice(0, 6);
  const nodes = [
    {
      id: "arduino-controller",
      label: "Arduino Uno",
      type: "controller",
      x: 42,
      y: 112,
      width: 188,
      height: 116
    },
    ...endpointNodes.map((node, index) => {
      const position = getNodeLayout(index);

      return {
        ...node,
        x: position.x,
        y: position.y,
        width: 132,
        height: 58
      };
    })
  ];

  const nodeByLabel = new Map(nodes.map((node) => [node.label, node]));
  const controllerNode = nodes[0];

  const renderedConnections = connections.slice(0, 8).map((connection, index) => {
    const fromLabel = normalizeEndpointLabel(connection.from);
    const toLabel = normalizeEndpointLabel(connection.to);
    const fromNode =
      nodeByLabel.get(fromLabel) || (classifyNode(fromLabel) === "controller" ? controllerNode : controllerNode);
    const toNode =
      nodeByLabel.get(toLabel) || (classifyNode(toLabel) === "controller" ? controllerNode : controllerNode);

    return {
      ...connection,
      id: `${fromLabel}-${toLabel}-${index}`,
      fromNode,
      toNode,
      pinLabel: connection.from
    };
  });

  return { nodes, renderedConnections };
}

export default function CircuitCanvas({ response, theme }) {
  const connections = response?.circuit?.connections ?? [];
  const { nodes, renderedConnections } = buildCircuitScene(response);
  const background = theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(7, 11, 20, 0.86)";

  return (
    <div className="circuit-panel">
      <svg viewBox="0 0 620 344" className="circuit-svg" role="img" aria-label="Circuit mock diagram">
        <defs>
          <linearGradient id="panelGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(162, 255, 117, 0.92)" />
            <stop offset="100%" stopColor="rgba(88, 141, 255, 0.9)" />
          </linearGradient>
        </defs>
        {nodes.map((node) => (
          <g key={node.id}>
            <rect
              x={node.x}
              y={node.y}
              rx="18"
              ry="18"
              width={node.width}
              height={node.height}
              fill={background}
              stroke={nodeAccent(node.type)}
            />
            <text x={node.x + 14} y={node.y + 18} fill={nodeAccent(node.type)} fontSize="11" fontWeight="700">
              {node.type.toUpperCase()}
            </text>
            <text x={node.x + 14} y={node.y + 40} fill="currentColor" fontSize="15" fontWeight="700">
              {node.label}
            </text>
          </g>
        ))}
        {renderedConnections.map((connection, index) => {
          const fromX = connection.fromNode.x + connection.fromNode.width;
          const fromY = connection.fromNode.y + 24 + (index % 3) * 22;
          const toX = connection.toNode.x;
          const toY = connection.toNode.y + 28;

          return (
            <g key={connection.id}>
              <path
                d={`M ${fromX} ${fromY} C ${fromX + 48} ${fromY}, ${toX - 48} ${toY}, ${toX} ${toY}`}
                stroke="url(#panelGlow)"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              <text
                x={(fromX + toX) / 2 - 28}
                y={(fromY + toY) / 2 - 6}
                fill="currentColor"
                fontSize="10"
              >
                {connection.pinLabel}
              </text>
            </g>
          );
        })}
      </svg>
      {response?.circuit?.summary ? (
        <p className="panel-copy">{response.circuit.summary}</p>
      ) : (
        <p className="panel-copy muted">The circuit map appears here after ForgeX responds.</p>
      )}
      <div className="connection-list">
        {connections.length > 0 ? (
          connections.map((connection, index) => (
            <div className="connection-row" key={`${connection.from}-${connection.to}-${index}`}>
              <span>{connection.from}</span>
              <span>{connection.to}</span>
            </div>
          ))
        ) : (
          <div className="empty-mini">No connections yet.</div>
        )}
      </div>
    </div>
  );
}
