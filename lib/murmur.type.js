"use strict";
exports.MurmurRegexType = {
    TEXTNODE: 'TEXTNODE',
    NODESTART: 'NODESTART',
    NODEEND: 'NODEEND',
    NODECLOSESELF: 'NODECLOSESELF'
};
var MurmurFieldType;
(function (MurmurFieldType) {
    MurmurFieldType[MurmurFieldType["ATTR"] = 0] = "ATTR";
    MurmurFieldType[MurmurFieldType["TEXT"] = 1] = "TEXT";
})(MurmurFieldType = exports.MurmurFieldType || (exports.MurmurFieldType = {}));
exports.MurmurDirectiveTypes = {
    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
    "mm-if": { name: "mm-if", directive: "IfDirective" }
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
