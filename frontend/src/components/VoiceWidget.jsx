function getLabel({ recording, transcribing, speaking }) {
  if (recording) {
    return "Listening...";
  }

  if (transcribing) {
    return "Transcribing...";
  }

  if (speaking) {
    return "ForgeX speaking...";
  }

  return "Tap to speak";
}

export default function VoiceWidget({
  recording,
  transcribing,
  speaking,
  microphoneSupported,
  onToggleRecording
}) {
  const active = recording || transcribing || speaking;

  return (
    <div className={active ? "voice-widget active" : "voice-widget"}>
      <button
        type="button"
        className={active ? "voice-core active" : "voice-core"}
        onClick={onToggleRecording}
        disabled={!microphoneSupported || transcribing}
      >
        {recording ? "■" : "●"}
      </button>

      <div className="voice-meta">
        <div className="voice-bars" aria-hidden="true">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              className={active ? "voice-bar active" : "voice-bar"}
              key={index}
              style={{ animationDelay: `${index * 0.04}s` }}
            />
          ))}
        </div>
        <p className="voice-label">{getLabel({ recording, transcribing, speaking })}</p>
      </div>
    </div>
  );
}
