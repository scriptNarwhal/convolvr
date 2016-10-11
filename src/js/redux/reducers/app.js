import {
    APP_TOGGLE_MENU,
    APP_TOGGLE_VR
} from '../constants/action-types';

module.exports = function app (state = {
    menuOpen: false,
    vrMode: false
}, action) {
  switch (action.type) {
    case APP_TOGGLE_MENU:
        return Object.assign({}, state, {
            menuOpen: !state.menuOpen
        })
    case APP_TOGGLE_VR:
        three.world.toggleStereo();
        return Object.assign({}, state, {
            vrMode: !state.vrMode
        })

    default:
      return state;
  }
};
