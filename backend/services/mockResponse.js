function toTitleCase(value) {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function inferProjectType(input) {
  const value = input.toLowerCase();

  if (value.includes("traffic")) {
    return "traffic-light";
  }

  if (value.includes("blink") || value.includes("blinker")) {
    return "blink";
  }

  if (value.includes("servo")) {
    return "servo";
  }

  return "generic";
}

function inferPromptIntent(input) {
  const value = input.toLowerCase();

  if (/(troubleshoot|debug|diagnose|not working|issue|fault|problem)/.test(value)) {
    return "troubleshooting";
  }

  if (
    /(component|sensor|resistor|capacitor|transistor|mosfet|relay|driver|module|which board|which controller|which microcontroller|what part|best component)/.test(
      value
    )
  ) {
    return "component_advice";
  }

  if (/(what is|how does|difference between|compare|when should|why use|explain|tell me about)/.test(value)) {
    return "concept_question";
  }

  return "project_build";
}

function buildClarification(prompt) {
  const type = inferProjectType(prompt);

  if (type === "traffic-light") {
    return {
      status: "clarification",
      clarification: {
        question: "Should the traffic light run on a fixed timing cycle, or do you want a push-button pedestrian override?",
        reason: "That choice changes the control logic and the required input wiring."
      }
    };
  }

  if (type === "blink") {
    return {
      status: "clarification",
      clarification: {
        question: "Do you want a fixed blink rate or an adjustable speed control with a potentiometer?",
        reason: "That determines whether the project needs only an output circuit or both analog input and output logic."
      }
    };
  }

  return {
    status: "clarification",
    clarification: {
      question: "Is there a specific controller or interface requirement that materially changes the design?",
      reason: "A meaningful platform or interface constraint can affect the architecture, code, and component selection."
    }
  };
}

function buildTrafficLightSolution(mode) {
  return {
    status: "solution",
    response: {
      understanding:
        "You want a student-friendly traffic light controller with clear digital outputs, simple timing logic, and straightforward debugging.",
      assumptions:
        mode === "agent"
          ? [
              "Using Arduino Uno because the project is beginner-friendly and does not require networking.",
              "Using a fixed timing cycle for a reliable first prototype."
            ]
          : ["Using the clarification answer to keep the first implementation simple and safe."],
      recommendedPlatform: {
        name: "Arduino Uno",
        reason: "It is the simplest suitable controller for a beginner traffic-light prototype with basic digital outputs."
      },
      components: [
        { name: "Arduino Uno", quantity: 1, purpose: "Main controller for timing and output logic." },
        { name: "Red LED", quantity: 1, purpose: "Stop indication." },
        { name: "Yellow LED", quantity: 1, purpose: "Transition indication." },
        { name: "Green LED", quantity: 1, purpose: "Go indication." },
        { name: "220 ohm resistor", quantity: 3, purpose: "Current limiting for each LED." },
        { name: "Breadboard", quantity: 1, purpose: "Quick prototyping surface." },
        { name: "Jumper wires", quantity: 7, purpose: "Electrical interconnects." }
      ],
      circuit: {
        summary: "Each LED is connected to a dedicated digital pin with a current-limiting resistor and a shared ground return.",
        connections: [
          { from: "Arduino D8", to: "Red LED anode via 220 ohm resistor", note: "Stop light output." },
          { from: "Arduino D9", to: "Yellow LED anode via 220 ohm resistor", note: "Transition light output." },
          { from: "Arduino D10", to: "Green LED anode via 220 ohm resistor", note: "Go light output." },
          { from: "All LED cathodes", to: "Arduino GND", note: "Shared ground return." }
        ]
      },
      steps: [
        "Connect Arduino GND to the breadboard ground rail.",
        "Place the three LEDs on the breadboard and connect one 220 ohm resistor to the anode of each LED.",
        "Wire the red LED resistor to D8, the yellow LED resistor to D9, and the green LED resistor to D10.",
        "Connect all LED cathodes to the ground rail.",
        "Upload the code and verify the sequence before adjusting timings."
      ],
      code: `const int redPin = 8;
const int yellowPin = 9;
const int greenPin = 10;

void setup() {
  pinMode(redPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
}

void loop() {
  digitalWrite(redPin, HIGH);
  digitalWrite(yellowPin, LOW);
  digitalWrite(greenPin, LOW);
  delay(5000);

  digitalWrite(redPin, LOW);
  digitalWrite(yellowPin, LOW);
  digitalWrite(greenPin, HIGH);
  delay(5000);

  digitalWrite(redPin, LOW);
  digitalWrite(yellowPin, HIGH);
  digitalWrite(greenPin, LOW);
  delay(2000);
}`,
      troubleshooting: {
        likelyIssues: [
          "LED polarity may be reversed.",
          "A resistor may be missing from one LED path.",
          "Pins in the wiring may not match the code."
        ],
        checks: [
          "Confirm each LED anode is connected to the resistor side of the assigned output pin.",
          "Confirm all LED cathodes share GND.",
          "Test one LED at a time by temporarily driving one pin HIGH."
        ],
        nextSteps: [
          "If a light never turns on, swap the LED orientation and retest.",
          "If all lights stay off, check GND continuity and upload success.",
          "If the wrong light turns on, compare the wiring against the pin constants in code."
        ]
      },
      explanation:
        "This design keeps the hardware minimal, the logic readable, and the debugging process simple for a student build."
    }
  };
}

function buildBlinkSolution(mode) {
  return {
    status: "solution",
    response: {
      understanding:
        "You want a simple output-control project that teaches digital pin control, delays, and basic debugging.",
      assumptions:
        mode === "agent"
          ? [
              "Using Arduino Uno for a beginner-friendly prototype.",
              "Using a fixed blink interval unless the user requests analog speed control."
            ]
          : ["Using the clarification answer to choose the simplest correct build path."],
      recommendedPlatform: {
        name: "Arduino Uno",
        reason: "A basic LED blink project does not require a more advanced controller, and Uno is ideal for teaching."
      },
      components: [
        { name: "Arduino Uno", quantity: 1, purpose: "Runs the output logic." },
        { name: "LED", quantity: 1, purpose: "Visual output." },
        { name: "220 ohm resistor", quantity: 1, purpose: "Protects the LED." },
        { name: "Breadboard", quantity: 1, purpose: "Prototype surface." },
        { name: "Jumper wires", quantity: 3, purpose: "Basic connections." }
      ],
      circuit: {
        summary: "A single LED output is driven from one Arduino digital pin through a resistor to ground.",
        connections: [
          { from: "Arduino D13", to: "LED anode via 220 ohm resistor", note: "Blink output." },
          { from: "LED cathode", to: "Arduino GND", note: "Current return path." }
        ]
      },
      steps: [
        "Connect Arduino GND to the breadboard ground rail.",
        "Insert the LED on the breadboard and connect its anode to D13 through a 220 ohm resistor.",
        "Connect the LED cathode to GND.",
        "Upload the code and verify the LED turns on and off at the expected interval."
      ],
      code: `const int ledPin = 13;

void setup() {
  pinMode(ledPin, OUTPUT);
}

void loop() {
  digitalWrite(ledPin, HIGH);
  delay(1000);
  digitalWrite(ledPin, LOW);
  delay(1000);
}`,
      troubleshooting: {
        likelyIssues: [
          "The LED may be inserted backwards.",
          "The resistor or jumper may be on the wrong breadboard row.",
          "The code may be uploaded to the wrong board or port."
        ],
        checks: [
          "Verify LED polarity.",
          "Verify D13 really connects through the resistor to the LED anode.",
          "Verify the board upload completes successfully."
        ],
        nextSteps: [
          "Test with the built-in LED on D13 if the external LED does not blink.",
          "Move the LED and resistor to a fresh breadboard area if row alignment is uncertain.",
          "Open Serial or re-upload after confirming the correct board and port."
        ]
      },
      explanation:
        "This project is a clean starting point for students because it combines minimal wiring with immediate visible feedback."
    }
  };
}

function buildGenericSolution(prompt, mode) {
  const projectName = toTitleCase(prompt);
  const lower = prompt.toLowerCase();
  const recommendedPlatform = lower.includes("wifi") || lower.includes("bluetooth")
    ? {
        name: "ESP32",
        reason: "This type of project may benefit from built-in wireless capability and a stronger peripheral set."
      }
    : {
        name: "Arduino Uno",
        reason: "For an underspecified student project, Uno is the simplest safe default for prototyping and debugging."
      };

  return {
    status: "solution",
    response: {
      understanding: `You want ForgeX to help plan, implement, and troubleshoot "${projectName}" as a practical student engineering build.`,
      assumptions:
        mode === "agent"
          ? [
              "Optimizing for a breadboard prototype before any permanent implementation.",
              "Choosing the simplest suitable controller unless project requirements suggest otherwise.",
              "Prioritizing clarity and debugging speed over advanced architecture."
            ]
          : ["Using the guided follow-up information to refine the architecture only where it matters."],
      recommendedPlatform,
      components: [
        { name: recommendedPlatform.name, quantity: 1, purpose: "Primary controller platform." },
        { name: "Breadboard", quantity: 1, purpose: "Rapid prototyping surface." },
        { name: "Jumper wires", quantity: 8, purpose: "General-purpose interconnects." },
        { name: "Status LED", quantity: 1, purpose: "Quick visual debug output." },
        { name: "220 ohm resistor", quantity: 1, purpose: "Current limiting for the status LED." }
      ],
      circuit: {
        summary: "Start with a debug-friendly baseline: stable power, shared ground, and one simple status output before adding project-specific peripherals.",
        connections: [
          { from: "Controller 5V or VCC", to: "Breadboard power rail", note: "Prototype supply." },
          { from: "Controller GND", to: "Breadboard ground rail", note: "Shared reference." },
          { from: "Status output pin", to: "Status LED anode via 220 ohm resistor", note: "Visual health check." },
          { from: "Status LED cathode", to: "Ground rail", note: "Current return path." }
        ]
      },
      steps: [
        "Establish the power and ground rails first.",
        "Add a simple status LED so you can verify the controller, upload path, and output timing.",
        "Add the project-specific sensor or actuator one subsystem at a time.",
        "Test each subsystem independently before combining the final logic.",
        "Use serial or another debug method early so troubleshooting is easier."
      ],
      code: `const int statusLedPin = 13;

void setup() {
  pinMode(statusLedPin, OUTPUT);
  Serial.begin(9600);
}

void loop() {
  digitalWrite(statusLedPin, HIGH);
  Serial.println("ForgeX prototype running");
  delay(500);
  digitalWrite(statusLedPin, LOW);
  delay(500);
}`,
      troubleshooting: {
        likelyIssues: [
          "Power and ground may not be distributed correctly.",
          "The controller selection may not match the actual project requirements.",
          "Too many subsystems may have been added before validating the basics."
        ],
        checks: [
          "Confirm shared ground across all connected parts.",
          "Validate one output or one sensor before combining subsystems.",
          "Check that the selected controller has the needed interfaces and voltage compatibility."
        ],
        nextSteps: [
          "If the system is unstable, return to the simplest working baseline.",
          "Add project-specific modules one at a time and retest after each addition.",
          "If requirements expand, switch to a more suitable controller such as ESP32 or Pico where needed."
        ]
      },
      explanation:
        "This fallback build pattern prioritizes progress, clarity, and troubleshooting strength so students can move from idea to working prototype without getting stuck early."
    }
  };
}

function buildComponentAdviceSolution(prompt) {
  const lower = prompt.toLowerCase();
  const aboutController = /(which board|which controller|which microcontroller)/.test(lower);

  return {
    status: "solution",
    response: {
      understanding: `You want direct engineering advice about "${toTitleCase(prompt)}" without forcing a full build plan.`,
      assumptions: [],
      recommendedPlatform: aboutController
        ? {
            name: "Depends on the workload",
            reason: "Controller choice should follow interface needs, timing needs, voltage levels, power budget, and communication requirements."
          }
        : {
            name: "",
            reason: ""
          },
      components: [
        {
          name: aboutController ? "Arduino Uno, ESP32, Raspberry Pi Pico, STM32 board" : "Relevant candidate components",
          quantity: 1,
          purpose: "Compare options against the actual electrical, firmware, and interface requirements."
        }
      ],
      circuit: {
        summary: "This is a component-focused request, so ForgeX is answering directly instead of forcing a project build.",
        connections: []
      },
      steps: [],
      code: "",
      troubleshooting: {
        likelyIssues: [
          "Choosing parts based only on popularity instead of electrical requirements.",
          "Ignoring voltage compatibility, current limits, or interface count.",
          "Picking a part before confirming the full system constraints."
        ],
        checks: [
          "Confirm supply voltage, logic level, and current requirements.",
          "Check communication protocol, GPIO count, ADC/PWM needs, and timing constraints.",
          "Verify whether the part needs a driver, regulator, pull-up, or level shifting."
        ],
        nextSteps: [
          "List the actual system constraints first, then compare candidate parts against them.",
          "Choose the simplest part that still satisfies the interfaces and performance needs.",
          "Prototype with one subsystem before locking the final bill of materials."
        ]
      },
      explanation:
        "ForgeX is treating this as direct engineering advice, so only the relevant sections are populated."
    }
  };
}

function buildConceptQuestionSolution(prompt) {
  return {
    status: "solution",
    response: {
      understanding: `You want a direct explanation for "${toTitleCase(prompt)}" rather than a full build workflow.`,
      assumptions: [],
      recommendedPlatform: {
        name: "",
        reason: ""
      },
      components: [],
      circuit: {
        summary: "This is an explanatory engineering answer, not a project build.",
        connections: []
      },
      steps: [],
      code: "",
      troubleshooting: {
        likelyIssues: [
          "Concepts are often applied incorrectly when voltage, current, timing, or logic assumptions are left implicit."
        ],
        checks: [
          "Tie the concept back to a real circuit, signal level, or firmware behavior before applying it."
        ],
        nextSteps: [
          "Ask ForgeX for a concrete example if you want the concept translated into a real circuit or code pattern."
        ]
      },
      explanation:
        "ForgeX is answering this directly because the request is conceptual, not build-oriented."
    }
  };
}

function generateMockSolution(prompt, mode) {
  const intent = inferPromptIntent(prompt);
  const type = inferProjectType(prompt);

  if (intent === "component_advice") {
    return buildComponentAdviceSolution(prompt);
  }

  if (intent === "concept_question") {
    return buildConceptQuestionSolution(prompt);
  }

  if (type === "traffic-light") {
    return buildTrafficLightSolution(mode);
  }

  if (type === "blink") {
    return buildBlinkSolution(mode);
  }

  return buildGenericSolution(prompt, mode);
}

function generateMockResponse({ prompt, mode, messages }) {
  const intent = inferPromptIntent(prompt);
  const shouldClarify =
    mode === "guided" &&
    (intent === "project_build" || intent === "troubleshooting") &&
    (!Array.isArray(messages) || messages.filter((message) => message.role === "user").length < 2);

  if (shouldClarify) {
    return buildClarification(prompt);
  }

  return generateMockSolution(prompt, mode);
}

module.exports = {
  generateMockResponse
};
