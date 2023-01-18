var audioCtxHPS;
var streamRunningHPS = false;

// # General settings
var SAMPLE_FREQ = 48000 // sample frequency in Hz
var WINDOW_SIZE = Math.pow(2, 15) // window size of the DFT in samples
var WINDOW_STEP = WINDOW_SIZE / 2 // step size of window
var WINDOW_T_LEN = WINDOW_SIZE / SAMPLE_FREQ // length of the window in seconds
var SAMPLE_T_LENGTH = 1 / SAMPLE_FREQ // length between two samples in seconds
var NUM_HPS = 4 //max number of harmonic product spectrums
var DELTA_FREQ = (SAMPLE_FREQ / WINDOW_SIZE) // frequency step width of the interpolated DFT
    //var windowSamples = [0 for _ in range(WINDOW_SIZE)]

// Number.prototype.mod = function(n) {
//       return ((this%n)+n)%n;
//   };

var audioCtx;
var streamRunning = false;

Number.prototype.mod = function(n) {
    return ((this % n) + n) % n;
};


document.addEventListener("DOMContentLoaded", () => {
    let button = document.querySelector('#start_tuning');
    button.addEventListener('click', (e) => {
        e.preventDefault();
        if (streamRunning) {
            streamRunning = false;
            button.innerHTML = "<h3>Start Tuning!</h3>";
            document.querySelectorAll('.note').forEach(note => {
                note.classList.remove('selected');
            });
            audioCtx.close();
        } else {
            streamRunning = true;
            button.innerHTML = "<h3>Stop Tuning!</h3>";
            start_simple_tuner();
        }
    });
});

function start_simple_tuner() {
    "use strict";
    var input_data = [];
    var fft = new FFT(WINDOW_SIZE, 48000);
    var max_freq = 0;
    var spectrum = []

    var soundAllowed = async function(stream) {
        streamRunning = true;
        window.persistAudioStream = stream;
        audioCtx = new AudioContext({ sampleRate: 48000 });
        var audioStream = audioCtx.createMediaStreamSource(stream);

        // audioworklet
        await audioCtx.audioWorklet.addModule('/static/js/audioWorkletNode.js');
        const soundProcNode = new AudioWorkletNode(audioCtx, 'sound-processor');
        audioStream.connect(soundProcNode);
        soundProcNode.connect(audioCtx.destination);
        soundProcNode.port.onmessage = do_processing;
    }

    function do_processing(e) {
        if (!streamRunning) return;
        //Processing part
        input_data = input_data.concat(e.data);
        if (input_data.length >= WINDOW_SIZE) {
            fft.forward(input_data.slice(0, WINDOW_SIZE));
            spectrum = fft.spectrum;

            //Calculate signal power
            var normFactor = spectrum.reduce((t, n) => t + n ** 2);
            if ((normFactor / spectrum.length) < (3e-8)) {
                input_data = input_data.slice(WINDOW_STEP, input_data.length);
                return;
            }

            const indexOfMaxValue = spectrum.indexOf(Math.max(...spectrum));
            max_freq = indexOfMaxValue * (48000 / WINDOW_SIZE);
            input_data = input_data.slice(WINDOW_STEP, input_data.length);
            find_closest_note(max_freq);
        }
    }

    var soundNotAllowed = function(error) {
        console.log(error);
    }

    function find_closest_note(pitch) {
        const midiNum = Math.round(12 * Math.log2(pitch / fund)) + 69;
        currentNote = notes.find(currentNote => currentNote.num == midiNum);
        currentNote.pitch = pitch;
        currentNote.centsOff = getCents(currentNote.freq, pitch);

        document.querySelectorAll('.note').forEach(note => {
            note.classList.remove('selected');
        });

        document.querySelector(`#note-${currentNote.num}-${currentNote.noteName.replace('#','s').replace('/','_')}`).classList.add('selected');
        generateArray();
        // return [closest_note, closest_pitch];
    }

    navigator.getUserMedia = (navigator.getUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.msGetUserMedia);
    navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);
};

let recordedNotes = [];
let currentNote;
// let noteArray = [];

function generateArray() {
    let samplesEl = document.querySelector('#samples');

    if (recordedNotes[recordedNotes.length - 1] != undefined && recordedNotes[recordedNotes.length - 1].noteName == currentNote.noteName) {
        currentNote.samples.push([currentNote.pitch, getCents(currentNote.freq, currentNote.pitch)]);
        recordedNotes[recordedNotes.length - 1].pitch = average(currentNote.samples);
        recordedNotes[recordedNotes.length - 1].centsOff = getCents(currentNote.freq, currentNote.pitch);
    } else {
        recordedNotes.push(currentNote);
        samplesEl.innerHTML = '';
        currentNote.samples = [
            [currentNote.pitch, getCents(currentNote.freq, currentNote.pitch)]
        ];
    }

    let p = document.createElement('p');
    p.classList.add('sample');
    p.innerText = currentNote.samples[currentNote.samples.length - 1];
    samplesEl.appendChild(p);
    document.querySelector('#note_name').innerText = currentNote.noteName;
    document.querySelector('#frequencies').innerText = `${currentNote.pitch}/${currentNote.freq}`;
    document.querySelector('#cents').innerText = `${currentNote.centsOff} cents`;
    document.querySelector('#samples-num').innerText = `Number of samples: ${currentNote.samples.length}`;
    window.scrollTo(0, document.body.scrollHeight);
}

function getCents(f1, f2) {
    return 1200 * (Math.log(f2 / f1) / Math.log(2));;
}

function average(arr) {
    let total = 0;
    for (var i in arr) total += arr[i][0];
    console.log(total);
    return total / arr.length;
}