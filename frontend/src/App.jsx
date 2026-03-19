import { MoonStar, SunMedium } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import HomePage from "./pages/HomePage";
import LearnPage from "./pages/LearnPage";
import WorkspacePage from "./pages/WorkspacePage";

const loadingStages = [
  "Thinking...",
  "Processing requirements...",
  "Selecting the right platform...",
  "Building process plan...",
  "Preparing troubleshooting guidance..."
];

const defaultResponse = {
  understanding: "",
  assumptions: [],
  knowledge: [],
  recommendedPlatform: {
    name: "",
    reason: ""
  },
  components: [],
  circuit: {
    summary: "",
    connections: []
  },
  steps: [],
  code: "",
  troubleshooting: {
    likelyIssues: [],
    checks: [],
    nextSteps: []
  },
  explanation: ""
};

const emptyGuidedFlow = {
  active: false,
  currentStepIndex: 0,
  totalSteps: 0
};

function pickSpeechVoice(voices) {
  const preferredPatterns = [
    /aria/i,
    /jenny/i,
    /guy/i,
    /sara/i,
    /sonia/i,
    /natasha/i,
    /samantha/i,
    /natural/i,
    /neural/i,
    /google.*english/i,
    /zira/i,
    /davis/i
  ];

  const englishVoices = voices.filter((voice) => /^en(-|_)/i.test(voice.lang));

  for (const pattern of preferredPatterns) {
    const match = englishVoices.find((voice) => pattern.test(voice.name));
    if (match) {
      return match;
    }
  }

  return englishVoices[0] || voices[0] || null;
}

function buildComponentsSpeech(response) {
  if (!response?.components?.length) {
    return "";
  }

  const components = response.components
    .slice(0, 6)
    .map((component) => `${component.quantity > 1 ? `${component.quantity} ` : ""}${component.name}`)
    .join(", ");

  return components ? `The main components are ${components}.` : "";
}

function buildStepsSpeech(response) {
  if (!response?.steps?.length) {
    return "";
  }

  const steps = response.steps
    .slice(0, 5)
    .map((step, index) => `Step ${index + 1}. ${step}`)
    .join(" ");

  return steps;
}

function buildTroubleshootingSpeech(response) {
  if (!response?.troubleshooting?.likelyIssues?.length) {
    return "";
  }

  return `Watch for this while building: ${response.troubleshooting.likelyIssues[0]}.`;
}

function buildSolutionSpeech(response) {
  if (!response?.understanding) {
    return "ForgeX completed the build plan.";
  }

  const parts = [response.understanding];

  if (response?.recommendedPlatform?.name) {
    parts.push(`The recommended platform is ${response.recommendedPlatform.name}. ${response.recommendedPlatform.reason}`);
  }

  const componentsSpeech = buildComponentsSpeech(response);
  if (componentsSpeech) {
    parts.push(componentsSpeech);
  }

  const stepsSpeech = buildStepsSpeech(response);
  if (stepsSpeech) {
    parts.push(`The main implementation steps are: ${stepsSpeech}`);
  }

  const troubleshootingSpeech = buildTroubleshootingSpeech(response);
  if (troubleshootingSpeech) {
    parts.push(troubleshootingSpeech);
  }

  return parts.join(" ");
}

function buildGuidedStepPrompt(response, stepIndex) {
  const totalSteps = response?.steps?.length || 0;
  const step = response?.steps?.[stepIndex] || "";

  if (!step || totalSteps === 0) {
    return "";
  }

  return `Step ${stepIndex + 1} of ${totalSteps}. ${step}. Tell me when you have done this step, and I will move to the next one.`;
}

function buildGuidedIntroSpeech(response) {
  const parts = [response.understanding];

  if (response?.recommendedPlatform?.name) {
    parts.push(`The recommended platform is ${response.recommendedPlatform.name}.`);
  }

  const componentsSpeech = buildComponentsSpeech(response);
  if (componentsSpeech) {
    parts.push(componentsSpeech);
  }

  const firstStepPrompt = buildGuidedStepPrompt(response, 0);
  if (firstStepPrompt) {
    parts.push(`We will do this one step at a time. ${firstStepPrompt}`);
  }

  return parts.join(" ");
}

