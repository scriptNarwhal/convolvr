import Convolvr from "../../../world/world";
import { AnyObject } from "../../../util";
import { SystemDependency } from "../..";

export default class StorageDevice {
    public world: Convolvr;
    
    dependencies = [] as SystemDependency[]

    constructor (world: Convolvr ) {
        this.world = world
    } 
    
    public init(data: AnyObject) {
        return {
            
        }
    }
    
}