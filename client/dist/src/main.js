"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Convolvr Client Initializing');
const ReactDOM = require("react-dom"); // React
const React = require("react");
const react_router_redux_1 = require("react-router-redux");
const createBrowserHistory_1 = require("history/createBrowserHistory");
const makeStore_1 = require("./2d-ui/redux/makeStore");
const demos_1 = require("./demos");
const config_1 = require("./config");
const routes_1 = require("./2d-ui/routes");
const world_1 = require("./world/world");
const socket_1 = require("./network/socket");
let store = makeStore_1.default(react_router_redux_1.routerReducer), socket = socket_1.events, token = "", 
//progressBar:  ProgressBar,
loadingSpace = null, // built in ui entities
helpScreen = null, chatScreen = null, httpClient = null;
const history = createBrowserHistory_1.default();
token = localStorage.getItem("token") || "";
config_1.clearOldData();
loadingSpace = new world_1.default(socket, store, (world) => {
    let systems = world.systems, scene = world.three.scene, pos = world.camera.position, coords = world.getVoxel(pos), voxelKey = coords.join("."), altitude = systems.terrain.voxels[voxelKey].data.altitude;
    world.onUserLogin = (newUser) => {
        let user = world.user;
        let worldDetails = config_1.detectSpaceDetailsFromURL();
        user.data = Object.assign({}, user.data, newUser);
        user.name = newUser.userName;
        user.id = newUser.id;
        world.initUserAvatar(newUser, (avatar) => {
            if (worldDetails[3] && worldDetails[3][1] <= 1) {
                console.warn("respawning camera");
                pos.y = world.systems.terrain.voxels[coords.join(".")].data.altitude + 3;
            }
        });
    };
    world.onUserLogin(world.user);
    demos_1.default(world, coords, pos, altitude);
    setTimeout(() => {
        world.initChatAndLoggedInUser(localStorage.getItem("username") != null);
    }, 400);
});
setTimeout(() => {
    let worldDetails = config_1.detectSpaceDetailsFromURL();
    loadingSpace.load(worldDetails[0], worldDetails[1], () => { }, () => {
    });
}, 500);
ReactDOM.render(React.createElement(routes_1.default, { store, history }), document.getElementsByTagName('main')[0]);
