import axios from 'axios';
import {
    UTIL_LAUNCH_TEXT_EDIT,
    UTIL_LAUNCH_RENAME_FILE,
    UTIL_LAUNCH_SHARING_SETTINGS,
    UTIL_LAUNCH_IMPORT_TO_INVENTORY,
    UTIL_LAUNCH_IMPORT_TO_WORLD,
    UTIL_LAUNCH_INVENTORY_EDITOR,
    UTIL_LAUNCH_INVENTORY_EXPORT,
    UTIL_LAUNCH_COMPONENT_EDITOR,
    UTIL_LAUNCH_PROPERTY_EDITOR,
    UTIL_CLOSE_TEXT_EDIT,
    UTIL_CLOSE_RENAME_FILE,
    UTIL_CLOSE_SHARING_SETTINGS,
    UTIL_CLOSE_IMPORT_TO_INVENTORY,
    UTIL_CLOSE_IMPORT_TO_WORLD,
    UTIL_CLOSE_INVENTORY_EDITOR,
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

export function launchInventoryEditor ( username, category, itemId ) {
    return {
        type: UTIL_LAUNCH_INVENTORY_EDITOR,
        username,
        category,
        itemId
    }
}

export function launchInventoryExport ( username, category, itemId ) {
    return {
        type: UTIL_LAUNCH_INVENTORY_EXPORT,
        username,
        category,
        itemId
    }
}

export function launchComponentEditor ( username, category, itemId ) {
    return {
        type: UTIL_LAUNCH_COMPONENT_EDITOR,
        username,
        itemId
    }
}

export function launchPropertyEditor ( username, category, itemId ) {
    return {
        type: UTIL_LAUNCH_PROPERTY_EDITOR,
        username,
        itemId
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

export function closeInventoryEditor ( ) {
    return {
        type: UTIL_CLOSE_INVENTORY_EDITOR,
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