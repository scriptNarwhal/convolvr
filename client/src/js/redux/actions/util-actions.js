import axios from 'axios';
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
    UTIL_LAUNCH_EDIT_LOADED_ITEM,
    UTIL_CLOSE_TEXT_EDIT,
    UTIL_CLOSE_RENAME_FILE,
    UTIL_CLOSE_SHARING_SETTINGS,
    UTIL_CLOSE_IMPORT_TO_INVENTORY,
    UTIL_CLOSE_IMPORT_TO_WORLD,
    UTIL_CLOSE_ENTITY_EDITOR,
    UTIL_CLOSE_INVENTORY_EXPORT,
    UTIL_CLOSE_COMPONENT_EDITOR,
    UTIL_CLOSE_PROPERTY_EDITOR
} from '../constants/action-types';
import { API_SERVER } from '../../config.js'

export function launchTextEdit ( username, dir, filename ) {
    return {
        type: UTIL_LAUNCH_TEXT_EDIT,
        username,
        filename,
        dir    
    }
}

export function launchRenameFile ( username, dir, filename ) {
    return {
        type: UTIL_LAUNCH_RENAME_FILE,
        username,
        filename,
        dir
    }
}

export function launchSharingSettings ( username, dir, filename ) {
    return {
        type: UTIL_LAUNCH_SHARING_SETTINGS,
        username,
        filename,
        dir
    }
}

export function launchImportToInventory ( username, dir, filename ) {
    return {
        type: UTIL_LAUNCH_IMPORT_TO_INVENTORY,
        username,
        filename,
        dir
    }
}

export function launchImportToWorld ( username, dir, filename ) {
    return {
        type: UTIL_LAUNCH_IMPORT_TO_WORLD,
        username,
        filename,
        dir
    }
}

export function launchInventoryExport ( username, category, itemId, itemIndex ) {
    return {
        type: UTIL_LAUNCH_INVENTORY_EXPORT,
        username,
        category,
        itemIndex,
        itemId
    }
}

export function launchEntityEditor ( username, itemId ) {
    return {
        type: UTIL_LAUNCH_ENTITY_EDITOR,
        username,
        category: "Entities",
        itemId
    }
}

export function launchComponentEditor ( username, itemId ) {
    return {
        type: UTIL_LAUNCH_COMPONENT_EDITOR,
        username,
        category: "Components",
        itemId
    }
}

export function launchPropertyEditor ( username, itemId ) {
    return {
        type: UTIL_LAUNCH_PROPERTY_EDITOR,
        username,
        category: "Properties",
        itemId
    }
}

export function launchEditLoadedItem ( source, username, category, index, data ) {

    return dispatch => {

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

            dispatch(launchPropertyEditor(username, index))

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

export function closeImportToWorld ( ) {
    return {
        type: UTIL_CLOSE_IMPORT_TO_WORLD,
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

export function closePropertyEditor ( ) {
    return {
        type: UTIL_CLOSE_PROPERTY_EDITOR,
    }
}