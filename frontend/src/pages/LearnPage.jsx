import { Button } from "@/components/ui/button";
import { starterPrompts, testimonials } from "../data";

const flowCards = [
  {
    title: "1. State the engineering goal",
    body: "Describe what you want to build, what is failing, or where you are uncertain."
  },
  {
    title: "2. ForgeX decides how to respond",
    body: "Guided Mode asks only when the ambiguity changes the engineering outcome. Agent Mode proceeds with disciplined assumptions."
  },
  {
    title: "3. Review the full output",
    body: "You receive platform choice, components, build steps, code, and a troubleshooting path in one workflow."
  }
];

export default function LearnPage({ onUsePrompt }) {
  return (
    <div className="space-y-8">
      <section className="border border-slate-800 bg-slate-950 p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">How It Works</p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white">The product explains itself here so the workspace can stay focused.</h2>
          <p className="mt-4 text-base leading-8 text-slate-300">
            ForgeX is built as a hybrid of tutor, embedded engineer, and troubleshooting assistant. This page is where
            the workflow, examples, and proof points live without overcrowding the main build environment.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {flowCards.map((card) => (
            <article key={card.title} className="border border-slate-800 bg-slate-900 p-5">
              <strong className="text-white">{card.title}</strong>
              <p className="mt-3 text-sm leading-7 text-slate-400">{card.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border border-slate-800 bg-slate-950 p-6 md:p-8">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Prompt Library</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Use prompts that expose platform choice and troubleshooting depth.</h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {starterPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onUsePrompt(prompt)}
              className="border border-slate-800 bg-slate-900 p-5 text-left text-sm leading-7 text-slate-200 transition hover:border-lime-300/30 hover:bg-slate-800"
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      <section className="border border-slate-800 bg-slate-950 p-6 md:p-8">
        <div className="flex items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Signals From Builders</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white">Short proof points that support the product story.</h2>
          </div>
          <Button variant="outline" onClick={() => onUsePrompt(starterPrompts[0])}>
            Try a prompt
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="border border-slate-800 bg-slate-900 p-5">
              <p className="text-sm leading-7 text-slate-300">{item.quote}</p>
              <div className="mt-5">
                <strong className="block text-white">{item.name}</strong>
                <span className="text-sm text-slate-500">{item.role}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
