import Convolvr from "../../world/world";
import Component from "../../core/component";

type Signalstate = {
    oscillator: any,
    value: number,
    type: string,
    in: any,
    out: any
}

export default class SignalSystem { // system for passing signals between entities
    private world: Convolvr
    private oscillators: any
    private io: any

    constructor (world: Convolvr) {
        this.world = world
        this.oscillators = {
            sine: [],
            sawUp: [],
            sawDown: [],
            square: [],
            triangle: [],
            noise: null
        }

        this.io = {} // map to maps of arrays of signals by entity { 0.0.0: { "125158": [ Input, Input, Input ] } }
        // needs to tie into terrain / voxel system, for global system state specific to voxel
    }

    public init (component: Component): SignalState { 
        let attr = component.attrs.signal,
            osc = null,
            state: Signalstate = {
                oscillator: null,
                value: attr.value ? attr.value : 0,
                type: attr.type || "number",
                in: null,
                out: null
            }
        
        if (attr.wire == true) {
            // handle attragation 
        }
        
        if (attr.in) {

            
        }

        if (attr.out) {


        }

        if (attr.oscillator) {
            osc = this._initOscillator(component, attr, state, attr.oscillator)
            state.oscillator = osc
        }

        if (attr.modulate) {
            state.value = this._modulateSignal(component, attr, state, attr.modulate)
        }
        
        return state
    }

    private _initOscillator (component: Component, signal: any, state: SignalState, osc: any) {
        let oscillator = Object.assign( { component }, osc )

        this.oscillators[ osc.type ].push( oscillator )

        return oscillator

    }

    private _modulateSignal (component: Component, signal: any, state: SignalState, mod: any) {
        let value = state.value

        switch ( mod.type ) {

            case "add":
                value += mod.value
            break
            case "subtract":
                value -= mod.value
            break
            case "multiply":
                value *= mod.value
            break
            case "divide":
                value /= mod.value
            break
            case "multiply-amplitude":
                
            break
            case "multiply-frequency":

            break
        }

        return value

    }

    private _step (component: Component) {
        let signal = component.state.signal


    }
}

