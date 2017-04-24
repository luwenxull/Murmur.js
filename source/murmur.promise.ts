import Murmur from "./murmur.core"
import { MurmurPromiseType } from "./murmur.type"
export class MurmurPromise {
    public success: Array<(murmur: Murmur) => void> = []
    public one:Array<(murmur: Murmur) => void>=[]
    public status: number = MurmurPromiseType.PENDING
    public murmur:Murmur
    public resolveNotify:boolean=false;
    private dependencies:MurmurPromise[]=[]
    private dependsBy:MurmurPromise[]=[]
    constructor(public name) { }
    then(fn) {
        this.success.push(fn);
        if(this.status===MurmurPromiseType.RESOLVED){
            fn.call(this,this.murmur)
        }
        return this
    }
    resolve() {
        this.status=MurmurPromiseType.RESOLVED;
        for (let success of this.success) {
            success(this.murmur)
        }
        for(let o of this.one){
            o(this.murmur)
        }
        this.one=[];//注册的回调函数只会执行一次
        for(let db of this.dependsBy){
            db.checkDependencies()
        }
    }
    depends(dep:MurmurPromise){
        this.dependencies.push(dep);
        dep.dependsBy.push(this)
    }
    checkDependencies(){
        let dependenciesResolved=true;
        for(let dependency of this.dependencies){
            if(dependency.status===MurmurPromiseType.PENDING){
                dependenciesResolved=false;
            }
        }
        if(dependenciesResolved){
            this.resolve()
        }
    }
    once(fn){
        if(this.status===MurmurPromiseType.RESOLVED){
            fn.call(this,this.murmur)
        }else{
            this.one.push(fn)
        }
        return this
    }
    render(loc,success){
        this.once(()=>{
            this.murmur.render(loc,success)
        })
    }
}