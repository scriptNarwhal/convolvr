import {
    UTIL_LAUNCH_TEXT_EDIT,
    UTIL_LAUNCH_RENAME_FILE,
    UTIL_LAUNCH_SHARING_SETTINGS
} from '../constants/action-types';

module.exports = function app (state = {
    textEdit: {
        active: false,
        username: "",
        filename: "",
        dir: ""
    },
    renameFile: {
        active: false,
        username: "",
        filename: "",
        dir: ""
    },
    sharingSettings: {
        active: false,
        username: "",
        filename: "",
        dir: ""
    }
}, action) {
  switch ( action.type ) {
    case UTIL_LAUNCH_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                active: !state.textEdit.active,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    case UTIL_LAUNCH_RENAME_FILE:
        return {
            ...state,
            renameFile: {
                ...state.renameFile,
                active: !state.renameFile.active,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    case UTIL_LAUNCH_SHARING_SETTINGS:
        return {
            ...state,
            sharingSettings: {
                ...state.sharingSettings,
                active: !state.sharingSettings.active,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    default:
      return state;
  }
};
