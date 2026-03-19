import { useState } from "react";
import { ChevronDown, ChevronUp, PanelLeftClose, PanelLeftOpen, Volume2, VolumeX } from "lucide-react";

import OutputTabs from "../components/OutputTabs";
import { AIVoiceInput } from "@/components/ui/ai-voice-input";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/ui/chat-input";

function historyPreview(content) {
  const value = String(content || "").replace(/\s+/g, " ").trim();
  return value.length > 110 ? `${value.slice(0, 110)}...` : value;
}

function StatusChip({ runtimeStatus }) {
  return (
    <div className="flex items-center gap-3 border border-lime-300/30 bg-slate-950 px-4 py-2 text-sm text-lime-100">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping bg-lime-300 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 bg-lime-300" />
      </span>
      {runtimeStatus}
    </div>
  );
}

export default function WorkspacePage({
  mode,
  guidedFlow,
  activeTab,
  setActiveTab,
  input,
  setInput,
  messages,
  response,
  clarification,
  loading,
  error,
  voiceError,
  voiceEnabled,
  setVoiceEnabled,
  recording,
  transcribing,
  speaking,
  runtimeStatus,
  lastUserPrompt,
  microphoneSupported,
  speechSupported,
  canSubmit,
  handleSubmit,
  onGuidedQuickReply,
  startRecording,
  stopRecording,
  speakLastReply
}) {
  const [threadOpen, setThreadOpen] = useState(false);
  const [stepsOpen, setStepsOpen] = useState(true);
  const [troubleshootingOpen, setTroubleshootingOpen] = useState(true);

  const voiceLabel = recording
    ? "Listening..."
    : transcribing
      ? "Transcribing..."
      : speaking
        ? "ForgeX speaking..."
        : "Tap to speak";

  return (
    <>
      <main className="space-y-6">
        <section className="border border-slate-800 bg-slate-950 p-5">
          <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ForgeX Workspace</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                {clarification ? "Answer the clarification and continue." : "Ask a build, component, troubleshooting, or concept question."}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
                Use text or voice. ForgeX can explain components, compare platforms, troubleshoot faults, or generate a full implementation when the request calls for it.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" size="sm" variant="outline" onClick={() => setThreadOpen((current) => !current)}>
                {threadOpen ? <PanelLeftClose className="mr-2 h-4 w-4" /> : <PanelLeftOpen className="mr-2 h-4 w-4" />}
                {threadOpen ? "Hide History" : "Show History"}
              </Button>
              <StatusChip runtimeStatus={runtimeStatus} />
            </div>
          </div>

          {mode === "guided" && guidedFlow?.active ? (
            <div className="mb-5 border border-lime-300/30 bg-slate-900 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-lime-200">Guided Walkthrough Active</p>
                  <p className="mt-2 text-sm leading-7 text-slate-200">
                    Current step: {guidedFlow.currentStepIndex + 1} of {guidedFlow.totalSteps}. Say or type <span className="text-lime-200">done</span>, <span className="text-lime-200">yes</span>, or <span className="text-lime-200">next</span> when you finish this step.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => onGuidedQuickReply("done")}>
                    Done With Step
                  </Button>
                  <Button type="button" size="sm" variant="ghost" onClick={() => onGuidedQuickReply("repeat")}>
                    Repeat Step
                  </Button>
                </div>
              </div>
            </div>
          ) : null}

          {lastUserPrompt ? (
            <div className="mb-5 border border-slate-800 bg-slate-900 px-4 py-3 text-sm text-slate-300">
              Latest request: {lastUserPrompt}
            </div>
          ) : null}

          {clarification ? (
            <div className="mb-5 border border-amber-700 bg-amber-950/40 p-5">
              <p className="text-sm font-medium text-amber-100">{clarification.question}</p>
              <p className="mt-2 text-sm leading-7 text-amber-50/80">{clarification.reason}</p>
            </div>
          ) : null}

          <div className="mb-5">
            <AIVoiceInput
              active={recording || transcribing || speaking}
              label={voiceLabel}
              disabled={!microphoneSupported || transcribing || loading}
              onStart={() => {}}
              onStop={() => {}}
              className="bg-slate-950"
            />
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={recording ? stopRecording : startRecording}
                disabled={!microphoneSupported || loading || transcribing}
              >
                {recording ? "Stop Recording" : "Start Recording"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setVoiceEnabled((current) => !current)}>
                {voiceEnabled ? <VolumeX className="mr-2 h-4 w-4" /> : <Volume2 className="mr-2 h-4 w-4" />}
                {voiceEnabled ? "Mute Replies" : "Enable Replies"}
              </Button>
              <Button type="button" variant="ghost" onClick={speakLastReply} disabled={!speechSupported}>
                Repeat Reply
              </Button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <ChatInput
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Example: What is the difference between an ESP32 and an Arduino Uno for a greenhouse monitor, and which sensors should I consider first?"
            />
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-sm leading-7 text-slate-400">
                {guidedFlow?.active
                  ? "ForgeX is waiting for your confirmation before moving to the next guided step."
                  : recording
                  ? "Recording now. Stop when the description is complete."
                  : "ForgeX asks follow-up questions only when the engineering ambiguity changes the answer."}
              </p>
              <Button type="submit" size="lg" disabled={!canSubmit}>
                {recording
                  ? "Listening..."
                  : transcribing
                    ? "Transcribing..."
                    : loading
                      ? runtimeStatus
                      : clarification
                        ? "Send Answer"
                        : "Ask ForgeX"}
              </Button>
            </div>
          </form>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {voiceError ? <p className="mt-2 text-sm text-rose-300">{voiceError}</p> : null}
        </section>

        <section className="border border-slate-800 bg-slate-950 p-5">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">ForgeX Response</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Structured response</h2>
            </div>
            <OutputTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <section className="mb-5 border border-slate-800 bg-slate-900 p-5">
            <h3 className="text-lg font-medium text-white">Understanding</h3>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {response.understanding || "ForgeX will interpret the request here."}
            </p>

            {response.recommendedPlatform?.name ? (
              <div className="mt-5 border border-lime-300/30 bg-slate-950 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-lime-200">Recommended Platform</p>
                <strong className="mt-2 block text-white">{response.recommendedPlatform.name}</strong>
                <p className="mt-2 text-sm leading-7 text-slate-200">{response.recommendedPlatform.reason}</p>
              </div>
            ) : null}

            {response.assumptions?.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {response.assumptions.map((item, index) => (
                  <span
                    key={`${item}-${index}`}
                    className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </section>

          {activeTab === "components" ? (
            <section className="space-y-3">
              {response.components?.length > 0 ? (
                response.components.map((component, index) => (
                  <article key={`${component.name}-${index}`} className="border border-slate-800 bg-slate-900 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <strong className="text-white">{component.name}</strong>
                      <span className="text-sm text-slate-400">x{component.quantity}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-300">{component.purpose}</p>
                  </article>
                ))
              ) : (
                <div className="border border-slate-800 bg-slate-900 p-4 text-sm text-slate-400">
                  No component-specific output yet.
                </div>
              )}
            </section>
          ) : null}

          {activeTab === "build" ? (
            <section className="space-y-4">
              <article className="border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Guidance</p>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {response.circuit?.summary || "ForgeX will place practical engineering guidance here."}
                </p>
              </article>

              <article className="border border-slate-800 bg-slate-900 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Connections or Setup Notes</p>
                <div className="mt-3 space-y-3">
                  {response.circuit?.connections?.length > 0 ? (
                    response.circuit.connections.map((connection, index) => (
                      <div key={`${connection.from}-${connection.to}-${index}`} className="grid gap-2 border border-slate-800 bg-slate-950 p-3">
                        <span className="text-sm font-medium text-white">{connection.from}</span>
                        <span className="text-sm text-slate-400">{connection.to}</span>
                      </div>
                    ))
                  ) : (
                    <div className="border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">No setup notes needed for this response.</div>
                  )}
                </div>
              </article>

              <article className="border border-slate-800 bg-slate-900 p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setStepsOpen((current) => !current)}
                >
                  <h3 className="text-lg font-medium text-white">Steps</h3>
                  {stepsOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {stepsOpen ? (
                  <div className="mt-4 space-y-3">
                    {response.steps?.length > 0 ? (
                      response.steps.map((step, index) => (
                        <div key={`${step}-${index}`} className="grid grid-cols-[36px_1fr] gap-3 border border-slate-800 bg-slate-950 p-3">
                          <div className="flex h-9 w-9 items-center justify-center border border-lime-300/30 bg-slate-900 text-sm font-medium text-lime-200">
                            {index + 1}
                          </div>
                          <p className="text-sm leading-7 text-slate-300">{step}</p>
                        </div>
                      ))
                    ) : (
                      <div className="border border-slate-800 bg-slate-950 p-3 text-sm text-slate-400">No step-by-step plan was needed for this response.</div>
                    )}
                  </div>
                ) : null}
              </article>

              <article className="border border-slate-800 bg-slate-900 p-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => setTroubleshootingOpen((current) => !current)}
                >
                  <h3 className="text-lg font-medium text-white">Troubleshooting</h3>
                  {troubleshootingOpen ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </button>
                {troubleshootingOpen ? (
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    {[
                      ["Likely Issues", response.troubleshooting?.likelyIssues],
                      ["Checks", response.troubleshooting?.checks],
                      ["Next Steps", response.troubleshooting?.nextSteps]
                    ].map(([title, items]) => (
                      <div key={title} className="border border-slate-800 bg-slate-950 p-4">
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">{title}</p>
                        <div className="mt-3 space-y-2">
                          {items?.length > 0 ? (
                            items.map((item, index) => (
                              <div key={`${item}-${index}`} className="border border-slate-800 bg-slate-900 p-3 text-sm leading-6 text-slate-300">
                                {item}
                              </div>
                            ))
                          ) : (
                            <div className="border border-slate-800 bg-slate-900 p-3 text-sm text-slate-400">No troubleshooting details were needed here.</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            </section>
          ) : null}

          {activeTab === "code" ? (
            <section className="space-y-4">
              <article className="overflow-hidden border border-slate-800 bg-slate-950">
                <div className="border-b border-slate-800 px-4 py-3 text-xs uppercase tracking-[0.22em] text-slate-400">Code</div>
                <pre className="overflow-auto p-4 text-sm leading-7 text-lime-200">
                  <code>{response.code || "// No code was required for this response."}</code>
                </pre>
              </article>
              <article className="border border-slate-800 bg-slate-900 p-4">
                <h3 className="text-lg font-medium text-white">Explanation</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {response.explanation || "ForgeX will explain the reasoning behind the response here."}
                </p>
              </article>
            </section>
          ) : null}
        </section>
      </main>

      {threadOpen ? (
        <>
          <div className="fixed inset-0 z-30 bg-black/60" onClick={() => setThreadOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-40 flex w-full max-w-sm flex-col border-r border-slate-800 bg-slate-950 p-5 shadow-2xl shadow-black/50">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">History</p>
                <h3 className="mt-2 text-2xl font-semibold text-white">Project thread</h3>
              </div>
              <Button type="button" size="sm" variant="outline" onClick={() => setThreadOpen(false)}>
                Close
              </Button>
            </div>

            <div className="flex-1 space-y-2 overflow-y-auto pr-1">
              {messages.map((message, index) => (
                <article
                  key={`${message.role}-${index}`}
                  className={
                    message.role === "assistant"
                      ? "border border-sky-900 bg-slate-900 p-4"
                      : "border border-lime-300/30 bg-slate-900 p-4"
                  }
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      {message.role === "assistant" ? "ForgeX" : "You"}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">
                      {message.role === "assistant" ? "reply" : "prompt"}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-200">{historyPreview(message.content)}</p>
                </article>
              ))}
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
}
