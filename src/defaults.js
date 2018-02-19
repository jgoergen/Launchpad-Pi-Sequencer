"use strict";
// 64 empty notes
exports.__esModule = true;
var generateEmptyTrackData = function () {
    var result = [];
    for (var i = 0; i < 64; i++) {
        result.push(false);
    }
    return result;
};
// 8 empty tracks
var generateEmptyPresetData = function () {
    var result = [
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        generateEmptyTrackData(),
        [63, 63, 63, 63, 63, 63, 63, 63]
    ];
    return result;
};
// 64 empty preset objects
var generateEmptyPresetsData = function () {
    var result = [];
    for (var i = 0; i < 64; i++) {
        result.push(generateEmptyPresetData());
    }
    return result;
};
var defaults = {
    midiDeviceName: "Launchpad",
    dark: 0,
    darkRunner: 1,
    brightRunner: 3,
    trackColors: [
        [47, 45],
        [121, 5],
        [59, 57],
        [127, 9],
        [123, 21],
        [55, 53],
        [125, 13],
        [35, 33]
    ],
    midiOutNotes: [
        [0, "036"],
        [0, "038"],
        [0, "043"],
        [0, "050"],
        [0, "042"],
        [0, "046"],
        [0, "039"],
        [0, "049"]
    ],
    channel: 0,
    loadDisplay: [
        true, false, false, false, true, true, true, true, true, false, false, false, true, false, false,
        true, true, false, false, false, true, false, false, true, true, true, true, true, true, true, true,
        true, false, true, true, false, true, true, true, false, true, false, false, true, true, false,
        false, true, true, true, true, true, true, false, false, true, true, false, false, true, true, true, true, false
    ],
    saveDisplay: [
        false, true, true, true, false, true, true, false, true, false, false, false, true, false, false,
        true, false, true, true, true, true, true, true, true, true, true, true, true, true, false, false,
        true, true, false, false, true, true, true, true, true, true, false, false, true, true, false, false,
        true, true, false, false, true, true, true, true, false, false, true, true, false, true, true, true, true
    ],
    pads: [
        0, 1, 2, 3, 4, 5, 6, 7,
        16, 17, 18, 19, 20, 21, 22, 23,
        32, 33, 34, 35, 36, 37, 38, 39,
        48, 49, 50, 51, 52, 53, 54, 55,
        64, 65, 66, 67, 68, 69, 70, 71,
        80, 81, 82, 83, 84, 85, 86, 87,
        96, 97, 98, 99, 100, 101, 102, 103,
        112, 113, 114, 115, 116, 117, 118, 119
    ],
    trackPads: [8, 24, 40, 56, 72, 88, 104, 120],
    controlPads: [104, 105, 106, 107, 108, 109, 110, 111],
    emptyTrackData: generateEmptyTrackData(),
    presets: [
        generateEmptyPresetsData()
    ]
};
exports["default"] = defaults;
