import { Component } from "react";
import Convolvr from "../../../world/world";
import { VirtualDevice } from "../virtual-device";
import { AnyObject } from "../../../util";

export default class DisplayAdapterDevice implements VirtualDevice {
    private world: Convolvr;

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