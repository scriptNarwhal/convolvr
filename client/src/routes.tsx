import * as React from "react"; import { Component } from "react";
import ReactDOM from 'react-dom' // React
import { Router, Route} from 'react-router'
import { Provider } from 'react-redux'
import { APP_ROOT} from './config'

import App from './2d-ui/containers/app' // 2D UI
import Data from './2d-ui/containers/data'
import Spaces from './2d-ui/containers/worlds'
import Places from './2d-ui/containers/places'
import NewSpace from './2d-ui/containers/new-world'
import Settings from './2d-ui/containers/settings'
import Inventory from './2d-ui/containers/inventory'
import Network from './2d-ui/containers/network'
import Login from './2d-ui/containers/login'
import Chat from './2d-ui/containers/chat'
import Profile from './2d-ui/containers/profile'
import HUD from './2d-ui/containers/hud'

class Routes extends Component<any, any> {
    render () {
        return (
            <Provider store={this.props.store}>
                <Router history={this.props.history}>
                    <Route path={APP_ROOT+"/"} component={App} >
                <Route path={APP_ROOT+"/:userName/:worldName"} component={HUD} />
                <Route path={APP_ROOT+"/:userName/:worldName/at/:coords"} component={HUD} />
                <Route path={APP_ROOT+"/:userName/:worldName/:placeName"} component={HUD} />
                <Route path={APP_ROOT+"/login"} component={Login} />
                <Route path={APP_ROOT+"/chat"} component={Chat} />
                <Route path={APP_ROOT+"/files"} component={Data} />
                <Route path={APP_ROOT+"/files/:username"} component={Data} />
                <Route path={APP_ROOT+"/spaces"} component={Spaces} />
                <Route path={APP_ROOT+"/places"} component={Places} />
                <Route path={APP_ROOT+"/new-world"} component={NewSpace} />
                <Route path={APP_ROOT+"/settings"} component={Settings} />
                <Route path={APP_ROOT+"/inventory"} component={Inventory} />
                <Route path={APP_ROOT+"/network"} component={Network} />
                <Route path={APP_ROOT+"/profile"} component={Profile} />
                    </Route>
                </Router>
        </Provider>
        )
    }
}

export default Routes;