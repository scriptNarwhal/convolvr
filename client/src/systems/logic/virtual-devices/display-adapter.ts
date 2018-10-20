import Convolvr from "../../../world/world";
import { VirtualDevice } from "../virtual-device";
import { AnyObject } from "../../../util";
import ProceduralMaterials from "../../core/material/material-procedural";
import { System } from "../..";

export default class DisplayAdapterDevice implements VirtualDevice, System {
    public world: Convolvr;
    private procedural: ProceduralMaterials
    public dependencies = [
        ["procedural", "material.procedural"]
    ];

    constructor(world: Convolvr) {
        this.world = world
    }

    init(data: AnyObject) {
        // create a canvas, save the context, etc
        // implement

        return {
            getOutput: () => {

            },
            clear: () => {

            }
        }

    }
    /**
     * 
     * textmode is probably the first thing this should do
     */


    /**
     * display-adapter needs a display device in the same machine
     * it also requires a virtual-machine attribute / device in the entity
     * 
     * ... feature => (component / attribute) dependencies?
     */


    configure(data: Object) {

        // implement 

    }

    // use material-procedural system here
    draw(type: string, data: Object) {

        switch (type) {
            case "text":
                this.renderText(data)
                break
            case "shape":
                this.renderShape(data)
                break
            case "shader":
                this.renderShader(data)
                break
            case "camera":
                this.renderCamera(data)
                break
            case "virtual-camera":
                this.renderVirtualCamera(data)
                break

        }

    }

    renderText(data: Object) {



    }

    renderShape(data: Object) {



    }

    renderShader(data: Object) {


    }

    renderCamera(data: Object) {


    }

    renderVirtualCamera(camera: Object) {


    }

}