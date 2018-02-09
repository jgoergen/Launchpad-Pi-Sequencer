const fs = require('fs');
const exec = require('child_process').exec;
const easymidi = require('easymidi');
const NanoTimer = require('nanotimer');
const GPIO = require('onoff').Gpio;

const defaults = require('./defaults.js');

//settings
//colors

let dark = defaults.dark;
let darkRunner = defaults.darkRunner;
let brightRunner = defaults.brightRunner;
let trackColors = defaults.trackColors.slice();

//midi

let channel = defaults.channel;
let midiOutNotes = defaults.midiOutNotes.slice();

//presets

let presets = defaults.presets.slice();
let loadDisplay = defaults.loadDisplay.slice();
let saveDisplay = defaults.saveDisplay.slice();

//translation arrays

let pads = defaults.pads.slice();
let trackPads = defaults.trackPads.slice();
let controlPads = defaults.controlPads.slice();

//state object
let seq = {
    running: false,
    clockWathced: false,
    timerRunning: false,
    toggle: true,
    settingsHeld: 0,
    presetsHeld: 0,
    presetWriting: false,
    bpm: '1200',
    mode: 'step',
    clockSource: 'internal',
    tracksDisplayed: 1,
    scrollPage: 0,
    displayTrack: 0,
    curStep: [-1, -1, -1, -1, -1, -1, -1, -1],
    lastStep: [63, 63, 63, 63, 63, 63, 63, 63],
    tracks: [
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice(),
        defaults.emptyTrackData.slice()
    ]
};

