export default class DisplayAdapterDevice {

    constructor ( world, component ) {
        this.world = world
    }   

    init ( component: Component ) {
        
                // create a canvas, save the context, etc
                // implement
        
                return {
                    getOutput: () => {
        
                    },
                    clear: () => {
                        
                    }
                }
        
            }
            
            configure ( data: Object ) {
        
                // implement 
        
            }
        
            draw ( type: string, data: Object ) {
        
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
        
            renderText ( data: Object ) {
        
        
        
            }
        
            renderShape ( data: Object ) {
        
        
                
            }
        
            renderShader ( data: Object ) {
        
        
            }
        
            renderCamera ( data: Object ) {
                
        
            }
            
            renderVirtualCamera ( camera: Object ) {
        
        
            }

}