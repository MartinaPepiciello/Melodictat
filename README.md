# Melodictat - melodic dictation web app

## Introduction
Melodictat is a web app I created to make my melodic dictation learning journey easier. I wanted to keep things simple but also have a UI that looks like a piano keyboard, because it's the instrument I'm most familiar with.

This app works best for basic melodic dictation needs: the available note range spans from C3 to C6; the melody can be made up of 2 to 10 notes, each one within one octave from the root note, and all notes have the same duration.

## Usage
Before starting a melodic dictation session, you should configure the options at the bottom of the page to suit their needs. The following options are available.
- Root note: if a random root note is chosen, the root note of the melody will change randomly each exercise; if a specific root note is selected, a random harmonic of that note (within the available range) will be selected.
- Number of notes in the melody: this can be any number from 2 to 10.
- Notes to include in the exercise: you can select which intervals, in addition to the root note, will be included in the melody. All intervals from m2 to P8 are available.
- Tempo: a slower tempo (60 bmp), a medium tempo (80 bpm) and a faster tempo (120 bpm) are available.
- Highlight possible notes: if checked, this option will highlight on the keyboard the possible notes that can be found in the melody.
- Show first note of the melody: if checked, this option will highlight the starting note in the current melody.

When you clicks *START*, a random melody reflecting the selected options is generated and played, and the keyboard automatically scrolls to a position where all possible notes for the current melody are visible.

You can then click notes on the keyboard to reproduce the melody, and these notes will be recorded in the pink boxes.

At any point, you can choose to listen again to the melody, play back the answer that was inputed or stop any replay using the buttons above the boxes. You can also delete a note they entered with the *delete* button.

When you are satisfied with your answer, you can click *CONFIRM* and a message will appear below the boxes, telling whether or not the answer is correct. If you cannot guess the correct answer, you can click *reveal answer*, which will make the correct melody appear in the boxes.

To start a new exercise with the same options as the previous one, you can click *NEXT*, and a new melody will be generated. If you wish to chenge the options, you can do so and then click *START* to start a new session. If either *START* or *NEXT* are clicked before the correct answer is guessed or revealed, a popup will appear to warn you.
