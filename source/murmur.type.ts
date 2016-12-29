export let MurmurRegexType={
    TEXTNODE:'TEXTNODE',
    NODESTART:'NODESTART',
    NODEEND:'NODEEND',
    NODECLOSESELF:'NODECLOSESELF'
}

export let MurmurFieldType={
    ATTR:'ATTR',
    TEXT:'TEXT'
}

export let MurmurDirectiveTypes=[
    'mm-repeat','mm-if'
]

export let MurmurDirectiveTypesMap={
    "mm-repeat":{name:"mm-repeat",directive:"RepeatDirective"},
    "mm-if":{name:"mm-if",directive:"IfDirective"}
}

export enum MurmurConnectTypes {DOM,DIRECTIVE}