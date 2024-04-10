// NOTE CLASS
class Note {
    constructor(order, name, octave) {
        this.order = order;
        this.name = name;
        this.nameDisplay = name.replace('flat', '\u266D');
        this.octave = octave;
        this.sound = new Audio(audioPath+name+octave+'.mp3');
        this.div = document.createElement("div");

        if (this.name.includes('flat')) {
            this.div.classList.add('note-black');
        } else {
            this.div.classList.add('note-white');
        }

        keyboard.appendChild(this.div);
        this.div.addEventListener("click", this.noteClick.bind(this));
    }

    noteClick() {
        if (isPlaying || !hasPlayed || currentBoxIndex >= notesNumber) {
            return
        }

        feedback.innerHTML = ''; // to clear too few notes message when new note is entered

        this.sound.cloneNode().play();

        melodyAnswer.push(this);

        document.getElementsByClassName("note-box")[currentBoxIndex].innerHTML = this.nameDisplay;
        currentBoxIndex++;
        
    }
}

// GET ELEMENTS
const notesInput = document.getElementById('notes-input');
const feedback = document.getElementById('feedback');
const keyboardWrapper = document.getElementById('keyboard-wrapper');
const keyboard = document.getElementById('keyboard');
const startBtn = document.getElementById('btn-start');
const nextBtn = document.getElementById('btn-next');
const confirmBtn = document.getElementById('btn-confirm');
const deleteBtn = document.getElementById('btn-delete');
const replayBtn = document.getElementById('btn-replay');
const playBtn = document.getElementById('btn-play');
const stopBtn = document.getElementById('btn-stop');
const revealBtn = document.getElementById('btn-reveal');

const alertModal = document.getElementById('next-alert');
const yesBtn = document.getElementById('btn-yes');
const noBtn = document.getElementById('btn-no');


//CREATE VARIABLES CORRESPONDING TO OPTIONS
let rootNote = 'C';
let notesNumber = 0;
let notesIntervals = [];
let tempo = 60;
let highlight = false;
let first = true;

//CREATE OTHER USEFUL VARIABLES
let notesBoxes = [];        // array of divs that will contain the note names played by the user
const notes = [];           // array of all notes objects
const noteNames = ['C', 'Dflat', 'D', 'Eflat', 'E', 'F', 'Gflat', 'G', 'Aflat', 'A', 'Bflat', 'B'];
const noteNamesDisplay = [...noteNames];
for (let i = 0; i < noteNamesDisplay.length; i++) {
    noteNamesDisplay[i] = noteNamesDisplay[i].replace('flat', '\u266D');
}
const octaves = [3, 4, 5, 6];
const totalNotes = noteNames.length * (octaves.length - 1) + 1  //include only C from the last octave
let audioPath = '60bpm/'

const noteShifts = [0, 0.5, 1, 1.5, 2, 3, 3.5, 4, 4.5, 5, 5.5, 6];  //shifts for the keyboard according to the root note

let isPlaying = false;
let hasPlayed = false;
let isCorrect = true; //to avoid displaying modal on first start
let melodyAnswer = [];
let currentBoxIndex = 0;
let melody = [];
let plzStop = false;
let nextRoundStart = true;   //only used to keep track of next round type when opening modal


// INITIALIZE KEYBOARD
for (let i = 0; i < totalNotes; i++) {
    const currentNoteName = noteNames[i%noteNames.length];
    const currentNoteOctave = octaves[Math.floor(i / noteNames.length)];
    notes.push(new Note(i, currentNoteName, currentNoteOctave));
}


// INITIALIZE OPTIONS
// root note
const chooseRootNote = document.getElementById("root-note");
for (let i = 0; i < noteNamesDisplay.length; i++) {
    const option = document.createElement("option");
    option.value = noteNames[i];
    option.text = noteNamesDisplay[i];
    chooseRootNote.add(option);   
}

// number of notes in melody
const chooseNotesNumber = document.getElementById("notes-number");
for (let i = 2; i < 11; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.text = i;
    chooseNotesNumber.add(option);   
}
chooseNotesNumber.value=4;

