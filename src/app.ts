import * as fs from 'fs';
import { exec } from "child_process";
import NanoTimer from "nanotimer";

import defaults from "./defaults";
import keyboard from "./keyboard";
import sequencer from "./sequencer";
import display from "./display";
import midi from "./midi";
import gpio from "./gpio";

let settingsHeld: boolean = false;
let presetsHeld: boolean = false;

// translation arrays

let pads: Array<number> = defaults.pads.slice();
let trackPads: Array<number> = defaults.trackPads.slice();
let controlPads: Array<number> = defaults.controlPads.slice();

//presets

let presets = defaults.presets.slice();
let loadDisplay = defaults.loadDisplay.slice();
let saveDisplay = defaults.saveDisplay.slice();

// initialization

console.log("Initializing");
gpio.init(
    shutdown, 
    handleClockSwitch, 
    handleResetIn,
    handleClock);
midi.init(
    handleMidiNoteOn,
    handleMidiCCmessage);
display.init();
keyboard.init();
sequencer.init();

presets = loadPresets();
let timer = new NanoTimer();

function loadPresets():any {

    let fileData: any = 
        fs.readFileSync(
            __dirname + "/presets.json", 
            "utf8");

    return JSON.parse(fileData);
}

function shutdown() {

    console.log("Shutting down.");

    /*
    powerSwitch.unwatch();

    fs.writeFile(
        __dirname + '/midiConfig.json', 
        JSON.stringify(midiOutNotes), 
        function(err) {
            
            if (err) {
                console.log(err);
        }

        console.log('midi settings saved');
        fs.writeFile(
            __dirname + '/presets.json', 
            JSON.stringify(presets), 
            function(err) {
                
                if (err) {
                    console.log(err);
                }

                console.log('presets saved');
                console.log('shutting down system');
                exec(
                    '/sbin/shutdown -h now', 
                    function(error, stdout, stderr) {

                        console.log('stdout: ' + stdout);
                        console.log('stderr: ' + stderr);
                        
                        if (error !== null) {
                            console.log('exec error: ' + error);
                        }
                    });
            });
    });
    */
}

function handleClockSwitch(err, value) {
  
    /*
    if (err) {
    
        console.log(err);
    }
  
    seq.clockSource = value === 0 ? 'external' : 'internal';
  
    if (seq.clockSource === 'external') {
    
        if (seq.timerRunning) {
      
            timer.clearInterval();
            seq.timerRunning = false;
        }
    
        if (!seq.clockWathced) {
      
            
            seq.clockWathced = true;
        }
  
    } else {
    
        if (seq.clockWathced) {
      
            
            seq.clockWathced = false;
        }
    
        if (seq.running && !seq.timerRunning) {
      
            let speed = 60000 / ((+seq.bpm / 10) * 4);
            speed += 'm';
            timer.setInterval(advanceSeq, '', speed);
            seq.timerRunning = true;
        }
    }*/
}

function handleResetIn(err, value) {
  
    /*
    if (err) {
    
        console.log(err);
    }
  
    seq.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
    updateDisplay();
    */
}

function handleMidiNoteOn(params: any): void {

    let note = params.note;
    let velocity = params.velocity;

    console.log("Note On : '" + note + "' : " + velocity);

    if (velocity === 127) {
    
        //track change buttons

        if (trackPads.indexOf(note) !== -1) {
    
            console.log("track button " + trackPads.indexOf(note));
            changeTrack(trackPads.indexOf(note));
            return;
        }

        //buttons in grid

        if (pads.indexOf(note) !== -1) {
        
            console.log("button on grid " + pads.indexOf(note));
            gridButtonPress(pads.indexOf(note));
        }
    }
}

function handleMidiCCmessage(params: any): void {

    let cc = params.controller;
    let value = params.value;
    console.log("CC change : '" + cc + "' : " + value);

    if (value === 127) {

        switch (cc) {
      
            case controlPads[0]: 

                // reset ?
                // seq.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
                break;

            case controlPads[1]: 

                // number of tracks viewed
                /*
                if (seq.tracksDisplayed > 7) {
                
                    seq.tracksDisplayed = 1;
                
                } else {
                
                    seq.tracksDisplayed = seq.tracksDisplayed * 2;
                }
                
                seq.scrollPage = 0;
                */
                break;

            case controlPads[2]:

                //scroll left
                /*
                seq.scrollPage--;
                seq.scrollPage = seq.scrollPage < 0 ? seq.tracksDisplayed - 1 : seq.scrollPage;
                */
                break;

            case controlPads[3]:

                //scroll right
                /*
                seq.scrollPage++;
                seq.scrollPage = seq.scrollPage >= seq.tracksDisplayed ? 0 : seq.scrollPage;
                */
                break;

            case controlPads[4]:
            
                //start stop
                /*
                if (seq.clockSource === 'internal') {

                    if (!seq.running) {

                        let speed = 60000 / ((+seq.bpm / 10) * 4);
                        speed += 'm';
                        seq.running = true;

                        if (!seq.timerRunning) {
                            timer.setInterval(advanceSeq, '', speed);
                            seq.timerRunning = true;
                        }

                    } else {
                        
                        if (seq.timerRunning) {
                            timer.clearInterval();
                            seq.timerRunning = false;
                        }

                        seq.running = false;
                    }

                } else {
                
                    seq.running = !seq.running;
                }
                */
                break;

            case controlPads[5]:
                
                //bpm tapped and midi setup if held
                /*
                if (seq.mode === 'bpm' || seq.mode === 'midi') {

                    if (seq.mode === 'midi') {
                    
                        fs.writeFile(
                            __dirname + '/midiConfig.json', 
                            JSON.stringify(midiOutNotes), 
                            function(err) {
                            
                                if (err) {
                            
                                    console.log(err);
                                    return;
                                }
                            });
                    }

                    seq.mode = 'step';
                
                } else {
                
                    seq.mode = 'bpm';
                }
                
                seq.settingsHeld = Date.now();
                */
                break;
            
            case controlPads[6]:
            
                //last step
                //seq.mode = seq.mode !== 'lastStep' ? 'lastStep' : 'step';
                break;

            case controlPads[7]:
            
                //presets load tapped and save held
                /*
                if (seq.mode === 'presetLoad' || seq.mode === 'presetSave') {
                
                    seq.mode = 'step';
                
                } else {
                
                    seq.mode = 'presetLoad';
                }
                
                seq.presetsHeld = Date.now();
                */
                break;
        }

    } else if (value === 0) {

        /*
        if (cc === controlPads[5] && seq.settingsHeld !== 0) {
      
            if (Date.now() > seq.settingsHeld + 1000) {//midi setup held 1 second
                
                seq.mode = 'midi';
            }

        seq.settingsHeld = 0;
    
        } else if (cc === controlPads[7] && seq.presetsHeld !== 0) {
        
            if (Date.now() > seq.presetsHeld + 1000) {
            
                seq.mode = 'presetSave';
            }
            
            seq.presetsHeld = 0;
        }
        */
    }
}

