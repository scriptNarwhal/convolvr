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
    UTIL_LAUNCH_EDIT_LOADED_ITEM,
    UTIL_ACTIVATE_MODAL
} from '../constants/action-types';

module.exports = function app (state = {
    textEdit: {
        windowsOpen: 0,
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    renameFile: {
        windowsOpen: 0,
        activated: false,
        username: "",
        filename: "",
        target: "",
        dir: ""
    },
    sharingSettings: {
        windowsOpen: 0,
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    importToWorld: {
        windowsOpen: 0,
        activated: false,
        username: "",
        itemData: false,
        itemIndex: -1
    },
    importToInventory: {
        windowsOpen: 0,
        activated: false,
        username: "",
        filename: "",
        dir: ""
    },
    entityEdit: {
        windowsOpen: 0,
        activated: false,
        username: "",
        category: "",
        itemId: "",
        source: "inventory"
    },
    inventoryExport: {
        windowsOpen: 0,
        activated: false,
        username: "",
        category: "",
        itemId: ""
    },
    componentEdit: {
        windowsOpen: 0,
        activated: false,
        username: "",
        itemId: "",
        source: "inventory"
    },
    attrertyEdit: {
        windowsOpen: 0,
        activated: false,
        username: "",
        itemId: "",
        source: "inventory"
    },
    loadedItemEdit: {
        windowsOpen: 0,
        activated: {
            entity: false,
            component: false,
            attrerty: false
        },
        username: "",
        category: "",
        index: -1,
        data: {
            entity: false,
            component: false,
            attrerty: false
        },
        source: {
            entity: "inventory",
            component: "inventory",
            attrerty: "inventory"
        }
    }
}, action) {
  switch ( action.type ) {
    case UTIL_ACTIVATE_MODAL:
        let newState = {...state }
        switch( action.modalType ) {
            case "textEdit":
                newState = {
                    ...newState,
                    textEdit: {
                        ...newState.textEdit,
                        windowsOpen: newState.textEdit.windowsOpen + 1
                    }
                }
            break;
            case "renameFile":
                newState = {
                    ...newState,
                    renameFile: {
                        ...newState.renameFile,
                        windowsOpen: newState.renameFile.windowsOpen + 1
                    }
                }
            break;
            case "sharingSettings":
                newState = {
                    ...newState,
                    sharingSettings: {
                        ...newState.sharingSettings,
                        windowsOpen: newState.sharingSettings.windowsOpen + 1
                    }
                }
            break;
            case "importToWorld":
                newState = {
                    ...newState,
                    importToWorld: {
                        ...newState.importToWorld,
                        windowsOpen: newState.importToWorld.windowsOpen + 1
                    }
                }
            break;
            case "importToInventory":
                newState = {
                    ...newState,
                    importToInventory: {
                        ...newState.importToInventory,
                        windowsOpen: newState.importToInventory.windowsOpen + 1
                    }
                }
            break;
            case "entityEdit":
                newState = {
                    ...newState,
                    entityEdit: {
                        ...newState.entityEdit,
                        windowsOpen: newState.entityEdit.windowsOpen + 1
                    }
                }
            break;
            case "inventoryExport":
                newState = {
                    ...newState,
                    inventoryExport: {
                        ...newState.inventoryExport,
                        windowsOpen: newState.inventoryExport.windowsOpen + 1
                    }
                }
            break;
            case "componentEdit":
                newState = {
                    ...newState,
                    componentEdit: {
                        ...newState.componentEdit,
                        windowsOpen: newState.componentEdit.windowsOpen + 1
                    }
                }
            break;
            case "attrertyEdit":
                newState = {
                    ...newState,
                    attrertyEdit: {
                        ...newState.attrertyEdit,
                        windowsOpen: newState.attrertyEdit.windowsOpen + 1
                    }
                }
            break;
            
        }
        return newState
    case UTIL_LAUNCH_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                windowsOpen: state.textEdit.windowsOpen + 1,
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
                windowsOpen: state.renameFile.windowsOpen + 1,
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
                windowsOpen: state.sharingSettings.windowsOpen + 1,
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
                windowsOpen: state.importToInventory.windowsOpen + 1,
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
                windowsOpen: state.textEdit.windowsOpen + 1,
                activated: true,
                username: action.username,
                itemData: action.itemData,
                itemIndex: action.itemIndex
            }
        }
    case UTIL_LAUNCH_INVENTORY_EXPORT:
        return {
            ...state,
            inventoryExport: {
                ...state.inventoryExport,
                windowsOpen: state.inventoryExport.windowsOpen + 1,
                activated: true,
                username: action.username,
                category: action.category,
                itemIndex: action.itemIndex,
                itemData: action.itemData,
                itemId: action.itemId
            }
        }
    case UTIL_LAUNCH_ENTITY_EDITOR:
        return {
            ...state,
            entityEdit: {
                ...state.entityEdit,
                windowsOpen: state.entityEdit.windowsOpen + 1,
                activated: true,
                username: action.username,
                category: action.category,
                itemId: action.itemId,
                source: action.source
            }
        }
     case UTIL_LAUNCH_COMPONENT_EDITOR:
        return {
            ...state,
            componentEdit: {
                ...state.componentEdit,
                windowsOpen: state.componentEdit.windowsOpen + 1,
                activated: true,
                username: action.username,
                itemId: action.itemId,
                source: action.source
            }
        }
    case UTIL_LAUNCH_PROPERTY_EDITOR:
        return {
            ...state,
            attrertyEdit: {
                ...state.attrertyEdit,
                windowsOpen: state.attrertyEdit.windowsOpen + 1,
                activated: true,
                username: action.username,
                itemId: action.itemId,
                source: action.source
            }
        }
    case UTIL_LAUNCH_EDIT_LOADED_ITEM:

        let data = {...state.loadedItemEdit.data },
            activated = {...state.loadedItemEdit.activated },
            source = {...state.loadedItemEdit.source }
        
        switch( action.category ) {
            case "Entities":
                data.entity = action.data
                activated.entity = true
                source.entity = action.source
            break
            case "Components":
                data.component = action.data
                activated.component = true
                source.component = action.source
            break
            case "Properties":
                data.attrerty = action.data
                activated.attrerty = true
                source.attrerty = action.source
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
                source
            }
        }
    case UTIL_CLOSE_TEXT_EDIT:
        return {
            ...state,
            textEdit: {
                ...state.textEdit,
                windowsOpen: state.textEdit.windowsOpen - 1,
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
                windowsOpen: state.renameFile.windowsOpen - 1,
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
                windowsOpen: state.sharingSettings.windowsOpen - 1,
                activated: false
            }
        }
    case UTIL_CLOSE_IMPORT_TO_INVENTORY:
        return {
            ...state,
            importToInventory: {
                ...state.importToInventory,
                windowsOpen: state.importToInventory.windowsOpen - 1,
                activated: false
            }
        }
    case UTIL_CLOSE_IMPORT_TO_WORLD:
        return {
            ...state,
            importToWorld: {
                ...state.importToWorld,
                windowsOpen: state.importToWorld.windowsOpen - 1,
                activated: false
            }
        }
    case UTIL_CLOSE_ENTITY_EDITOR:
        return {
            ...state,
            entityEdit: {
                ...state.entityEdit,
                windowsOpen: state.entityEdit.windowsOpen - 1,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                windowsOpen: state.loadedItemEdit.windowsOpen - 1,
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
                windowsOpen: state.inventoryExport.windowsOpen - 1,
                activated: false
            }
        }
    case UTIL_CLOSE_COMPONENT_EDITOR:
        return {
            ...state,
            componentEdit: {
                ...state.componentEdit,
                windowsOpen: state.componentEdit.windowsOpen - 1,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                windowsOpen: state.loadedItemEdit.windowsOpen - 1,
                data: {
                    ...state.loadedItemEdit.data,
                    component: null
                }
            }
        }
    case UTIL_CLOSE_PROPERTY_EDITOR:
        return {
            ...state,
            attrertyEdit: {
                ...state.attrertyEdit,
                windowsOpen: state.attrertyEdit.windowsOpen - 1,
                activated: false
            },
            loadedItemEdit: {
                ...state.loadedItemEdit,
                windowsOpen: state.loadedItemEdit.windowsOpen - 1,
                data: {
                    ...state.loadedItemEdit.data,
                    attrerty: null
                }
            }
        }
    default:
      return state;
  }
};
