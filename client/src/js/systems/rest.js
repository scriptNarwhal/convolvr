export default class RESTSystem {

    constructor (world) {

        this.world = world

    }

    init (component) { 

        let prop = component.props.rest // specify url, method, etc
        
        return {

            getResponse: false,
            postResponse: false,
            getRequest: (url) => {

                this.getRequest(url, (response) => {

                    component.state.rest.getResponse = response

                })

            },
            postRequest: (url, data) => {

                this.postRequest(url, data, (response) => {

                    component.state.rest.postResponse = response

                })

            }

        }

    }

    getRequest (url, callback) {

    }

    postRequest (url, data, callback) {

    }
}