function changeTrack(trackIndex: number) {

    //seq.displayTrack = trackIndex;
    //updateDisplay();
}

function gridButtonPress(button: number) {

    /*
    if (pads.indexOf(note) !== -1) {

            let pad = undefined;
            let preset = undefined;

            switch (seq.mode) {
        
                case 'step':

                    console.log("Seq in step mode, getting pad for note " + note);
                    console.log("Pad is " + pads.indexOf(note));
                    
                    pad = pads.indexOf(note);
                    let arr = displayArr();
                    let trackStep = arr[pad];
                    trackStep = trackStep.split('|');
                    let track = trackStep[0];
                    let step = trackStep[1];
                    seq.tracks[track][step] = !seq.tracks[track][step];
                    break;
        
                case 'bpm':
          
                    pad = pads.indexOf(note);

                    for (let i = 0; i < 4; i++) {

                        let arr = verticalBar(i);
                        let index = arr.indexOf(pad);

                        if (index !== -1 && index < 10) {

                            let speed = seq.bpm.split('');
                            speed[i] = index;
                            speed = speed.join('');

                            if (+speed !== 0) {

                                seq.bpm = speed;
                            }
                        }
                    }
                    break;

                case 'midi':

                    pad = pads.indexOf(note);
                    let notes = midiOutNotes[seq.displayTrack][1];
                    notes = notes.split('');

                    if (pad === 59) {

                        notes[0] = notes[0] === '0' ? '1' : '0';
                    }

                    for (let i = 0; i < 4; i++) {

                        if (i !== 1) {

                            let arr = verticalBar(i);
                            let index = arr.indexOf(pad);
                        }

                        if (i === 0 && index !== -1) {
                        
                            midiOutNotes[seq.displayTrack][0] = index;

                        } else if (i > 1 && index !== -1 && index < 10) {
                        
                            notes[i - 1] = index;
                        }
                    }

                    notes = notes.join('');

                    if (+note <= 127) {

                        midiOutNotes[seq.displayTrack][1] = note;
                    }
                    break;

                case 'presetLoad':

                    pad = pads.indexOf(note);
                    preset = presets[pad];
                    seq.tracks = preset.slice(0, 8);
                    seq.lastStep = preset[8];
                    break;

                case 'presetSave':

                    pad = pads.indexOf(note);
                    preset = [];

                    for (let i = 0; i < seq.tracks.length; i++) {
                        
                        preset.push(seq.tracks[i]);
                    }

                    preset.push(seq.lastStep);
                    presets[pad] = preset;
                    
                    if (!seq.presetWriting) {
                    
                        seq.presetWriting = true;
                        fs.writeFile(
                            __dirname + '/presets.json', 
                            JSON.stringify(presets), 
                            function(err) {
                    
                                if (err) {
                            
                                    console.log(err);
                                    return;
                                }
                            
                                console.log('preset saved');
                                seq.presetWriting = false;
                            });
                    
                    } else {
                    
                        console.log('already writing to preset file');
                    }
                    break;

                case 'lastStep':
                    seq.lastStep[seq.displayTrack] = pads.indexOf(note);
                    break;
            }
        }
        */
}

function fireExternalClock(): void {

    /*
        // pull low 

        gpio.clockOut.write(
            0,
            (err) => {

                if (err) {
                    console.log(err);
                }
            });

        // wait 5 milliseconds and pull high

        clockoutTimer.setTimeout(
            () => {
      
                gpio.clockOut.write(
                    1, 
                    (err) => {
            
                        if (err) {
                            console.log(err);
                        }
                    });
                }, 
                '', 
                '5m');
        */
}

function handleClock(err, value): void {
  
    if (err) {
    
        console.log(err);
        return;
    }

    console.log("Midi clock @ " + midi.bpm);
    
    // these only get updated once per beat
    
    keyboard.upate();
    sequencer.update();

    // trigger external clock if running internally

    if (midi.internalClock) {

        fireExternalClock();
    }
}

// main update loop. either triggered internally or externally

function update():void {

    // these potentially need to be updated faster then once per beat

    midi.update();
    display.update();
}

// start updates @ 30 fpx

timer.setInterval(
    update,
    '33m');