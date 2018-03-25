import axios from 'axios'

export default class RESTSystem {

    constructor (world) {

        this.world = world

    }

    init (component) { 

        let attr = component.attrs.rest, // specify url, method, etc
            rest = this

        let getCallback = (response, component) => {

                component.state.rest.getResponse = response

                if ( !!component.attrs.text ) { // abstract this logic away some how.. and make it scriptable

                    let responseLines = JSON.stringify(response.data).match(/(.|[\r\n]){1,42}/g)

                    component.attrs.text.lines = responseLines
                    component.state.text.update()

                    if ( !!component.attrs.speech ) {

                        component.state.speech.speakAll( responseLines, false, 0)

                    }

                }

            },
            getError =  ( error, component ) => {
                component.state.rest.getError = error
            },
            postCallback = (response, component) => {
                component.state.rest.postResponse = response
            },
            postError =  ( error, component ) => {
                component.state.rest.postError = error
            }


        if ( attr.get ) {
            this.getRequest( component, attr.get.url, getCallback, getError )
        }

        if ( attr.post ) {
            this.postRequest( component, attr.post.url, attr.post.data )
        }

        // add init logic... // other systems can call these methods too*

        return {

            getResponse: false,
            postResponse: false,
            getRequest: ( url ) => {
                rest.getRequest( component, url, getCallback, getError )
            },
            postRequest: ( url, data ) => {
                rest.postRequest( component, url, data, postCallback, postError )
            }
        }
    }

    getRequest ( component, url, callback, onError ) {

        axios.get(url).then( res => {
            callback ( res, component )
        }).catch( err => {
           onError ( err, component )
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

