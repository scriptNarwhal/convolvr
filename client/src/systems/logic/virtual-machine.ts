// import { parser } from 'ecs'

export default class VirtualMachine {

    constructor ( world: Convolvr ) {
        this.world = world
    }

    init ( component: Component ) {

        let stack = []
        // REFACTOR THIS
        // first make convolvr/ecs based on SpaceHexagon/ecs
        // integrate here
        // detect memory, ioController, gpu,  if available

        return {
            operate: ( component ) => { // called continually, with a maximum number of operations per second
                
                this.operate( component.state.cpu )

            },
            onInput: ( component ) => {

                this.onInput ( component.state.cpu )

            },
            stack
        }

    }

    operate ( state ) {

        let stack = state.stack
        // supporting webasm would be ideal.. also interesting would be:
        
        // implement some kind of imperative syntax for:
        // setting, getting vars, calculations, comparisons / if / loops, 
        // calling & defining functions, with params & return / end of function,

    }
    
    onInput ( input ) {

        let stack = state.stack
        // implement
        // .. this should use an IOController attr in an adjacent component

    }

}