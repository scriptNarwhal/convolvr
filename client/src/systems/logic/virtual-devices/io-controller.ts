import { Component } from "react";
import Convolvr from "../../../world/world";
import { AnyObject } from "../../../util";

export default class IOControllerDevice {
    private world: Convolvr;
    
    constructor (world: Convolvr ) {
        this.world = world
    } 
    
    public init(data: AnyObject) {
        return {
            
        }
    }
    // implement

}