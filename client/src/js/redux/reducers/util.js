import {
    UTIL_LAUNCH_TEXT_EDIT,
    UTIL_LAUNCH_RENAME_FILE,
    UTIL_LAUNCH_SHARING_SETTINGS,
    UTIL_LAUNCH_IMPORT_TO_INVENTORY,
    UTIL_LAUNCH_IMPORT_TO_WORLD,
    UTIL_LAUNCH_INVENTORY_EDITOR,
    UTIL_LAUNCH_INVENTORY_EXPORT,
    UTIL_CLOSE_TEXT_EDIT,
    UTIL_CLOSE_RENAME_FILE,
    UTIL_CLOSE_SHARING_SETTINGS,
    UTIL_CLOSE_IMPORT_TO_INVENTORY,
    UTIL_CLOSE_IMPORT_TO_WORLD,
    UTIL_CLOSE_INVENTORY_EDITOR,
    UTIL_CLOSE_INVENTORY_EXPORT
} from '../constants/action-types';

module.exports = function app (state = {
    textEdit: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    renameFile: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    sharingSettings: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    importToWorld: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    importToInventory: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    inventoryEditor: {
        activated: false,
        username: "",
        category: "",
        itemId: ""
    },
    inventoryExport: {
        activated: false,
        username: "",
        category: "",
        itemId: ""
    }
}, action) {
  switch ( action.type ) {
    case UTIL_LAUNCH_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                activated: true,
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
                activated: true,
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
                activated: true,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    case UTIL_LAUNCH_IMPORT_TO_INVENTORY:
        return {
            ...state,
            importToInventory: {
                ...state.importToInventory,
                activated: true,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    case UTIL_LAUNCH_IMPORT_TO_WORLD:
        return {
            ...state,
            importToWorld: {
                ...state.importToWorld,
                activated: true,
                username: action.username,
                filename: action.filename,
                dir: action.dir
            }
        }
    case UTIL_LAUNCH_INVENTORY_EDITOR:
        return {
            ...state,
            inventoryEditor: {
                ...state.inventoryEditor,
                activated: true,
                username: action.username,
                category: action.category,
                itemId: action.itemId
            }
        }
    case UTIL_LAUNCH_INVENTORY_EXPORT:
        return {
            ...state,
            inventoryExport: {
                ...state.inventoryExport,
                activated: true,
                username: action.username,
                category: action.category,
                itemId: action.itemId
            }
        }
    case UTIL_CLOSE_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                activated: false
            }
        }
    case UTIL_CLOSE_RENAME_FILE:
        return {
            ...state,
            renameFile: {
                ...state.renameFile,
                activated: false
            }
        }
    case UTIL_CLOSE_SHARING_SETTINGS:
        return {
            ...state,
            sharingSettings: {
                ...state.sharingSettings,
                activated: false
            }
        }
    case UTIL_CLOSE_IMPORT_TO_INVENTORY:
        return {
            ...state,
            importToInventory: {
                ...state.importToInventory,
                activated: false
            }
        }
    case UTIL_CLOSE_IMPORT_TO_WORLD:
        return {
            ...state,
            importToWorld: {
                ...state.importToWorld,
                activated: false
            }
        }
    case UTIL_CLOSE_INVENTORY_EDITOR:
        return {
            ...state,
            inventoryEditor: {
                ...state.inventoryEditor,
                activated: false
            }
        }
    case UTIL_CLOSE_INVENTORY_EXPORT:
        return {
            ...state,
            inventoryExport: {
                ...state.inventoryExport,
                activated: false
            }
        }
    default:
      return state;
  }
};
