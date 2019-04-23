// for legacy browsers
const AudioContext = window.AudioContext || window.webkitAudioContext;

const audioContext = new AudioContext();

var audioElement = document.getElementById("audio");
var loopStart = document.getElementById("loopStart");
var loopEnd = document.getElementById("loopEnd");

const track = audioContext.createMediaElementSource(audioElement);
const gainNode = audioContext.createGain();
const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);
track
  .connect(gainNode)
  .connect(panner)
  .connect(audioContext.destination);

const playButton = document.getElementById("playButton");
playButton.addEventListener("click", function() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  // play or pause track depending on state
  if (this.dataset.playing === "false") {
    audioElement.play();
    this.dataset.playing = "true";
  } else if (this.dataset.playing === "true") {
    audioElement.pause();
    this.dataset.playing = "false";
  }
});

audioElement.addEventListener(
  "ended",
  () => {
    playButton.dataset.playing = "false";
  },
  false
);

const volumeControl = document.querySelector("#volume");

volumeControl.addEventListener(
  "input",
  function() {
    gainNode.gain.value = this.value;
  },
  false
);

const pannerControl = document.querySelector("#panner");

pannerControl.addEventListener(
  "input",
  function() {
    panner.pan.value = this.value;
  },
  false
);

let loop;
let detune;
let loopStart;
let loopEnd;
let playbackRate;

// Variables for the node’s playback parameters
let start = 0,
  offset = 0,
  duration = Infinity; // Set by start()
let stop = Infinity; // Set by stop()

let bufferTime = 0;
let started = false;
let enteredLoop = false;
let bufferTImeElapsed = 0;
let dt = 1 / audioContext.sampleRate;
