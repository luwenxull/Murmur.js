import Murmur from "./murmur.core"
import { MurmurPromiseType } from "./murmur.type"
export class MurmurPromise {
    public success: Array<(murmur: Murmur) => void> = []
    public status: number = MurmurPromiseType.PENDING
    private murmur:Murmur
    constructor() { }
    then(fn) {
        this.success.push(fn);
        if(this.status===MurmurPromiseType.RESOLVED){
            fn(this.murmur)
        }
    }
    resolve(murmur: Murmur) {
        this.status=MurmurPromiseType.RESOLVED;
        this.murmur=murmur;
        for (let success of this.success) {
            success(murmur)
        }
    }
}