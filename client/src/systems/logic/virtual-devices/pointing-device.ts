import Convolvr from "../../../world/world";
import { AnyObject } from "../../../util";

export default class PointingDevice {
    private world: Convolvr;
    
    constructor (world: Convolvr ) {
        this.world = world
    } 
    
    public init(data: AnyObject) {
        return {
            
        }
    }
    
}