//display object
let lastDisplay = {
  pads: [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
  tracks: [-1, -1, -1, -1, -1, -1, -1, -1],
  controls: [-1, -1, -1, -1, -1, -1, -1, -1]
};
let nextDisplay = {
  pads: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  tracks: [0, 0, 0, 0, 0, 0, 0, 0],
  controls: [0, 0, 0, 0, 0, 0, 0, 0]
};

//autoconfigure midi inputs and outputs
let inputs = easymidi.getInputs();
let outputs = easymidi.getOutputs();
let input = setupMidiIn('Launchpad', inputs);
let output = setupMidiOut('Launchpad', outputs);
let midiOut = makeMidiOutput(outputs);

//configure GPIO pins
console.log("Configuring GPIO Pins");
let outputPins = [18, 4, 17, 23, 25, 5, 13, 21];
let triggerGPIO = outputPins.map(function(pin) {
  return new GPIO(pin, 'out');
});
let clockOut = new GPIO(27, 'out');
let clockIn = new GPIO(24, 'in', 'falling');
let clockSwitch = new GPIO(6, 'in', 'both');
let resetIn = new GPIO(16, 'in', 'falling');
let powerSwitch = new GPIO(20, 'in', 'rising');
triggerGPIO.forEach(function(pin) {
  pin.write(1, function(err) {
    if (err) {
      console.log(err);
    }
  });
});
clockOut.write(1, function(err) {
  if (err) {
    console.log(err);
  }
});

//initialization
console.log("Initializing");
updateDisplay();
let fileData = fs.readFileSync(__dirname + '/midiConfig.json', 'utf8');
midiOutNotes = JSON.parse(fileData);
fileData = fs.readFileSync(__dirname + '/presets.json', 'utf8');
presets = JSON.parse(fileData);
let timer = new NanoTimer();
powerSwitch.watch(shutdown);
clockSwitch.read(handleClockSwitch);
clockSwitch.watch(handleClockSwitch);
resetIn.watch(handleResetIn);

//handle button pushes
input.on('noteon', function(params) {
    
    console.log("Note on '" + params.note + "'");
    handleNoteIn(params.note, params.velocity);
});

input.on('cc', function(params) {

    console.log("CC '" + params.controller + "'");
    handleCcIn(params.controller, params.value);
});

//functions
function setupMidiIn(device, inputs) {

    console.log("Setting up Midi In");

    let arr = inputs.filter(
        function(input) {

            return (input.indexOf(device) === 0);
        });

    if (arr.length > 0) {

        return new easymidi.Input(arr[0]);
    } else {
    
        console.log('no midi input with device name: ' + device);
    }
}

function setupMidiOut(device, outputs) {

    console.log("Setting up Midi Out");

    let arr = outputs.filter(
        function(output) {

            return (output.indexOf(device) === 0);
        });

    if (arr.length > 0) {
        
        return new easymidi.Output(arr[0]);
    } else {
    
        console.log('no midi output with device name: ' + device);
    }
}

function makeMidiOutput(outputs) {

    let arr = outputs.filter(function(output) {

        return (output.indexOf('Launchpad') !== 0);
    });

    if (arr.length > 0) {
        
        console.log('midi output to device: ' + arr[arr.length - 1]);
        return new easymidi.Output(arr[arr.length - 1]);
    
    } else {
    
        console.log('no non launchpad midi devices connected');
    }
}

function handleNoteIn(note, velocity) {

    let pad = undefined;
    let preset = undefined;

    console.log("Handle Note In '" + note + ", " + velocity);

    if (velocity === 127) {
    
        //track change buttons

        if (trackPads.indexOf(note) !== -1) {
            

            seq.displayTrack = trackPads.indexOf(note);
            updateDisplay();
            return;
        }

        //buttons in grid

        if (pads.indexOf(note) !== -1) {
      
            console.log("button on grid " + pads.indexOf(note));

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
                    let note = midiOutNotes[seq.displayTrack][1];
                    note = note.split('');

                    if (pad === 59) {

                        note[0] = note[0] === '0' ? '1' : '0';
                    }

                    for (let i = 0; i < 4; i++) {

                        if (i !== 1) {

                            let arr = verticalBar(i);
                            let index = arr.indexOf(pad);
                        }

                        if (i === 0 && index !== -1) {
                        
                            midiOutNotes[seq.displayTrack][0] = index;

                        } else if (i > 1 && index !== -1 && index < 10) {
                        
                            note[i - 1] = index;
                        }
                    }

                    note = note.join('');

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

        updateDisplay();
    }
}

function handleCcIn(cc, value) {

    if (value === 127) {
        
        switch (cc) {
      
            case controlPads[0]://reset
                seq.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
                break;

            case controlPads[1]://number of tracks viewed

                if (seq.tracksDisplayed > 7) {
                
                    seq.tracksDisplayed = 1;
                
                } else {
                
                    seq.tracksDisplayed = seq.tracksDisplayed * 2;
                }
                
                seq.scrollPage = 0;
                break;

            case controlPads[2]://scroll left
                
                seq.scrollPage--;
                seq.scrollPage = seq.scrollPage < 0 ? seq.tracksDisplayed - 1 : seq.scrollPage;
                break;

            case controlPads[3]://scroll right
                
                seq.scrollPage++;
                seq.scrollPage = seq.scrollPage >= seq.tracksDisplayed ? 0 : seq.scrollPage;
                break;
      
            case controlPads[4]://start stop

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
                break;

            case controlPads[5]://bpm tapped and midi setup if held

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
                break;

            case controlPads[6]://last step

                seq.mode = seq.mode !== 'lastStep' ? 'lastStep' : 'step';
                break;

            case controlPads[7]://presets load tapped and save held

                if (seq.mode === 'presetLoad' || seq.mode === 'presetSave') {
                
                    seq.mode = 'step';
                
                } else {
                
                    seq.mode = 'presetLoad';
                }
                
                seq.presetsHeld = Date.now();
                break;
        }

    } else if (value === 0) {

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
    }

    updateDisplay();
}

function advanceSeq() {

    if (seq.running) {
    
        let triggersToSend = [];
    
        for (let i = 0; i < 8; i++) {
    
            seq.curStep[i] = seq.curStep[i] >= seq.lastStep[i] ? 0 : seq.curStep[i] + 1;
      
            if (seq.tracks[i][seq.curStep[i]]) {
      
                triggersToSend.push(i);
            }
        }

        clockOut.write(
            0, 
            function(err) {
      
                if (err) {
                    console.log(err);
                }
            });

        for (let i = 0; i < triggersToSend.length; i++) {
      
            triggerGPIO[triggersToSend[i]].write(
                0, 
                function(err) {
                
                    if (err) {
                        console.log(err);
                    }
                });
        }

        timer.setTimeout(
            function() {
      
                clockOut.write(
                    1, 
                    function(err) {
            
                        if (err) {
                            console.log(err);
                        }
                    });

                for (let i = 0; i < triggersToSend.length; i++) {
                
                    triggerGPIO[triggersToSend[i]].write(
                        1, 
                        function(err) {
                
                            if (err) {
                                
                                console.log(err);
                            }
                        });
                }

        }, 
        '', 
        '5m');

        for (let i = 0; i < triggersToSend.length; i++) {
      
            if (midiOut !== undefined) {
        
                midiOut.send(
                    'noteon', 
                    {
                        note: +midiOutNotes[triggersToSend[i]][1],
                        velocity: 127,
                        channel: midiOutNotes[triggersToSend[i]][0]
                    });
            }
        }

        seq.toggle = !seq.toggle;
    }
  
    updateDisplay();
}

function changePad(pad, color) {
    
    //could change to take channel as argument
    output.send(
        'noteon', 
        {
            note: pad,
            velocity: color,
            channel: channel
        });
}

function changeControl(pad, color) {

    output.send(
        'cc', 
        {
            controller: pad,
            value: color,
            channel: channel
        });
}

function updateDisplay() {

    switch (seq.mode) {
        
        case 'step':
      
            let arr = displayArr();
      
            for (let i = 0; i < 64; i++) {

                let step = arr[i];
                step = step.split('|');
                let track = +step[0];
                let stepNum = +step[1];
                let selected = seq.tracks[track][stepNum];
                let color;
                let dimColor = dark;

                if (seq.tracksDisplayed === 1) {

                    nextDisplay.controls[2] = dark;
                    nextDisplay.controls[3] = dark;
                
                } else {
                
                    dimColor = trackColors[track][0];
                
                    if (seq.scrollPage === 0) {

                        nextDisplay.controls[2] = dark;
                        nextDisplay.controls[3] = trackColors[0][1];

                    } else if (seq.scrollPage === seq.tracksDisplayed - 1){
                        
                        nextDisplay.controls[2] = trackColors[seq.scrollPage][1];
                        nextDisplay.controls[3] = dark;
                    
                    } else {
                    
                        nextDisplay.controls[2] = trackColors[seq.scrollPage][1];
                        nextDisplay.controls[3] = trackColors[seq.scrollPage][1];
                    }
                }

                if (stepNum === seq.curStep[track]) {
                
                    color = selected ? brightRunner : darkRunner;
                
                } else {
                
                    color = selected ? trackColors[track][1] : dimColor;
                }
                
                nextDisplay.pads[i] = color;
            }

            nextDisplay.controls[5] = dark;
            nextDisplay.controls[6] = dark;
            nextDisplay.controls[7] = dark;
            break;

        case 'bpm':

            let speed = seq.bpm.split('');
            
            for (let i = 0; i < 4; i++) {
            
                digitFader(i, +speed[i]);
            }
            
            nextDisplay.controls[5] = brightRunner;
            nextDisplay.controls[6] = dark;
            nextDisplay.controls[7] = dark;
            break;

        case 'midi':
      
            let note = midiOutNotes[seq.displayTrack][1];
            note = note.split('');

            for (let i = 0; i < 2; i++) {
        
                let color = dark;
                let arr = verticalBar(i);
                
                for (let j = 0; j < 16; j++) {
          
                    if (i === 0) {
            
                        color = brightRunner;
                        
                        if (j === midiOutNotes[seq.displayTrack][0]) {
                
                            color = trackColors[i][1];
                        }
                    } else {
            
                        let hundredsColor = darkRunner;
                        
                        if (note[0] === '1') {
              
                            hundredsColor = trackColors[1][1];
                        }
            
                        nextDisplay.pads[59] = hundredsColor;
                    }

                nextDisplay.pads[arr[j]] = color;
                }
            }

            digitFader(2, +note[1]);
            digitFader(3, +note[2]);
            nextDisplay.controls[5] = brightRunner;
            nextDisplay.controls[6] = dark;
            nextDisplay.controls[7] = dark;
            break;

        case 'presetLoad':
      
            for (let i = 0; i < 64; i++) {
        
                let color = loadDisplay[i] ? brightRunner : dark;
                nextDisplay.pads[i] = color;
            }

            nextDisplay.controls[5] = dark;
            nextDisplay.controls[6] = dark;
            nextDisplay.controls[7] = brightRunner;
            break;

        case 'presetSave':
      
            for (let i = 0; i < 64; i++) {
        
                let color = saveDisplay[i] ? brightRunner : dark;
                nextDisplay.pads[i] = color;
            }

            nextDisplay.controls[5] = dark;
            nextDisplay.controls[6] = dark;
            nextDisplay.controls[7] = darkRunner;
            break;

        case 'lastStep':
      
            for (let i = 0; i < 64; i++) {
        
                let color = trackColors[seq.displayTrack][1];
        
                if (i === seq.curStep[seq.displayTrack]) {
          
                    color = brightRunner;
                
                } else if (i > seq.lastStep[seq.displayTrack]) {
          
                    color = trackColors[seq.displayTrack][0];
                }

                nextDisplay.pads[i] = color;
            }

            nextDisplay.controls[5] = dark;
            nextDisplay.controls[6] = brightRunner;
            nextDisplay.controls[7] = dark;
            break;
    }

    //tracks
  
    for (let j = 0; j < 8; j++) {
    
        let trackColor = trackColors[j][0];
    
        if (j === seq.displayTrack) {
    
            trackColor = trackColors[j][1];
        }
  
        nextDisplay.tracks[j] = trackColor
    }

    //toggle flash
  
    if (seq.toggle || !seq.running) {
  
        nextDisplay.controls[4] = brightRunner;
  
    } else {
  
        nextDisplay.controls[4] = dark;
    }

    for (let i = 0; i < nextDisplay.pads.length; i++) {
    
        if (lastDisplay.pads[i] !== nextDisplay.pads[i]) {
    
            changePad(pads[i], nextDisplay.pads[i]);
            lastDisplay.pads[i] = nextDisplay.pads[i];
        }
    }

    for (let i = 0; i < nextDisplay.tracks.length; i++) {
    
        if (lastDisplay.tracks[i] !== nextDisplay.tracks[i]) {
      
            changePad(trackPads[i], nextDisplay.tracks[i]);
            lastDisplay.tracks[i] = nextDisplay.tracks[i];
        }
    }

    for (let i = 0; i < nextDisplay.controls.length; i++) {
    
        if (lastDisplay.controls[i] !== nextDisplay.controls[i]) {
      
            changeControl(controlPads[i], nextDisplay.controls[i]);
            lastDisplay.controls[i] = nextDisplay.controls[i];
        }
    }
}

function verticalBar(row) {
  
    let base = row * 2;
    return [base + 56, base + 48, base + 40, base + 32, base + 24, base + 16, base + 8, base, base + 57, base + 49, base + 41, base + 33, base + 25, base + 17, base + 9, base + 1];
}

function digitFader(row, num) {
  
    let arr = verticalBar(row);
  
    for (let i = 0; i < 16; i++) {
  
        let color = darkRunner;
    
        if (i === 0) {
    
            color = brightRunner;
    
        } else if (num + 1 > i) {
    
            color = trackColors[row][1];
    
        } else if (i > 9) {
    
            color = dark;
        }
        
        nextDisplay.pads[arr[i]] = color;
    }
}

function displayArr() {

    let track = seq.displayTrack;
    let page = seq.scrollPage;
    let arr = [];

    let track1 = 0;
    let track2 = 0;
    let track3 = 0;
    let track4 = 0;
  
    switch(seq.tracksDisplayed) {
    
        case 1:
      
            for (let i = 0; i < 64; i++) {
            
                arr.push(track + '|' + i);
            }
            break;
    
        case 2:
      
            track1 = track < 7 ? track : 6;
            track2 = track1 + 1;
      
            for (let i = 0; i < 64; i++) {
        
                let item = '';
        
                if (i < 32) {
          
                    item = track1 + '|' + (i + (page * 32));
                
                } else {
          
                    item = track2 + '|' + (i - 32 + (page * 32));
                }
        
                arr.push(item);
            }
            break;
    
        case 4:
      
            if (track < 4) {
            
                track1 = track;
        
            } else {
            
                track1 = 4;
            }

            track2 = track1 + 1;
            track3 = track1 + 2;
            track4 = track1 + 3;
        
            for (let i = 0; i < 64; i++) {
            
                let item = '';
            
                if (i < 16) {
            
                    item = track1 + '|' + (i + (page * 16));
            
                } else if (i < 32) {
            
                    item = track2 + '|' + (i - 16 + (page * 16));
            
                } else if (i < 48) {
            
                    item = track3 + '|' + (i - 32 + (page * 16));
            
                } else {
            
                    item = track4 + '|' + (i - 48 + (page * 16));
                }

                arr.push(item);
            }
        
            break;
    
        case 8:
      
            for (let i = 0; i < 64; i++) {
        
                let item = '';
        
                if (i < 8) {
          
                    item = '0|' + (i + (page * 8));
        
                } else if (i < 16) {
          
                    item = '1|' + (i - 8 + (page * 8));
        
                } else if (i < 24) {
          
                    item = '2|' + (i - 16 + (page * 8));
        
                } else if (i < 32) {
          
                    item = '3|' + (i - 24 + (page * 8));
        
                } else if (i < 40) {
          
                    item = '4|' + (i - 32 + (page * 8));
        
                } else if (i < 48) {
          
                    item = '5|' + (i - 40 + (page * 8));
        
                } else if (i < 56) {
          
                    item = '6|' + (i - 48 + (page * 8));
        
                } else {
          
                    item = '7|' + (i - 56 + (page * 8));
                }

                arr.push(item);
            }
            break;
    }
  
    return arr;
}

function handleClockSwitch(err, value) {
  
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
      
            clockIn.watch(handleClockIn);
            seq.clockWathced = true;
        }
  
    } else {
    
        if (seq.clockWathced) {
      
            clockIn.unwatch();
            seq.clockWathced = false;
        }
    
        if (seq.running && !seq.timerRunning) {
      
            let speed = 60000 / ((+seq.bpm / 10) * 4);
            speed += 'm';
            timer.setInterval(advanceSeq, '', speed);
            seq.timerRunning = true;
        }
    }
}

function handleClockIn(err, value) {
  
    if (err) {
    
        console.log(err);
    }
  
    advanceSeq();
}

function handleResetIn(err, value) {
  
    if (err) {
    
        console.log(err);
    }
  
    seq.curStep = [-1, -1, -1, -1, -1, -1, -1, -1];
    updateDisplay();
}

function shutdown() {

    console.log("Shutting down.");

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
}
