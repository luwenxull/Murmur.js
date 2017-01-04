export let MurmurNodeType = {
    TEXTNODE: 'TEXTNODE',
    COMMENTNODE:'COMMENTNODE'
}

export enum MurmurFieldType { ATTR, TEXT }

export let MurmurDirectiveTypes = {
    "mm-repeat": { name: "mm-repeat", directive: "RepeatDirective" },
    "mm-if": { name: "mm-if", directive: "IfDirective" },
    "mm-ref": { name: 'mm-ref', directive: 'RefDirective' },
    "mm-mount": { name: 'mm-mount', directive: 'MountDirective' }
}

export enum MurmurConnectTypes { "DOM", "DIRECTIVE" }

export enum MurmurEventTypes { "mm-click" }

export enum MurmurPromiseType { 'PENDING', 'RESOLVED', 'REJECTED' }