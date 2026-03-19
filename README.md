# ForgeX

**ForgeX** is an AI engineering copilot and agent for circuits, embedded systems, component selection, troubleshooting, and guided hardware building.

## The Core Question
Software developers already have AI-assisted tools that help them build faster.

**What is the equivalent for engineers working with:**
- Circuits
- Microcontrollers
- Embedded code
- Component selection
- Prototyping
- Troubleshooting
- Engineering learning workflows

ForgeX is that product direction.

## Product Story
ForgeX is designed as an **agentic engineering workspace**. Users should be able to describe what they want to build, fix, or understand, and ForgeX should be able to:
- Interpret the engineering request
- Break the problem down
- Recommend the right controller or platform
- Identify the needed components
- Generate embedded systems code
- Explain the design logic
- Guide the user step-by-step
- Continue autonomously in agent mode

ForgeX is not just a chat interface. It is intended to behave like:
- A tutor
- A senior engineering assistant
- An autonomous build agent

## What ForgeX Does
ForgeX helps users across four main categories:

### 1) Engineering Planning
ForgeX can take a plain-language request and convert it into:
- Project understanding
- Assumptions
- Recommended platform
- Components
- System guidance
- Implementation steps
- Code
- Troubleshooting

### 2) Guided Learning
In **Guided Mode**, ForgeX should not just produce an answer. It should:
- Explain what it is doing
- Walk the user through the work
- Ask clarifying questions only when they matter
- Wait for confirmation before continuing to the next step
- Speak the instructions out loud when voice replies are enabled

### 3) Autonomous Agent Behavior
In **Agent Mode**, ForgeX should work more aggressively and autonomously:
- Make reasonable engineering assumptions
- Keep progressing through the requested workflow
- Generate relevant output without unnecessary back-and-forth
- Act like a practical engineering build agent

### 4) Troubleshooting
ForgeX is designed to be strong at troubleshooting, not just generation. It helps diagnose:
- Wiring issues
- Wrong pin mapping
- Unstable sensor behavior
- Power problems
- Controller mismatch
- Actuator issues
- Firmware logic mistakes

## Core Functionalities
The current ForgeX app supports:
- Text input
- Voice input through AssemblyAI transcription
- Spoken assistant replies through browser speech synthesis
- Guided Mode
- Agent Mode
- Multi-controller-aware reasoning
- Structured engineering responses
- Direct answers for component and concept questions
- Guided step-by-step progression with user confirmation
- Code generation
- Troubleshooting output
- Local engineering knowledge base

## Current User Experience
The current web app is split into three main pages:

### Landing Page
Explains:
- The general purpose of ForgeX
- The agentic engineering workflow
- The product direction
- The stack
- The broader platform strategy

### Workspace
Where users interact with ForgeX. Supports:
- Typed prompts
- Voice prompts
- History drawer
- Structured responses
- Guided walkthroughs
- Step confirmation
- Spoken responses

### How It Works
Explains:
- The flow
- Example prompts
- Product behavior
- Proof points and positioning

## Response Types
ForgeX can respond differently depending on intent:

### Build Requests
Example prompt:
> Build a traffic light system with Arduino

Typical output:
- Understanding
- Recommended platform
- Components
- Implementation steps
- Code
- Troubleshooting

### Troubleshooting Requests
Example prompt:
> My motor driver twitches but the motor does not spin

Typical output focuses on:
- Likely failure points
- Checks
- Diagnosis
- Corrective next steps

### Component Questions
Example prompt:
> Which microcontroller is better for a greenhouse monitor?

ForgeX should answer directly instead of forcing an unnecessary build plan.

### Concept Questions
Example prompt:
> What is the difference between a MOSFET and a relay?

ForgeX should explain the concept practically and leave irrelevant sections empty.

## Guided Mode Behavior
Guided Mode is implemented as an interactive flow. When the model returns steps:
1. ForgeX speaks the plan and introduces the first step.
2. ForgeX asks the user to complete the step.
3. The user responds with `yes`, `done`, or `next`.
4. ForgeX moves to the next step.
5. If the user says `repeat`, ForgeX repeats the current step.
6. If the user says `stop` or `cancel`, the walkthrough pauses.

