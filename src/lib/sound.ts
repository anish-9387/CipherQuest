type ToneOptions = {
  frequency: number;
  duration?: number;
  type?: OscillatorType;
  gain?: number;
};

let sharedContext: AudioContext | null = null;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }
  if (!sharedContext) {
    const AudioCtx = window.AudioContext || (window as typeof window & {
      webkitAudioContext?: typeof AudioContext;
    }).webkitAudioContext;
    sharedContext = AudioCtx ? new AudioCtx() : null;
  }
  return sharedContext;
}

export function playTone({
  frequency,
  duration = 160,
  type = "sine",
  gain = 0.05,
}: ToneOptions) {
  const context = getAudioContext();
  if (!context) {
    return;
  }
  const oscillator = context.createOscillator();
  const volume = context.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  volume.gain.value = gain;
  oscillator.connect(volume);
  volume.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration / 1000);
}

export function playSuccess() {
  playTone({ frequency: 740, duration: 140, type: "triangle" });
  playTone({ frequency: 980, duration: 140, type: "triangle" });
}

export function playError() {
  playTone({ frequency: 220, duration: 220, type: "sawtooth", gain: 0.06 });
}
