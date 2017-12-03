export default class CPUSystem {

    constructor ( world: Convolvr ) {

        this.world = world

    }

    init ( component: Component ) {

        let stack = []

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
        // .. this should use an IOController prop in an adjacent component

    }

}