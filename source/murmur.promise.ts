import Murmur from "./murmur.core"
import { MurmurPromiseType } from "./murmur.type"
export class MurmurPromise {
    public success: Array<(murmur: Murmur) => void> = []
    public status: number = MurmurPromiseType.PENDING
    public murmur:Murmur
    public resolveNotify:boolean=false;
    constructor(public name) { }
    then(fn) {
        this.success.push(fn);
        if(this.status===MurmurPromiseType.RESOLVED){
            fn.call(this,this.murmur)
        };
        return this
    }
    resolve(murmur: Murmur) {
        this.status=MurmurPromiseType.RESOLVED;
        this.murmur=murmur;
        for (let success of this.success) {
            success(murmur)
        }
    }
}