"use strict";
exports.MurmurNodeType = {
    TEXTNODE: 'TEXTNODE',
    COMMENTNODE: 'COMMENTNODE'
};
var MurmurFieldType;
(function (MurmurFieldType) {
    MurmurFieldType[MurmurFieldType["ATTR"] = 0] = "ATTR";
    MurmurFieldType[MurmurFieldType["TEXT"] = 1] = "TEXT";
})(MurmurFieldType = exports.MurmurFieldType || (exports.MurmurFieldType = {}));
exports.MurmurDirectiveTypes = {
    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
    "mm-if": { name: "mm-if", directive: "IfDirective" },
    "mm-ref": { name: 'mm-ref', directive: 'RefDirective' },
    "mm-mount": { name: 'mm-mount', directive: 'MountDirective' },
    "mm-show": { name: "mm-show", directive: 'ShowDirective' }
};
var MurmurConnectTypes;
(function (MurmurConnectTypes) {
    MurmurConnectTypes[MurmurConnectTypes["DOM"] = 0] = "DOM";
    MurmurConnectTypes[MurmurConnectTypes["DIRECTIVE"] = 1] = "DIRECTIVE";
})(MurmurConnectTypes = exports.MurmurConnectTypes || (exports.MurmurConnectTypes = {}));
var MurmurEventTypes;
(function (MurmurEventTypes) {
    MurmurEventTypes[MurmurEventTypes["mm-click"] = 0] = "mm-click";
})(MurmurEventTypes = exports.MurmurEventTypes || (exports.MurmurEventTypes = {}));
var MurmurPromiseType;
(function (MurmurPromiseType) {
    MurmurPromiseType[MurmurPromiseType["PENDING"] = 0] = "PENDING";
    MurmurPromiseType[MurmurPromiseType["RESOLVED"] = 1] = "RESOLVED";
    MurmurPromiseType[MurmurPromiseType["REJECTED"] = 2] = "REJECTED";
})(MurmurPromiseType = exports.MurmurPromiseType || (exports.MurmurPromiseType = {}));
