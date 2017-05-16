export default class GPUSystem { // renders graphics to canvas via 2d api or glsl
    constructor (world) {
        this.world = world
    }

    init ( component ) {

        // create a canvas, save the context, etc
        // implement
       

        return {
            getOutput: () => {

            },
            clear: () => {
                
            }
        }

    }
    
    configure ( data ) {

        // implement 

    }

    draw ( type, data ) {

        switch ( type ) {

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

    renderText ( data ) {



    }

    renderShape ( data ) {


        
    }

    renderShader ( data ) {


    }

    renderCamera ( data ) {
        

    }
    
    renderVirtualCamera ( camera ) {


    }

}