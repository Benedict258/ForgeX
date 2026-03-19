# ForgeX

**ForgeX** is an AI engineering copilot and agent for circuits, embedded systems, component selection, troubleshooting, and guided hardware building.

It is built around a simple product question:

Software developers already have AI-assisted tools that help them build faster.

What is the equivalent for engineers working with:

- circuits
- microcontrollers
- embedded code
- component selection
- prototyping
- troubleshooting
- engineering learning workflows

ForgeX is that product direction.

## Product Story

ForgeX is designed as an **agentic engineering workspace**.

A user should be able to describe what they want to build, fix, or understand, and ForgeX should be able to:

- interpret the engineering request
- break the problem down
- recommend the right controller or platform
- identify the needed components
- generate embedded systems code
- explain the design logic
- guide the user step by step
- or continue autonomously in agent mode

This means ForgeX is not just a chat interface.

It is intended to behave like:

- a tutor
- a senior engineering assistant
- an autonomous build agent

## What ForgeX Does

ForgeX helps users across four main categories:

### 1. Engineering Planning

ForgeX can take a plain-language request and convert it into:

- a project understanding
- assumptions
- recommended platform
- components
- system guidance
- implementation steps
- code
- troubleshooting

### 2. Guided Learning

In **Guided Mode**, ForgeX should not just produce an answer.

It should:

- explain what it is doing
- walk the user through the work
- ask clarifying questions only when they matter
- wait for confirmation before continuing to the next step
- speak the instructions out loud when voice replies are enabled

### 3. Autonomous Agent Behavior

In **Agent Mode**, ForgeX should work more aggressively and autonomously.

It should:

- make reasonable engineering assumptions
- keep progressing through the requested workflow
- generate the relevant output without unnecessary back-and-forth
- act like a practical engineering build agent

### 4. Troubleshooting

ForgeX is designed to be strong at troubleshooting, not just generation.

It should help diagnose:

- wiring issues
- wrong pin mapping
- unstable sensor behavior
- power problems
- controller mismatch
- actuator issues
- firmware logic mistakes

## Core Functionalities

The current ForgeX app supports:

- text input
- voice input through AssemblyAI transcription
- spoken assistant replies through browser speech synthesis
- Guided Mode
- Agent Mode
- multi-controller-aware reasoning
- structured engineering responses
- direct answers for component and concept questions
- guided step-by-step progression with user confirmation
- code generation
- troubleshooting output
- a local engineering knowledge base

## Current User Experience

The current web app is split into three main pages:

### Landing Page

The landing page explains:

- the general purpose of ForgeX
- the agentic engineering workflow
- the product direction
- the stack
- the broader platform strategy

### Workspace

The workspace is where users actually interact with ForgeX.

It supports:

- typed prompts
- voice prompts
- history drawer
- structured responses
- guided walkthroughs
- step confirmation
- spoken responses

### How It Works

This page explains:

- the flow
- example prompts
- product behavior
- proof points and positioning

## Response Types

ForgeX does not treat every prompt as a full build request.

It can respond differently depending on intent:

### Build Requests

For example:

> Build a traffic light system with Arduino

ForgeX should return:

- understanding
- recommended platform
- components
- implementation steps
- code
- troubleshooting

### Troubleshooting Requests

For example:

> My motor driver twitches but the motor does not spin

ForgeX should focus on:

- likely failure points
- checks
- diagnosis
- corrective next steps

### Component Questions

For example:

> Which microcontroller is better for a greenhouse monitor?

ForgeX should answer directly instead of forcing an unnecessary build plan.

### Concept Questions

For example:

> What is the difference between a MOSFET and a relay?

ForgeX should explain the concept practically and leave irrelevant sections empty.

## Guided Mode Behavior

Guided Mode is now implemented as an actual guided flow.

When the model returns steps:

1. ForgeX speaks the plan and introduces the first step.
2. ForgeX asks the user to complete the step.
3. The user responds with something like `yes`, `done`, or `next`.
4. ForgeX moves to the next step.
5. If the user says `repeat`, ForgeX repeats the current step.
6. If the user says `stop` or `cancel`, the walkthrough pauses.