// notes intervals
const chooseNotesIntervals = document.getElementById("notes-intervals");
const allNotesIntervals = ['m2', 'M2', 'm3', 'M3', 'P4', 'A4/d5', 'P5', 'm6', 'M6', 'm7', 'M7', 'P8'];
for (let i = 0; i < allNotesIntervals.length; i++) {             
    var checkbox = document.createElement('input');
    checkbox.type = "checkbox";
    checkbox.name = allNotesIntervals[i];
    checkbox.value = i+1;                   //number of semitones
    checkbox.id = allNotesIntervals[i];
        
    var label = document.createElement('label');
    label.htmlFor = ' '+allNotesIntervals[i];
    label.appendChild(document.createTextNode(allNotesIntervals[i]));

    var currentDiv = document.createElement('div');
    currentDiv.appendChild(checkbox);
    currentDiv.appendChild(label); 
    chooseNotesIntervals.appendChild(currentDiv);
}
document.getElementById('M3').checked = true;
document.getElementById('P5').checked = true;



// INITIALIZE VARIABLES WITH SELECTED OPTIONS
//function definition
function initVariables() {
    //root note
    rootNote = chooseRootNote.value;

    //number of notes in melody
    notesNumber = parseInt(chooseNotesNumber.value);

    //notes intervals
    notesIntervals = [0];           //include root note
    for (let i = 0; i < allNotesIntervals.length; i++) {
        checkbox = document.getElementById(allNotesIntervals[i]);
        if (checkbox.checked) {
            notesIntervals.push(parseInt(checkbox.value));        //number of semitones
        }    
    }

    //tempo
    const chooseTempo = document.getElementById("tempo");
    tempo = parseInt(chooseTempo.value);
    // audioPath = 'tempo + 'bpm/';
    // for (let i = 0; i < notes.length; i++) {
    //     const n = notes[i];
    //     n.sound = new Audio(audioPath+n.name+n.octave+'.mp3');
    // }

    //highlight possible notes
    highlight = document.getElementById('highlight').checked;

    //show first note
    first = document.getElementById('first').checked;
}


// INITIALIZE NOTES INPUT
// notesBoxes = [];
function initInput() {
    notesInput.innerHTML = '';
    for (let i = 0; i < notesNumber; i++) {
        const noteBox = document.createElement("div");
        noteBox.classList.add('note-box');
        // notesBoxes.push(noteBox);
        notesInput.appendChild(noteBox);
    }
}


//run functions when loading the page for the first time
initVariables();
initInput();


// MELODY HANDLING
// generate melody: return the sequence of notes as an array of Note objects
let possibleNotes = [];
function generateMelody() {
    // get root note by order
    let currentRootOrder = 0;
    if (rootNote == 'random') {
        currentRootOrder = Math.floor(Math.random()*(notes.length-12));
    } else if (rootNote == 'C') {
        const possibleOctaves = octaves.slice(0, -1);
        const currentOctaveIndex = Math.floor(Math.random()*possibleOctaves.length);
        currentRootOrder = currentOctaveIndex*12 + noteNames.indexOf(rootNote);
    } else {
        const possibleOctaves = octaves.slice(0, -2);
        const currentOctaveIndex = Math.floor(Math.random()*possibleOctaves.length);
        currentRootOrder = currentOctaveIndex*12 + noteNames.indexOf(rootNote);
    }

    const currentOctaveIndex = Math.floor(currentRootOrder/12);
    //get possible notes in an array of Note objects
    possibleNotes=[];
    for (let i = 0; i < notesIntervals.length; i++) {
        const interval = notesIntervals[i];
        possibleNotes.push(notes[currentRootOrder + interval]);
    }


    // move keyboard (total shift = width of one key * shiftMultiplier)
    const shiftMultiplier = currentOctaveIndex*7 + noteShifts[currentRootOrder%12];
    const vwShift = 12*shiftMultiplier*window.innerWidth/100;
    const pxShift = 100*shiftMultiplier;
    keyboardWrapper.scrollLeft = Math.min(vwShift, pxShift);


    //generate melody: create sequence of Note objects
    const melodyNotes = [];
    for (let i = 0; i < notesNumber; i++) {
        melodyNotes.push(possibleNotes[Math.floor(Math.random()*possibleNotes.length)]);
    }
    return melodyNotes;
}

