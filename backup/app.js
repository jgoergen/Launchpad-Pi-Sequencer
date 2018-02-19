
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

    // update display
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
