import axios from 'axios'
import Component from '../../core/component.js';
import Convolvr from '../../world/world'
import { rest } from '../../core/attribute.js';
import { System } from '../index.js';

export default class RESTSystem implements System {
    world: Convolvr

    constructor ( world: Convolvr ) {
        this.world = world
    }


    init (component: Component) { 
        let attr: rest = component.attrs.rest, // specify url, method, etc
            rest = this

        let getCallback = (response: any, component: Component) => {
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
            getError =  ( error: any, component: Component ) => {
                component.state.rest.getError = error
            },
            postCallback = (response: any, component: Component) => {
                component.state.rest.postResponse = response
            },
            postError =  ( error: any, component: Component ) => {
                component.state.rest.postError = error
            }


        if ( attr.get ) {
            this.getRequest( component, attr.get.url, getCallback, getError )
        }

        if ( attr.post ) {
            this.postRequest( component, attr.post.url, attr.post.data,
            (success: any)=> {

            }, 
            (error: any)=>{

            })
        }

        // add init logic... // other systems can call these methods too*

        return {
            getResponse: false,
            postResponse: false,
            getRequest: ( url: string ) => {
                rest.getRequest( component, url, getCallback, getError )
            },
            postRequest: ( url: string, data: any ) => {
                rest.postRequest( component, url, data, postCallback, postError )
            }
        }
    }

    getRequest ( component: Component, url: string, callback: Function, onError: Function) {

        axios.get(url).then( res => {
            callback ( res, component )
        }).catch( err => {
           onError ( err, component )
        });
    }

    postRequest ( component: Component, url: string, data: any, callback: Function, onError: Function) {

        axios.post(url, data).then( res => {
           callback( res, component )
        }).catch( err => {
           onError( err, component )
        });
    }
}

