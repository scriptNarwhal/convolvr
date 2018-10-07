import { Component } from "react";
import Convolvr from "../../../world/world";
import { VirtualDevice } from "../virtual-device";
import { AnyObject } from "../../../util";
import ProceduralMaterials from "../../core/material/material-procedural";
import { DependencyInjector } from '../../util'

export default class DisplayAdapterDevice implements VirtualDevice {
    private world: Convolvr;
    private procedural: ProceduralMaterials
    private dependencies = new DependencyInjector([
        ["procedural", "material.procedural"]
    ]);

    constructor(world: Convolvr) {
        this.world = world
    }

    init(data: AnyObject) {
        this.dependencies.inject(this); // lazy dependency inject.

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
     * display-adapter needs a display device in the same machine
     * it also requires a virtual-machine attribute / device in the entity
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