This works with typed input and voice input.

## Voice Features
ForgeX currently supports:
- Voice prompt recording in the browser
- Transcription via AssemblyAI
- Spoken replies via browser `speechSynthesis`
- Guided spoken step walkthroughs

**Important limitation:**
- Voice output quality depends on voices installed in the user’s browser and operating system.
- If a more human voice is required, ForgeX should later move to a dedicated neural TTS provider.

## Product Direction Options
ForgeX is bigger than just the current web interface. Three serious product paths:

### Option 1: Integrate an AI Agent Into Existing Engineering Tools
ForgeX could be integrated with tools such as:
- MATLAB
- SimulIDE
- Tinkercad
- Proteus
- Similar circuit and simulation environments

### Option 2: Build a Dedicated ForgeX Application
ForgeX could evolve into its own software or web application focused on AI-native engineering workflows.

### Option 3: Build a Stronger Agentic Control Architecture
ForgeX could become a more autonomous agent system that can take action inside supported engineering tools.

## Current MVP Direction
The current implementation is closest to a dedicated AI-native engineering workspace. Current focus:
- Clean frontend
- Structured responses
- Strong reasoning
- Troubleshooting quality
- Guided and agent modes
- Voice interaction

Not currently focusing on:
- Full simulation
- Full CAD workflows
- Perfect circuit visuals
- Deep external tool integration

## Architecture

### Frontend
- React
- Vite
- Tailwind-based UI layer

### Backend
- Node.js
- Express

### AI Layer
- Groq-backed LLM path
- Local mock fallback
- Retrieval-grounded prompting through local engineering knowledge files

### Voice
- AssemblyAI for speech-to-text
- Browser speech synthesis for text-to-speech

## Knowledge Base
ForgeX uses local engineering notes under [`knowledge/`](./knowledge) to ground answers.

To expand ForgeX’s grounded knowledge:
1. Add `.md` or `.txt` files under `knowledge/`
2. Keep each file focused on one topic
3. Prefer practical engineering rules over vague theory

## Project Structure
```text
/frontend
  /src
    /components
    /pages
    /lib
/backend
  /services
/knowledge
/prompts
Forge.md
README.md
```

## Getting Started

### 1) Install dependencies
From the project root:
```powershell
npm.cmd install
npm.cmd install --prefix frontend
```

### 2) Create environment variables
Copy the example file:
```powershell
Copy-Item .env.example .env
```

Then configure the keys you want to use. Common variables:
- `GROQ_API_KEY`
- `GROQ_MODEL`
- `ASSEMBLYAI_API_KEY`
- `PORT`

### 3) Run the app
```powershell
npm.cmd run dev
```
This starts:
- The backend server
- The frontend dev server

### 4) Build the frontend
```powershell
npm.cmd run build
```

## Available Scripts
From the root [`package.json`](./package.json):
- `npm.cmd run dev`
- `npm.cmd run dev:backend`
- `npm.cmd run dev:frontend`
- `npm.cmd run build`
- `npm.cmd run preview`

## PRD Summary
The current PRD is maintained in [`Forge.md`](./Forge.md).

## Why This Project Matters
Engineering workflows still have too much friction. Students and technical builders often have to:
- Search for tutorials
- Compare scattered docs
- Guess components
- Debug by trial and error
- Move across disconnected tools

ForgeX aims to reduce that friction with a single intelligent workflow.

## Current Status
The project currently includes:
- Landing page and product story
- Workspace UI
- History drawer
- Guided Mode walkthrough behavior
- Agent Mode behavior
- Voice input
- Spoken replies
- Structured response rendering
- Local knowledge retrieval
- Groq integration

## Future Direction
Potential next steps include:
- Richer guided-mode memory and state
- Real neural TTS for more human voice output
- Stronger tool integrations
- Simulation support
- PCB-related workflows
- More autonomous engineering execution

## Final Positioning
**ForgeX is an AI engineering copilot and agent that helps users design, understand, build, and troubleshoot circuits and embedded systems through structured reasoning, guided interaction, code generation, voice support, and agentic automation.**
