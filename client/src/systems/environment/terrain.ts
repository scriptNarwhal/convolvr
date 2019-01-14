// todo: implement
import { System, SystemDependency } from "../index"
import Component from "../../model/component";
import { AnyObject } from "../../util";
import Convolvr from "../../world/world";

export default class TerrainSystem implements System {

    world: Convolvr
    dependencies = [] as SystemDependency[]

    constructor ( world: Convolvr)  {
        this.world = world;
    }

    init = (component: Component) => {
        return {

        } as AnyObject;
    };   

    postInject?: () => void;
    tick?: (delta: number, time: number) => void;
    


    
}