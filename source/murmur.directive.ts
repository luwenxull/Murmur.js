import Murmur from "./murmur.core"
import { removeAllSpace } from "./murmur.tool"
class MurmurDirective {
    constructor(public directiveExpression: string) { }
}

export class RepeatDirective extends MurmurDirective {
    compile(model, murmur: Murmur) {
        let dExp = this.directiveExpression;
        let t = dExp.split('in');
        let loopName = removeAllSpace(t[0]),
            loopArray = removeAllSpace(t[1]);
        for (let a in model[loopArray]){
            console.log( murmur.create(a));
        }
    }
}

// export let repeat=