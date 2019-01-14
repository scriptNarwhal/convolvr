import { Component } from "react";
import Convolvr from "../../../world/world";
import { AnyObject } from "../../../util";
import { SystemDependency } from "../..";

export default class IOControllerDevice {
    public world: Convolvr;
    
    dependencies = [] as SystemDependency[]
    
    constructor (world: Convolvr ) {
        this.world = world
    } 
    
    /**
     * 
     * What does this do?
     * 
     * 
     * it allows reading and writing to GPIO ports
     * 
     * 
     */


    public init(data: AnyObject) {
        return {
            
        }
    }
    // implement

}