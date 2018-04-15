import Convolvr from "../../world/world";
import Component from "../../core/component";

export default class BrowserSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 
        
        let attr = component.attrs.browser

        switch ( attr.type ) {

            case "files":

            break
            case "directories":


            case "text":

            break
            case "html":

            break
            case "images":

            break
            case "video":

            break
            case "audio":

            break
            case "entities":

            break
            case "components":

            break
            case "attrs":

            break
            case "users":

            break
            case "spaces":

            break
            case "places":

            break
        }

        return {
            navigate: (url: string) => {
                this.navigate( component, url )
            },
            upOneLevel: (url: string) => {
                this.upOneLevel( component )
            },
            back: (url: string) => {
                this.back( component )
            },
            forward: (url: string) => {
                this.forward( component )
            },
            refresh: (url: string) => {
                this.refresh( component )
            },
            type: attr.type
        }
    }

    upOneLevel ( component: Component ) {

    }

    navigate ( component: Component, url: string ) {

    }

    back ( component: Component ) {

    }

    forward ( component: Component ) {


    }
    
    refresh ( component: Component ) {


    }

    // implement
}