import {
    ENTITY_ADD,
    ENTITIES_FETCH,
    ENTITIES_FETCH_FAILED,
    ENTITIES_FETCH_DONE,
    ENTITY_IMPORT_TO_WORLD_FETCH,
    ENTITY_IMPORT_TO_WORLD_DONE,
    ENTITY_IMPORT_TO_WORLD_FAIL
} from '../constants/action-types';

module.exports = function entities (state = {
    all: [],
    userEntities: [],
    current: null,
    fetching: false,
    error: false,
    addedToWorld: false
}, action) {
  switch (action.type) {
    case ENTITY_ADD:
        return Object.assign({}, state, {
            instances: [
                ...state.instances,
                action.data
            ]
        })
    case ENTITIES_FETCH:
        return Object.assign({}, state, {
            all: [],
            fetching: true
        })
    case ENTITIES_FETCH_DONE:
        return Object.assign({}, state, {
            all: action.data,
            fetching: false
        })
    case ENTITIES_FETCH_FAILED:
        return Object.assign({}, state, {
            error: action.err
        })
    case ENTITY_IMPORT_TO_WORLD_FETCH:
        return Object.assign({}, state, {
            addedToWorld: false,
            fetching: true
        })
    case ENTITY_IMPORT_TO_WORLD_DONE:
        return Object.assign({}, state, {
            addedToWorld: action.data,
            fetching: false
        })
    case ENTITY_IMPORT_TO_WORLD_FAIL:
        return Object.assign({}, state, {
            error: action.err
        })   
    default:
      return state;
  }
};
