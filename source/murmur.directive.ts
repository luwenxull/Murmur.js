import Murmur from "./murmur.core"
import { removeAllSpace } from "./murmur.tool"
export interface MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: Node): Node
}

export class MurmurDirective {
    constructor(public directiveExpression: string) { }
}

export class RepeatDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: Node): Node {
        murmur.controlRepeatMMDState.inRepeat = true;
        let dExp = this.directiveExpression;
        let fragment = document.createDocumentFragment();
        if (model[dExp]) {
            for (let a of model[dExp]) {
                murmur.controlRepeatMMDState.repeatModel = a;
                fragment.appendChild(murmur.create(model))
            }
        }
        murmur.controlRepeatMMDState.inRepeat = false;
        return fragment
    }
}

export class IfDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: Node): Node {
        let dExp = this.directiveExpression;
        return murmur.extract(dExp) ? domGenerated : document.createDocumentFragment()
    }
}