function buildGuidedCompletionSpeech(response) {
  const parts = ["You have completed all the guided steps."];

  if (response?.troubleshooting?.checks?.length) {
    parts.push(`Before you finish, run this check: ${response.troubleshooting.checks[0]}.`);
  }

  return parts.join(" ");
}

function isShortGuidedReply(text) {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length <= 8;
}

function isGuidedAdvance(text) {
  return (
    isShortGuidedReply(text) &&
    /\b(yes|done|completed|finished|next|proceed|ready|go ahead|okay|ok)\b/i.test(text)
  );
}

function isGuidedRepeat(text) {
  return isShortGuidedReply(text) && /\b(no|not yet|repeat|again|help|explain)\b/i.test(text);
}

function isGuidedCancel(text) {
  return isShortGuidedReply(text) && /\b(stop|cancel|quit|exit)\b/i.test(text);
}

function getPreferredTab(response) {
  if (response?.components?.length && !response?.steps?.length && !response?.code) {
    return "components";
  }

  if (response?.code) {
    return "code";
  }

  return "build";
}

function getPageFromHash() {
  if (typeof window === "undefined") {
    return "home";
  }

  const normalized = window.location.hash.replace(/^#\/?/, "");
  return normalized === "workspace" || normalized === "learn" || normalized === "home" ? normalized : "home";
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    return window.localStorage.getItem("forgex-theme") || "dark";
  });
  const [page, setPage] = useState(getPageFromHash);
  const [mode, setMode] = useState("agent");
  const [activeTab, setActiveTab] = useState("build");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "ForgeX is ready. Describe the embedded or electronics project you want to build or troubleshoot."
    }
  ]);
  const [response, setResponse] = useState(defaultResponse);
  const [clarification, setClarification] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [voiceError, setVoiceError] = useState("");
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [recording, setRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const [lastSpokenText, setLastSpokenText] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const [loadingStageIndex, setLoadingStageIndex] = useState(0);
  const [guidedFlow, setGuidedFlow] = useState(emptyGuidedFlow);

  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const speechVoicesRef = useRef([]);

  const canSubmit = input.trim().length > 0 && !loading && !transcribing;
  const microphoneSupported = useMemo(
    () =>
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof window !== "undefined" &&
      "MediaRecorder" in window,
    []
  );
  const speechSupported = useMemo(() => typeof window !== "undefined" && "speechSynthesis" in window, []);

  const lastUserPrompt = useMemo(() => {
    const userMessages = messages.filter((message) => message.role === "user");
    return userMessages.at(-1)?.content ?? "";
  }, [messages]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("forgex-theme", theme);
    }
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!speechSupported) {
      return undefined;
    }

    const loadVoices = () => {
      speechVoicesRef.current = window.speechSynthesis.getVoices();
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, [speechSupported]);

  useEffect(
    () => () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
        mediaRecorderRef.current.stop();
      }

      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    },
    []
  );

  useEffect(() => {
    if (!loading) {
      setLoadingStageIndex(0);
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setLoadingStageIndex((current) => (current + 1) % loadingStages.length);
    }, 1300);

    return () => window.clearInterval(intervalId);
  }, [loading]);

  useEffect(() => {
    if (!voiceEnabled && speechSupported) {
      window.speechSynthesis.cancel();
    }
  }, [speechSupported, voiceEnabled]);

  function navigate(nextPage) {
    if (typeof window === "undefined") {
      setPage(nextPage);
      return;
    }

    window.location.hash = `/${nextPage}`;
  }

  function speakText(text) {
    if (!speechSupported || !voiceEnabled || !text) {
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = pickSpeechVoice(speechVoicesRef.current);

    utterance.rate = 0.96;
    utterance.pitch = 1;
    utterance.volume = 1;

    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setLastSpokenText(text);
  }

  const runtimeStatus = useMemo(() => {
    if (recording) {
      return "Listening...";
    }
    if (transcribing) {
      return "Transcribing voice prompt...";
    }
    if (loading) {
      return loadingStages[loadingStageIndex];
    }
    if (speaking) {
      return "Speaking...";
    }
    if (guidedFlow.active) {
      return `Waiting for step ${guidedFlow.currentStepIndex + 1} confirmation...`;
    }
    return "Ready for the next engineering request.";
  }, [guidedFlow.active, guidedFlow.currentStepIndex, loading, loadingStageIndex, recording, speaking, transcribing]);

  function handleGuidedFlowInput(promptText) {
    if (!guidedFlow.active || mode !== "guided") {
      return false;
    }

    const trimmed = promptText.trim();
    const userMessage = { role: "user", content: trimmed };

    if (isGuidedCancel(trimmed)) {
      const assistantMessage = "Guided walkthrough paused. Ask another question or request a new build when you are ready.";
      setMessages((current) => [...current, userMessage, { role: "assistant", content: assistantMessage }]);
      setGuidedFlow(emptyGuidedFlow);
      speakText(assistantMessage);
      setInput("");
      return true;
    }

    if (isGuidedAdvance(trimmed)) {
      const nextStepIndex = guidedFlow.currentStepIndex + 1;

      if (nextStepIndex < guidedFlow.totalSteps) {
        const assistantMessage = buildGuidedStepPrompt(response, nextStepIndex);
        setMessages((current) => [...current, userMessage, { role: "assistant", content: assistantMessage }]);
        setGuidedFlow((current) => ({
          ...current,
          currentStepIndex: nextStepIndex
        }));
        speakText(assistantMessage);
      } else {
        const completionMessage = "All guided steps are complete.";
        setMessages((current) => [...current, userMessage, { role: "assistant", content: completionMessage }]);
        setGuidedFlow(emptyGuidedFlow);
        speakText(buildGuidedCompletionSpeech(response));
      }

      setInput("");
      return true;
    }

    if (isGuidedRepeat(trimmed)) {
      const assistantMessage = buildGuidedStepPrompt(response, guidedFlow.currentStepIndex);
      setMessages((current) => [...current, userMessage, { role: "assistant", content: assistantMessage }]);
      speakText(assistantMessage);
      setInput("");
      return true;
    }

    setGuidedFlow(emptyGuidedFlow);
    return false;
  }

  async function submitPrompt(promptText) {
    if (handleGuidedFlowInput(promptText)) {
      return;
    }

    const nextUserMessage = { role: "user", content: promptText.trim() };
    const nextMessages = [...messages, nextUserMessage];

    setMessages(nextMessages);
    setInput("");
    setLoading(true);
    setError("");
    setVoiceError("");
    navigate("workspace");

    try {
      const result = await fetch("/api/solve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: promptText.trim(),
          mode,
          messages: nextMessages
        })
      });

      const payload = await result.json();

      if (!result.ok) {
        throw new Error(payload.error || "ForgeX request failed.");
      }

      if (payload.status === "clarification") {
        const question = payload.clarification?.question || "What should ForgeX optimize for?";
        setClarification(payload.clarification);
        setMessages((current) => [...current, { role: "assistant", content: question }]);
        speakText(question);
        return;
      }

      const nextResponse = payload.response ?? defaultResponse;
      const assistantMessage =
        nextResponse.understanding || "Solution ready. Review the platform recommendation, build guidance, and code.";

      setClarification(null);
      setResponse(nextResponse);
      if (mode === "guided" && nextResponse.steps?.length > 0) {
        const guidedPrompt = buildGuidedStepPrompt(nextResponse, 0);
        setGuidedFlow({
          active: true,
          currentStepIndex: 0,
          totalSteps: nextResponse.steps.length
        });
        setMessages((current) => [
          ...current,
          { role: "assistant", content: assistantMessage },
          { role: "assistant", content: guidedPrompt }
        ]);
        speakText(buildGuidedIntroSpeech(nextResponse));
      } else {
        setGuidedFlow(emptyGuidedFlow);
        setMessages((current) => [...current, { role: "assistant", content: assistantMessage }]);
        speakText(buildSolutionSpeech(nextResponse));
      }
      setActiveTab(getPreferredTab(nextResponse));
    } catch (submissionError) {
      setError(submissionError.message);
    } finally {
      setLoading(false);
    }
  }

  async function transcribeAndSend(audioBlob) {
    setTranscribing(true);
    setVoiceError("");

    try {
      const result = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": audioBlob.type || "application/octet-stream"
        },
        body: audioBlob
      });

      const payload = await result.json();

      if (!result.ok) {
        throw new Error(payload.detail || payload.error || "Audio transcription failed.");
      }

      const transcript = String(payload.text || "").trim();

      if (!transcript) {
        throw new Error("No speech was detected in the recording.");
      }

      await submitPrompt(transcript);
    } catch (transcriptionError) {
      setVoiceError(transcriptionError.message);
    } finally {
      setTranscribing(false);
    }
  }

  async function startRecording() {
    if (!microphoneSupported) {
      setVoiceError("This browser does not support microphone recording.");
      return;
    }

    if (loading || transcribing) {
      return;
    }

    setVoiceError("");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = window.MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";
      const recorder = new MediaRecorder(
        stream,
        window.MediaRecorder.isTypeSupported(preferredMimeType) ? { mimeType: preferredMimeType } : undefined
      );

      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];
        setRecording(false);

        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach((track) => track.stop());
          mediaStreamRef.current = null;
        }

        if (audioBlob.size > 0) {
          await transcribeAndSend(audioBlob);
        }
      };

      recorder.start();
      setRecording(true);
    } catch (recordingError) {
      setVoiceError(recordingError.message || "Microphone access failed.");
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (canSubmit) {
      submitPrompt(input);
    }
  }

  function handleUsePrompt(prompt) {
    setInput(prompt);
    navigate("workspace");
  }

  function toggleMode() {
    setMode((current) => (current === "agent" ? "guided" : "agent"));
  }

  const shellClasses =
    theme === "light"
      ? "min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#edf2f7_100%)] px-4 py-6 text-slate-950 md:px-6"
      : "min-h-screen bg-[linear-gradient(180deg,#020617_0%,#060b16_52%,#020617_100%)] px-4 py-6 text-white md:px-6";

  const panelClasses =
    theme === "light"
      ? "border-slate-300 bg-white text-slate-950"
      : "border-slate-800 bg-slate-950 text-white";

  return (
    <div className={shellClasses}>
      <div className="mx-auto max-w-[1500px] space-y-8">
        <header className={`border p-4 shadow-xl md:px-6 ${panelClasses}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center border border-lime-300 bg-lime-300 text-lg font-semibold text-slate-950">
                FX
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Engineering copilot</p>
                <h1 className="text-2xl font-semibold tracking-tight">ForgeX</h1>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {[
                ["home", "Home"],
                ["workspace", "Workspace"],
                ["learn", "How It Works"]
              ].map(([id, label]) => (
                <Button key={id} type="button" size="sm" variant={page === id ? "default" : "outline"} onClick={() => navigate(id)}>
                  {label}
                </Button>
              ))}
              <Button type="button" size="sm" variant="outline" onClick={toggleMode}>
                {mode === "agent" ? "Agent Mode" : "Guided Mode"}
              </Button>
              <div className="border border-slate-700 bg-slate-950 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {voiceEnabled ? "Voice On" : "Voice Muted"}
              </div>
              <Button type="button" size="icon" variant="outline" onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}>
                {theme === "dark" ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </header>

        {page === "home" ? (
          <HomePage
            onLaunchDemo={() => {
              setMode("agent");
              handleUsePrompt("Build a traffic light system with Arduino and pedestrian push button");
            }}
            onTryGuided={() => {
              setMode("guided");
              handleUsePrompt("Build an ultrasonic parking sensor with Arduino and buzzer");
            }}
            onNavigateWorkspace={() => navigate("workspace")}
          />
        ) : null}

        {page === "workspace" ? (
          <WorkspacePage
            mode={mode}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            input={input}
            setInput={setInput}
            messages={messages}
            response={response}
            clarification={clarification}
            loading={loading}
            error={error}
            voiceError={voiceError}
            voiceEnabled={voiceEnabled}
            setVoiceEnabled={setVoiceEnabled}
            recording={recording}
            transcribing={transcribing}
            speaking={speaking}
            runtimeStatus={runtimeStatus}
            guidedFlow={guidedFlow}
            lastUserPrompt={lastUserPrompt}
            microphoneSupported={microphoneSupported}
            speechSupported={speechSupported}
            canSubmit={canSubmit}
            handleSubmit={handleSubmit}
            onGuidedQuickReply={submitPrompt}
            startRecording={startRecording}
            stopRecording={stopRecording}
            speakLastReply={() => speakText(lastSpokenText)}
          />
        ) : null}

        {page === "learn" ? <LearnPage onUsePrompt={handleUsePrompt} /> : null}
      </div>
    </div>
  );
}
