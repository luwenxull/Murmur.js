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
        murmur.repeatMMDState.inRepeat=true;
        let dExp = this.directiveExpression;
        let fragment = document.createDocumentFragment();
        if (model[dExp]) {
            for (let a of model[dExp]) {
                murmur.repeatMMDState.repeatModel=a;
                fragment.appendChild(murmur.create(model))
            }
        }
        murmur.repeatMMDState.inRepeat=false;
        return fragment
    }
}

export class IfDirective extends MurmurDirective implements MurmurDirectiveItf {
    compile(model, murmur: Murmur, domGenerated: HTMLElement): Node {
        let dExp = this.directiveExpression;
        if(!murmur.extract(dExp)){
            domGenerated.setAttribute('data-delete','1')
        }
        return domGenerated
    }
}