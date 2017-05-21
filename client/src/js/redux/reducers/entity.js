import {
    ENTITY_ADD,
    ENTITIES_FETCH,
    ENTITIES_FETCH_FAILED,
    ENTITIES_FETCH_DONE,
    UPDATE_ENTITY,
    DELETE_ENTITY
} from '../constants/action-types';

module.exports = function entities (state = {
    all: [],
    userEntities: [],
    current: null
}, action) {
  switch (action.type) {
    case ENTITY_ADD:
        return Object.assign({}, state, {
            instances: [
                ...state.instances,
                action.data
            ]
        })
    case DELETE_ENTITY:

    case ENTITIES_FETCH:

    case ENTITIES_FETCH_DONE:
        return Object.assign({}, state, {
            all: action.data,
        })
    case ENTITIES_FETCH_FAILED:

    case UPDATE_ENTITY:
        return state.all.map((entity, index) => {
          if (entity.id == action.id) {
            return Object.assign({}, entity, action.data)
          }
          return entity;
        })
    default:
      return state;
  }
};
