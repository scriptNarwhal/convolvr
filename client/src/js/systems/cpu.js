export default class CPUSystem { // 
    constructor (world) {
        this.world = world
    }

    init ( component ) {

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
        // implement

    }
    
    onInput ( input ) {

        let stack = state.stack
        // implement
        // .. this should use an IOController prop in an adjacent component

    }

}