//play an array of Audio
function playSnd(audioFiles, i) {
    if (plzStop) {
        plzStop = false;
        isPlaying = false;
        hasPlayed = true;
        return;
    }

    i++;
    if (i == audioFiles.length) {
        isPlaying = false;
        hasPlayed = true;
        return;
    }

    audioFiles[i].play();

    // audioFiles[i].addEventListener('ended', () => playSnd(audioFiles, i));
    // audioFiles[i].play();

    setTimeout(() => playSnd(audioFiles, i), 60000/tempo);
}
// play an array of Notes
function playMelody(melody) {
    // clone note sounds in new array
    let audioFiles = [];
    for (let i = 0; i < melody.length; i++) {
        audioFiles.push(melody[i].sound.cloneNode());
    }
    
    isPlaying = true;
    playSnd(audioFiles, -1);   // play notes sequence recursively
}



// BUTTONS INTERACTION

// start/next
function newRound(start) {
    // can't click next before start
    if (!start && !hasPlayed) {
        return
    }

    // check correct answer before continuing
    if (hasPlayed && !isCorrect) {
        alertModal.style.display = "block";
        nextRoundStart = start;
        return;
    }

    //remove notes from boxes
    if (!start) {
        boxes = document.getElementsByClassName("note-box");
        for (let i = 0; i < boxes.length; i++) {
            boxes[i].innerHTML = [];
        } 
    }

    //remove previous highlights and feedback
    for (let i = 0; i < possibleNotes.length; i++) {
        const note = possibleNotes[i];
        note.div.classList.remove('possible');
        note.div.classList.remove('first');
    }
    feedback.innerHTML = '';

    // reset playing status
    isPlaying = false;
    hasPlayed = false;
    isCorrect = false;
    melody = [];
    melodyAnswer = [];
    currentBoxIndex = 0;

    //initialize
    if (start) {
        initVariables();
        initInput();
    }

    
    //generate and play melody
    melody = generateMelody();
    playMelody(melody);

    //highlight possible and first notes if necessary
    if (highlight) {
        for (let i = 0; i < possibleNotes.length; i++) {
            const note = possibleNotes[i];
            note.div.classList.add('possible');
        }
    }
    if (first) {
        const firstNote = melody[0];
        firstNote.div.classList.add('first');
    }

}
startBtn.addEventListener("click", ()=>newRound(true));
nextBtn.addEventListener("click", ()=>newRound(false));


// confirm
function checkMelody() {
    for (let i = 0; i < notesNumber; i++) {
        if (melody[i] != melodyAnswer[i]) {
            return false;
        } 
    }
    return true;
}

function confirm() {
    if (!hasPlayed) {
        return;
    }

    if (melodyAnswer.length < notesNumber) {
        feedback.innerHTML = 'Not enough notes!';
        return;
    }

    if (checkMelody()) {
        feedback.innerHTML = 'Correct!';
        isCorrect = true;
    } else {
        feedback.innerHTML = 'Wrong. Try again!'
    }
}
confirmBtn.addEventListener("click", confirm);


// delete
function deleteNote() {
    if (!hasPlayed || !currentBoxIndex) {
        return;
    }

    feedback.innerHTML = '';
    melodyAnswer.pop();
    currentBoxIndex--;
    document.getElementsByClassName("note-box")[currentBoxIndex].innerHTML = '';
}
deleteBtn.addEventListener("click", deleteNote);


// replay melody
playBtn.addEventListener("click", () => playMelody(melody));


// replay answer
replayBtn.addEventListener("click", () => playMelody(melodyAnswer));

// stop
stopBtn.addEventListener("click", () => plzStop = true);

//reveal answer
function reveal() {
    if (!melody.length) {
        feedback.innerHTML = 'Please start the exercise.';
        return;
    }

    for (let i = 0; i < notesNumber; i++) {
        document.getElementsByClassName("note-box")[i].innerHTML = melody[i].nameDisplay;
        melodyAnswer[i] = melody[i];
    }
    currentBoxIndex = notesNumber;
    feedback.innerHTML = 'Here\'s the correct answer.';
    isCorrect = true;
}
revealBtn.addEventListener("click", reveal);



// MODAL INTERACTION
yesBtn.onclick = function() {
    isCorrect = true; // stop modal from reappearing
    alertModal.style.display = "none";
    newRound(nextRoundStart);
}

noBtn.onclick = function() {
    alertModal.style.display = "none";
}
  
window.onclick = function(event) {
    if (event.target == alertModal) {
        alertModal.style.display = "none";
    }
}
