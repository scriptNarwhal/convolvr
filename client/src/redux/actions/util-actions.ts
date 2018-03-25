//@flow
import axios from 'axios';
import {
    UTIL_LAUNCH_TEXT_EDIT,
    UTIL_LAUNCH_RENAME_FILE,
    UTIL_LAUNCH_SHARING_SETTINGS,
    UTIL_LAUNCH_IMPORT_TO_INVENTORY,
    UTIL_LAUNCH_IMPORT_TO_SPACE,
    UTIL_LAUNCH_ENTITY_EDITOR,
    UTIL_LAUNCH_INVENTORY_EXPORT,
    UTIL_LAUNCH_COMPONENT_EDITOR,
    UTIL_LAUNCH_ATTRIBUTE_EDITOR,
    UTIL_LAUNCH_EDIT_LOADED_ITEM,
    UTIL_CLOSE_TEXT_EDIT,
    UTIL_CLOSE_RENAME_FILE,
    UTIL_CLOSE_SHARING_SETTINGS,
    UTIL_CLOSE_IMPORT_TO_INVENTORY,
    UTIL_CLOSE_IMPORT_TO_SPACE,
    UTIL_CLOSE_ENTITY_EDITOR,
    UTIL_CLOSE_INVENTORY_EXPORT,
    UTIL_CLOSE_COMPONENT_EDITOR,
    UTIL_CLOSE_ATTRIBUTE_EDITOR,
    UTIL_ACTIVATE_MODAL
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'

export function activateModal ( modalType: string ) {
    return {
        type: UTIL_ACTIVATE_MODAL,
        modalType
    }
}

export function launchTextEdit ( username: string, dir: string, filename: string ) {
    return {
        type: UTIL_LAUNCH_TEXT_EDIT,
        username,
        filename,
        dir    
    }
}

export function launchRenameFile ( username: string, dir: string, filename: string ) {
    return {
        type: UTIL_LAUNCH_RENAME_FILE,
        username,
        filename,
        dir
    }
}

export function launchSharingSettings ( username: string, dir: string, filename: string ) {
    return {
        type: UTIL_LAUNCH_SHARING_SETTINGS,
        username,
        filename,
        dir
    }
}

export function launchImportToInventory ( username: string, dir: string, filename: string ) {
    return {
        type: UTIL_LAUNCH_IMPORT_TO_INVENTORY,
        username,
        filename,
        dir
    }
}

export function launchImportToSpace ( username: string, itemIndex: number, itemData: Object ) {
    return {
        type: UTIL_LAUNCH_IMPORT_TO_SPACE,
        username,
        itemIndex,
        itemData
    }
}

export function launchInventoryExport ( username: string, category: string, itemId: number, itemIndex: number, itemData: Object ) {
    return {
        type: UTIL_LAUNCH_INVENTORY_EXPORT,
        username,
        category,
        itemIndex,
        itemData,
        itemId
    }
}

export function launchEntityEditor ( username: string, itemId: number, source: string = "inventory" ) {
    return {
        type: UTIL_LAUNCH_ENTITY_EDITOR,
        username,
        category: "Entities",
        itemId,
        source
    }
}

export function launchComponentEditor ( username: string, itemId: number, source: string = "inventory" ) {
    return {
        type: UTIL_LAUNCH_COMPONENT_EDITOR,
        username,
        category: "Components",
        itemId,
        source
    }
}

export function launchAttributeEditor ( username: string, itemId: number, source: string = "inventory" ) {
    return {
        type: UTIL_LAUNCH_ATTRIBUTE_EDITOR,
        username,
        category: "Properties",
        itemId,
        source
    }
}

export function launchEditLoadedItem ( source: string, username: string, category: string, index: number, data: Object ) {

    return (dispatch: Function) => {

        dispatch({
            type: UTIL_LAUNCH_EDIT_LOADED_ITEM,
            username,
            category,
            source,
            data,
            index
        })

        if (category == "Components") {

            dispatch(launchComponentEditor(username, index))

        } else if (category == "Entities") {

            dispatch(launchEntityEditor(username, index))

        } else if (category == "Properties") {

            dispatch(launchAttributeEditor(username, index))

        }

    }
    
}

export function closeTextEdit ( ) {
    return {
        type: UTIL_CLOSE_TEXT_EDIT,
    }
}

export function closeRenameFile ( ) {
    return {
        type: UTIL_CLOSE_RENAME_FILE,
    }
}

export function closeSharingSettings ( ) {
    return {
        type: UTIL_CLOSE_SHARING_SETTINGS,
    }
}

export function closeImportToInventory ( ) {
    return {
        type: UTIL_CLOSE_IMPORT_TO_INVENTORY,
    }
}

export function closeImportToSpace ( ) {
    return {
        type: UTIL_CLOSE_IMPORT_TO_SPACE,
    }
}

export function closeEntityEditor ( ) {
    return {
        type: UTIL_CLOSE_ENTITY_EDITOR,
    }
}

export function closeInventoryExport ( ) {
    return {
        type: UTIL_CLOSE_INVENTORY_EXPORT,
    }
}

export function closeComponentEditor ( ) {
    return {
        type: UTIL_CLOSE_COMPONENT_EDITOR,
    }
}

export function closeAttributeEditor ( ) {
    return {
        type: UTIL_CLOSE_ATTRIBUTE_EDITOR,
    }
}