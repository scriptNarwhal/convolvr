import Convolvr from "../../../world/world";
import { AnyObject } from "../../../util";
import { SystemDependency } from "../..";
import { VirtualDevice } from "../virtual-device";

export default class KeyboardDevice implements VirtualDevice {
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