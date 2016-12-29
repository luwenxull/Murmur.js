"use strict";
exports.MurmurRegexType = {
    TEXTNODE: 'TEXTNODE',
    NODESTART: 'NODESTART',
    NODEEND: 'NODEEND',
    NODECLOSESELF: 'NODECLOSESELF'
};
exports.MurmurFieldType = {
    ATTR: 'ATTR',
    TEXT: 'TEXT'
};
exports.MurmurDirectiveTypes = [
    'mm-repeat', 'mm-if'
];
exports.MurmurDirectiveTypesMap = {
    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
    "mm-if": { name: "mm-if", directive: "IfDirective" }
};
var MurmurConnectTypes;
(function (MurmurConnectTypes) {
    MurmurConnectTypes[MurmurConnectTypes["DOM"] = 0] = "DOM";
    MurmurConnectTypes[MurmurConnectTypes["DIRECTIVE"] = 1] = "DIRECTIVE";
})(MurmurConnectTypes = exports.MurmurConnectTypes || (exports.MurmurConnectTypes = {}));
