export let MurmurRegexType = {
    TEXTNODE: 'TEXTNODE',
    NODESTART: 'NODESTART',
    NODEEND: 'NODEEND',
    NODECLOSESELF: 'NODECLOSESELF'
}

export enum MurmurFieldType { ATTR, TEXT }

export let MurmurDirectiveTypes = {
    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
    "mm-if": { name: "mm-if", directive: "IfDirective" }
}

export enum MurmurConnectTypes { "DOM", "DIRECTIVE" }

export enum MurmurEventTypes { "mm-click" }

export enum MurmurPromiseType { 'PENDING', 'RESOLVED', 'REJECTED' }