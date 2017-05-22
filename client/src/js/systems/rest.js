import axios from 'axios'

export default class RESTSystem {

    constructor (world) {

        this.world = world

    }

    init (component) { 

        let prop = component.props.rest // specify url, method, etc
        
        if ( prop.get ) {

            this.getRequest( component, prop.get.url)

        }

        if ( prop.post ) {

            this.postRequest( component, prop.post.url, prop.post.data )

        }

        // add init logic... // other systems can call these methods too*

        return {

            getResponse: false,
            postResponse: false,
            getRequest: (url) => {

                this.getRequest(component, url, (response) => {

                    component.state.rest.getResponse = response

                }, (error) => {

                    component.state.rest.getError = error

                })

            },
            postRequest: (url, data) => {

                this.postRequest(component, url, data, (response) => {

                    component.state.rest.postResponse = response

                }, (error) => {

                    component.state.rest.postError = error

                })

            }

        }

    }

    getRequest ( component, url, callback, onError ) {

        axios.get(url)

        .then( res => {

            callback ( res, component )

        }).catch( err => {

            onError ( err )

        });

    }

    postRequest ( component, url, data, callback, onError ) {

        axios.post(url, data).then( res => {

           callback( res, component )

        }).catch( err => {

           onError( err, component )

        });

    }
}

