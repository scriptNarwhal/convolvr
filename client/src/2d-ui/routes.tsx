import * as React from "react"; import { Component } from "react";
import ReactDOM from 'react-dom' // React
import { Router, Route, Switch} from 'react-router'
import { Provider } from 'react-redux'
import { APP_ROOT} from '../config'

import App from './containers/app' // 2D UI

class Routes extends Component<any, any> {
    render () {
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history}>
                    <Route path={APP_ROOT+"/"} component={App} >
                       
                    </Route>
                </Router>
        </Provider>
        )
    }
}

export default Routes;