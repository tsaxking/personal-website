// This is how to play 441 Hertz sine wave tone in the browser using the cross - browser AudioContext.
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let context;
if (!window.AudioContext) {
    alert('AudioContext not supported')
} else {
    context = new AudioContext();
}
let o,
    g,
    fund = 440,
    piano;

let notes = [];

document.addEventListener('DOMContentLoaded', () => {
    let noteNum = 21;
    piano = document.querySelector("#piano");
    frequencyDisplayElement = document.querySelector('#frequency');
    document.querySelectorAll('.note').forEach(note => {
        let noteId = note.getAttribute('data-note') + note.parentElement.id.split('-')[1];

        let p = document.createElement('p');
        p.classList.add('note-name');
        p.innerHTML = noteId.replace('/', '<br>');
        note.appendChild(p);

        note.id = `note-${noteNum}-${noteId}`.replace('#', 's').replace('/', '_');
        let freq = determineFrequency(noteNum);
        note.setAttribute('data-frequency', freq);
        notes.push({ num: noteNum, freq: freq, noteName: noteId });

        note.addEventListener('mousedown', () => {
            startSound(note);
        });

        note.addEventListener('mouseup', () => {
            stopSound();
        });

        noteNum++;
    });

    var fundFreqInput = document.querySelector('#fund_freq');

    fundFreqInput.addEventListener('input', () => {
        document.querySelector('#fund_freq-label').innerText = fundFreqInput.value;
        fund = fundFreqInput.value;
        notes = [];
        noteNum = 21;

        document.querySelectorAll('.note').forEach(note => {
            freq = determineFrequency(noteNum);
            notes.push({ num: note.id.split('-')[1], freq: freq, noteName: note.id.split('-')[2] });
            note.setAttribute('data-frequency', freq);
            noteNum++;
        });
    });

    piano.scrollTo(1000, 0);
});

function startSound(note) {
    o = context.createOscillator();
    o.type = "sine";
    g = context.createGain();
    o.connect(g);
    g.connect(context.destination);
    o.frequency.value = note.getAttribute('data-frequency');
    o.start(0);
}

function stopSound() {
    g.gain.exponentialRampToValueAtTime(
        0.00001, context.currentTime + 1
    );
}

function determineFrequency(midiNum) {
    // freq = fund * 2^n/12 | n = distance from A4 (midi 69)
    return fund * Math.pow(2, (midiNum - 69) / 12);
}