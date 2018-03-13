export default class SignalSystem { // system for passing signals between entities

    constructor ( world ) {

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

    init ( component ) { 

        let attr = component.attrs.signal,
            osc = null,
            state = {
                value: attr.value ? attr.value : 0,
                type: attr.type || "number",
                in: null,
                out: null
            }
        
        if ( attr.wire == true ) {
            // handle attragation 
        }
        
        if ( attr.in ) {

            

        }

        if ( attr.out ) {



        }

        if ( attr.oscillator ) {

            osc = this._initOscillator( component, attr, state, attr.oscillator )
            state.oscillator = osc
        }

        if ( attr.modulate ) {

            value = this._modulateSignal( component, attr, state, attr.modulate )

        }
        
        return state

    }

    _initOscillator ( component, signal, state, osc ) {

        let oscillator = Object.assign( { component }, osc )

        this.oscillators[ osc.type ].push( oscillator )

        return oscillator

    }

    _modulateSignal ( component, signal, state, mod ) {

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

    _step ( component ) {

        let signal = component.state.signal



    }

}

