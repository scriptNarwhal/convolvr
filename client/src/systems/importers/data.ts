/** TODO: implement */
import { System } from '../index'
import Component from '../../model/component';
import Convolvr from '../../world/world';
export default class ImportDataSystem implements System {
    world: Convolvr
    dependencies = [["file"], ["rest"]]; 

    constructor(world: Convolvr) {
        this.world = world;
    }

    //TODO: parse csv or json into memory ... 
    // maybe it's in a file, maybe a network request, maybe an entity in the scene

    init(component: Component) {
         
        return {
            
        }
    }

}