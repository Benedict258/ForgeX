import { Cpu, Mic, Route, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { Tiles } from "@/components/ui/tiles";

const capabilities = [
  {
    icon: Route,
    title: "Agentic engineering workflow",
    text: "ForgeX takes an engineering request, breaks it down, selects the next actions, and keeps progressing through the workflow with structured automation."
  },
  {
    icon: Wrench,
    title: "Build and troubleshoot",
    text: "It does not stop at generation. ForgeX explains the plan, watches the workflow, and gives practical troubleshooting when the system does not behave as expected."
  },
  {
    icon: Cpu,
    title: "Circuits, code, and controllers",
    text: "ForgeX helps with circuit thinking, component selection, embedded code, and controller choice across Arduino, ESP32, Raspberry Pi Pico, and STM32-class boards."
  },
  {
    icon: Mic,
    title: "Learn or automate",
    text: "Users can work in guided mode for learning and close assistance, or switch to agent mode and let ForgeX keep progressing toward the requested result."
  }
];

const stackItems = ["Groq + Meta", "AssemblyAI", "Local Knowledge Base", "Embedded Code Generation", "Troubleshooting Engine"];
const strategyOptions = [
  "Integrate the agent into tools like MATLAB, SimulIDE, Tinkercad, or Proteus",
  "Build ForgeX as its own AI-native engineering application",
  "Use a stronger agentic control architecture that can operate existing engineering tools"
];
const flowSteps = [
  {
    label: "1. Describe the goal",
    text: "State what you want to build, fix, or learn, such as a light blinker, a controller comparison, or a debugging problem."
  },
  {
    label: "2. ForgeX reasons through it",
    text: "ForgeX breaks the problem down, selects components or controllers where needed, and decides whether clarification is actually required."
  },
  {
    label: "3. Execute and troubleshoot",
    text: "You get the steps, guidance, embedded code, explanations, and troubleshooting path in one workflow, or ForgeX continues more autonomously in agent mode."
  }
];

export default function HomePage({ onLaunchDemo, onTryGuided, onNavigateWorkspace }) {
  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden border border-slate-800 bg-slate-950 px-6 py-10 shadow-2xl shadow-black/30 md:px-10 md:py-14">
        <Tiles rows={8} cols={10} className="absolute inset-0 opacity-20" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex border border-lime-300/40 bg-lime-300/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-lime-200">
              ForgeX - AI engineering copilot
            </div>

            <div className="space-y-5">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-tight text-white md:text-6xl xl:text-7xl">
                Agentic building and automation for circuits, embedded systems, and engineering workflows.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-300">
                ForgeX is designed to automate engineering work across three possible paths: integrating an AI agent into
                tools like MATLAB, SimulIDE, Tinkercad, and Proteus, building a dedicated ForgeX engineering application,
                or using a stronger agentic control architecture that can operate those tools directly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button size="lg" onClick={onNavigateWorkspace}>
                Open Workspace
              </Button>
              <Button size="lg" variant="outline" onClick={onLaunchDemo}>
                Run Agent Demo
              </Button>
              <Button size="lg" variant="ghost" onClick={onTryGuided}>
                Try Guided Mode
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                "Breaks engineering problems into practical steps",
                "Chooses components and controllers",
                "Generates embedded systems code",
                "Guides closely or works autonomously"
              ].map((item) => (
                <div key={item} className="border border-slate-800 bg-slate-900 px-4 py-4 text-sm text-slate-100">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="border border-slate-800 bg-slate-900 p-5 shadow-xl shadow-black/25">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Flow</p>
                  <h2 className="mt-2 text-2xl font-medium text-white">How ForgeX works</h2>
                </div>
                <div className="border border-sky-900 bg-sky-950 px-3 py-1 text-xs uppercase tracking-[0.18em] text-sky-200">
                  Full platform
                </div>
              </div>

              <div className="grid gap-3">
                {flowSteps.map((item) => (
                  <div key={item.label} className="border border-slate-800 bg-slate-950 p-4">
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border border-slate-800 bg-slate-950 p-6">
        <InfiniteSlider className="relative z-10" gap={56} duration={28} durationOnHover={42}>
          {stackItems.map((item) => (
            <div key={item} className="border border-slate-800 bg-slate-900 px-5 py-3 text-sm uppercase tracking-[0.2em] text-slate-200">
              {item}
            </div>
          ))}
        </InfiniteSlider>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {capabilities.map(({ icon: Icon, title, text }) => (
          <article key={title} className="border border-slate-800 bg-slate-950 p-6">
            <div className="mb-5 inline-flex border border-lime-300/30 bg-slate-900 p-3 text-lime-200">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-xl font-medium text-white">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
          </article>
        ))}
      </section>

      <section className="border border-slate-800 bg-slate-950 p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Platform Direction</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">ForgeX can evolve in three product directions.</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            The current web workspace is the first step, but the broader idea is larger than a single UI. ForgeX can grow
            as an integration layer, a dedicated engineering product, or a stronger agentic system operating other tools.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {strategyOptions.map((item, index) => (
            <article key={item} className="border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm font-medium text-white">Option {index + 1}</p>
              <p className="mt-3 text-sm leading-7 text-slate-400">{item}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
