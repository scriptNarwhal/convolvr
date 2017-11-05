import {
    UTIL_LAUNCH_TEXT_EDIT,
    UTIL_LAUNCH_RENAME_FILE,
    UTIL_LAUNCH_SHARING_SETTINGS,
    UTIL_LAUNCH_IMPORT_TO_INVENTORY,
    UTIL_LAUNCH_IMPORT_TO_WORLD,
    UTIL_LAUNCH_ENTITY_EDITOR,
    UTIL_LAUNCH_INVENTORY_EXPORT,
    UTIL_LAUNCH_COMPONENT_EDITOR,
    UTIL_LAUNCH_PROPERTY_EDITOR,
    UTIL_CLOSE_TEXT_EDIT,
    UTIL_CLOSE_RENAME_FILE,
    UTIL_CLOSE_SHARING_SETTINGS,
    UTIL_CLOSE_IMPORT_TO_INVENTORY,
    UTIL_CLOSE_IMPORT_TO_WORLD,
    UTIL_CLOSE_ENTITY_EDITOR,
    UTIL_CLOSE_INVENTORY_EXPORT,
    UTIL_CLOSE_COMPONENT_EDITOR,
    UTIL_CLOSE_PROPERTY_EDITOR,
    UTIL_LAUNCH_EDIT_LOADED_ITEM
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
        target: "",
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
        itemData: false,
        itemIndex: -1
    },
    importToInventory: {
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    entityEdit: {
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
    },
    componentEdit: {
        activated: false,
        username: "",
        itemId: ""
    },
    propertyEdit: {
        activated: false,
        username: "",
        itemId: ""
    },
    loadedItemEdit: {
        activated: {
            entity: false,
            component: false,
            property: false
        },
        username: "",
        category: "",
        index: -1,
        data: {
            entity: false,
            component: false,
            property: false
        },
        source: ""
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
                itemData: action.itemData,
                itemIndex: action.itemIndex
            }
        }
    case UTIL_LAUNCH_ENTITY_EDITOR:
        return {
            ...state,
            entityEdit: {
                ...state.entityEdit,
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
                itemIndex: action.itemIndex,
                itemData: action.itemData,
                itemId: action.itemId
            }
        }
     case UTIL_LAUNCH_COMPONENT_EDITOR:
        return {
            ...state,
            componentEdit: {
                ...state.componentEdit,
                activated: true,
                username: action.username,
                itemId: action.itemId
            }
        }
    case UTIL_LAUNCH_PROPERTY_EDITOR:
        return {
            ...state,
            propertyEdit: {
                ...state.propertyEdit,
                activated: true,
                username: action.username,
                itemId: action.itemId
            }
        }
    case UTIL_LAUNCH_EDIT_LOADED_ITEM:

        let data = {...state.loadedItemEdit.data },
            activated = {...state.loadedItemEdit.activated }
        
        switch( action.category ) {
            case "Entities":
                data.entity = action.data
                activated.entity = true
            break
            case "Components":
                data.component = action.data
                activated.component = true
            break
            case "Properties":
                data.property = action.data
                activated.property = true
            break
        }

        return {
            ...state,
            loadedItemEdit: {
                ...state.loadedItemEdit,
                activated,
                data,
                username: action.username,
                index: action.index,
                category: action.category,
                source: action.source
            }
        }
    case UTIL_CLOSE_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                activated: false,
                username: "",
                filename: "",
                dir: ""
            }
        }
    case UTIL_CLOSE_RENAME_FILE:
        return {
            ...state,
            renameFile: {
                ...state.renameFile,
                activated: false,
                username: "",
                filename: "",
                target: "",
                dir: ""
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
    case UTIL_CLOSE_ENTITY_EDITOR:
        return {
            ...state,
            entityEdit: {
                ...state.entityEdit,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                data: {
                    ...state.loadedItemEdit.data,
                    entity: null
                }
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
    case UTIL_CLOSE_COMPONENT_EDITOR:
        return {
            ...state,
            componentEdit: {
                ...state.componentEdit,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                data: {
                    ...state.loadedItemEdit.data,
                    component: null
                }
            }
        }
    case UTIL_CLOSE_PROPERTY_EDITOR:
        return {
            ...state,
            propertyEdit: {
                ...state.propertyEdit,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                data: {
                    ...state.loadedItemEdit.data,
                    property: null
                }
            }
        }
    default:
      return state;
  }
};
