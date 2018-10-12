import Convolvr from "../../world/world";
import Component from "../../core/component";
import { System } from "..";
import LayoutSystem from "./layout";
import TextSystem from "./text";
import ImportDataSystem from '../importers/data'
import { browser } from "../../core/attribute";

export default class BrowserSystem implements System {
    public world: Convolvr
    public dependencies = [["layout"],["text"], ["importData"]];

    private layout: LayoutSystem
    private text: TextSystem
    private importData: ImportDataSystem

    constructor ( world: Convolvr ) {
        this.world = world
    }

    postInject() {

    }

    init ( component: Component ) { 
        
        let attr: browser = component.attrs.browser

        switch ( attr.type ) {
            case "files":
                this.buildFileBrowser(false, attr, component)
            break;
            case "directories":
                this.buildFileBrowser(true, attr, component)
            case "text":
                this.buildTextViewer(attr, component)
            break;
            case "csv":
                this.buildCSVViewer(attr, component)
            break;
            case "json":
                this.buildJSONEditor(attr, component)
            case "js":
                this.buildTextViewer(attr, component)
            break;
            case "ecs":
                this.buildTextViewer(attr, component)
            break;
            case "html":
                this.buildHTMLViewer(attr, component)
            break;
            case "images":
                this.buildImageBrowser(attr, component)
            break;
            case "video":

            break;
            case "audio":

            break;
            case "entities":

            break;
            case "components":

            break;
            case "attrs":

            break;
            case "users":

            break;
            case "spaces":

            break;
            case "places":

            break;
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




    private buildFileBrowser(directories: boolean, attr: browser, component: Component) {

    }
    private buildTextViewer(attr: browser, component: Component) {

    }
    private buildCSVViewer(attr: browser, component: Component) {

    }
    private buildJSONEditor(attr: browser, component: Component) {

    }
    private buildHTMLViewer(attr: browser, component: Component) {

    }
    private buildImageBrowser(attr: browser, component: Component) {

    }

    // implement
}