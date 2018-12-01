//@flow
import Convolvr from '../../world/world'
import Component from '../../model/component'
import { AttributeName } from '../../model/attribute';

export default class EmoteSystem {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) { 
        
        let attr = component.attrs.emote

        //TODO: implement

        return {
            
        }
    }

    use ( component: Component ) {

        let attr = component.attrs.emote
        //TODO: implement
    }

    permutate ( component: Component ) {
        
        let attr = component.attrs.emote
        //TODO: implement
    }

    record ( component: Component ) {
        
        let attr = component.attrs.emote 
        //TODO: implement 
    }

    public systemIcons: {[key in AttributeName]?: string} = {
        ability: "",
        activate: "",
        audio: "",
        assets: "",
        browser: "",
        camera: "",
        chat: "",
        control: "",
        conveyor: "",
        cursor: "",
        datgui: "",
        destructable: "",
        display: "",
        virtualDevice: "",
        door: "",
        drawing: "",
        emote: "",
        faction: "",
        factory: "",
        factoryProvider: "",
        fbx: "",
        file: "",
        floor: "",
        geometry: "",
        grab: "",
        graph: "",
        hand: "",
        head: "",
        hover: "",
        input: "",
        light: "",
        layout: "",
        lookAway: "",
        magic: "",
        material: "",
        media: "",
        miniature: "",
        npc: "",
        obj: "",
        oimo: "",
        objective: "",
        particles: "",
        propulsion: "",
        portal: "",
        projectile: "",
        quest: "",
        rest: "",
        rpgRace: "",
        signal: "",
        skill: "",
        skybox: "",
        script: "",
        screenshot: "",
        socialMedia: "",
        seat: "",
        speech: "",
        state: "",
        stat: "",
        staticCollisions: "",
        terrain: "",
        text: "",
        template: "",
        time: "",
        toolUI: "",
        tool: "",
        toolbox: "",
        user: "",
        vehicle: "",
        video: "",
        virtualMachine: "",
        wall: "",
        webrtc: "",
        weapon: "",
    };
}