This works with typed input and voice input.

## Voice Features

ForgeX currently supports:

- voice prompt recording in the browser
- transcription via AssemblyAI
- spoken replies via browser `speechSynthesis`
- guided spoken step walkthroughs

Important limitation:

- the current voice output quality depends on the voices installed in the user’s browser and operating system
- if a more human voice is required, ForgeX should later move to a dedicated neural TTS provider

## Product Direction Options

ForgeX is bigger than just the current web interface.

There are three serious product paths:

### Option 1. Integrate an AI Agent Into Existing Engineering Tools

ForgeX could be integrated with tools such as:

- MATLAB
- SimulIDE
- Tinkercad
- Proteus
- similar circuit and simulation environments

In this direction, ForgeX becomes an AI layer on top of existing engineering software.

### Option 2. Build a Dedicated ForgeX Application

ForgeX could evolve into its own software or web application focused on AI-native engineering workflows.

In this direction, the platform owns the experience directly instead of depending on third-party tools.

### Option 3. Build a Stronger Agentic Control Architecture

ForgeX could become a more autonomous agent system that can take action inside supported engineering tools.

In this direction, the agent does more than advise. It operates.

## Current MVP Direction

The current implementation is closest to:

- a dedicated AI-native engineering workspace

That means the current build focuses on:

- a clean frontend
- structured responses
- strong reasoning
- troubleshooting quality
- guided and agent modes
- voice interaction

It does **not** currently focus on:

- full simulation
- full CAD workflows
- perfect circuit visuals
- deep external tool integration

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
- local mock fallback
- retrieval-grounded prompting through local engineering knowledge files

### Voice

- AssemblyAI for speech-to-text
- browser speech synthesis for text-to-speech

## Knowledge Base

ForgeX uses local engineering notes under [`knowledge/`](./knowledge) to ground answers.

These files contain practical engineering material such as:

- controller selection guidance
- embedded systems notes
- wiring heuristics
- safety considerations
- debugging patterns

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

### 1. Install dependencies

From the project root:

```powershell
npm.cmd install
npm.cmd install --prefix frontend
```

### 2. Create environment variables

Copy:

```powershell
Copy-Item .env.example .env
```

Then configure the keys you want to use.

Common variables:

- `GROQ_API_KEY`
- `GROQ_MODEL`
- `ASSEMBLYAI_API_KEY`
- `PORT`

### 3. Run the app

```powershell
npm.cmd run dev
```

This starts:

- the backend server
- the frontend dev server

### 4. Build the frontend

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

The current PRD is also maintained in [`Forge.md`](./Forge.md).

The most important PRD ideas are:

- ForgeX is an AI engineering agent for circuits and embedded systems
- it should help users build, learn, and troubleshoot
- it should support both guided and autonomous workflows
- it should support multiple controller families
- it should be useful for students first
- it should prioritize impact, reasoning quality, and troubleshooting depth

## Why This Project Matters

ForgeX exists because engineering workflows still have too much friction.

Students and technical builders often have to:

- search for tutorials
- compare scattered docs
- guess components
- debug by trial and error
- move across too many disconnected tools

ForgeX aims to reduce that friction with a single intelligent workflow.

## Current Status

The project currently includes:

- landing page and product story
- workspace UI
- history drawer
- Guided Mode walkthrough behavior
- Agent Mode behavior
- voice input
- spoken replies
- structured response rendering
- local knowledge retrieval
- Groq integration

## Future Direction

Potential next steps include:

- richer guided-mode memory and state
- real neural TTS for more human voice output
- stronger tool integrations
- simulation support
- PCB-related workflows
- more autonomous engineering execution

## Final Positioning

**ForgeX is an AI engineering copilot and agent that helps users design, understand, build, and troubleshoot circuits and embedded systems through structured reasoning, guided interaction, code generation, voice support, and agentic automation.**
#   F o r g e X  
 