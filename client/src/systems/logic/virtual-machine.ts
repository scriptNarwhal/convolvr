
import Component from '../../core/component.js';
import Convolvr from '../../world/world'

// import { parser } from 'ecs'

export default class VirtualMachine {

    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) {

        let stack: any[] = []
        // REFACTOR THIS
        // first make convolvr/ecs based on SpaceHexagon/ecs
        // integrate here
        // detect memory, ioController, gpu,  if available

        return {
            operate: ( component: Component ) => { // called continually, with a maximum number of operations per second
                
                this.operate( component )

            },
            onInput: ( component: Component, input: any ) => {

                this.onInput ( component, input )

            },
            stack
        }

    }

    operate ( component: Component ) {
        let stack = component.state.cpu.stack;
        // supporting webasm would be ideal.. also interesting would be:
        
        // implement some kind of imperative syntax for:
        // setting, getting vars, calculations, comparisons / if / loops, 
        // calling & defining functions, with params & return / end of function,

    }
    
    onInput ( component: Component, input: any ) {
        let stack = component.state.cpu.stack;
        // implement
        // .. this should use an IOController attr in an adjacent component

    }

}