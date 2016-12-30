import { MurmurFieldType } from "./murmur.type"
import Murmur from "./murmur.core"
export default class MurmurField {
    constructor(public value: string, public expression: string, public type: string, public unit) { }
    dispatchSync(murmur: Murmur) {
        switch (this.type) {
            case MurmurFieldType.TEXT: {
                this.doSyncText(murmur);
                break;
            }
            default: {
                this.doSyncAttr(murmur);
            }
        }
    }
    doSyncText(murmur: Murmur) {
        this.unit.textContent = murmur.evalExpression(this.expression, this.unit, MurmurFieldType.TEXT)
    }
    doSyncAttr(murmur: Murmur) {
        this.unit.value = murmur.evalExpression(this.expression, this.unit, MurmurFieldType.ATTR)
    }
}