export default class BrowserSystem {

    constructor ( world ) {

        this.world = world

    }

    init ( component ) { 
        
        let prop = component.props.browser

        switch ( prop.type ) {

            case "files":

            break
            case "directories":


            case "text":

            break
            case "html":

            break
            case "images":

            break
            case "video":

            break
            case "audio":

            break
            case "entities":

            break
            case "components":

            break
            case "props":

            break
            case "users":

            break
            case "worlds":

            break
            case "places":

            break
        }

        return {
            navigate: ( url ) => {
                this.navigate( component, url )
            },
            upOneLevel: ( url ) => {
                this.upOneLevel( component )
            },
            back: ( url ) => {
                this.back( component )
            },
            forward: ( url ) => {
                this.forward( component )
            },
            refresh: ( url ) => {
                this.refresh( component )
            },
            type: prop.type
        }
    }

    upOneLevel ( component ) {

    }

    navigate ( component, url ) {

    }

    back ( component ) {

    }

    forward ( component ) {


    }
    
    refresh ( component ) {


    }

    // implement
}