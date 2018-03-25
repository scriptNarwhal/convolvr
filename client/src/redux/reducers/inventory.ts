import {
    INVENTORY_SET_CURRENT,
    INVENTORY_ADD_FETCH,
    INVENTORY_ADD_DONE,
    INVENTORY_ADD_FAIL,
    INVENTORY_FETCH,
    INVENTORY_FETCH_DONE,
    INVENTORY_FETCH_FAIL,
    INVENTORY_ITEM_FETCH,
    INVENTORY_ITEM_FETCH_DONE,
    INVENTORY_ITEM_FETCH_FAIL,
    INVENTORY_UPDATE_FETCH,
    INVENTORY_UPDATE_DONE,
    INVENTORY_UPDATE_FAIL,
    INVENTORY_DELETE_FETCH,
    INVENTORY_DELETE_DONE,
    INVENTORY_DELETE_FAIL,
    INVENTORY_ADD_TO_SPACE_FETCH,
    INVENTORY_ADD_TO_SPACE_DONE,
    INVENTORY_ADD_TO_SPACE_FAIL
} from '../constants/action-types'
import { detectSpaceDetailsFromURL } from '../../config'

module.exports = function places (state = {
    items: {
        entities: [],
        components: [],
        attrerties: []
    },
    itemFetching: false,
    entitiesFetching: false,
    componentsFetching: false,
    attrertiesFetching: false,
    item: {
        component: false,
        entity: false,
        attribute: false
    },
    updated: false,
    created: false,
    deleted: false,
    addedToSpace: false,
    error: false,
    fetching: false
}, action) {
  switch (action.type) {
    case INVENTORY_ADD_FETCH:
      return Object.assign({}, state, {
          fetching: true
      })
    case INVENTORY_ADD_DONE:
      return Object.assign({}, state, {
          created: action.data,
          fetching: false
      })
    case INVENTORY_ADD_FAIL:
      return Object.assign({}, state, {
          fetching: false,
          error: action.err
      })
    case INVENTORY_FETCH:
    case INVENTORY_FETCH_FAIL:
      let newState = {},
          isFetching = action.type == INVENTORY_FETCH

      switch ( action.category ) {
          case "Entities":
            newState.entitiesFetching = isFetching
          break
          case "Components":
            newState.componentsFetching = isFetching
          break
          case "Properties":
            newState.attrertiesFetching = isFetching
          break
      }

      return Object.assign({}, state, newState )
    case INVENTORY_FETCH_DONE:
      switch( action.category ) {
          case "Entities":
            three.world.systems.assets.addUserEntities(action.data)
            return Object.assign({}, state, {
                items: {
                    ...state.items,
                    entities: action.data
                },
                entitiesFetching: false
            })
          break
          case "Components":
            three.world.systems.assets.addUserComponents(action.data)
            return Object.assign({}, state, {
                items: {
                    ...state.items,
                    components: action.data
                },
                componentsFetching: false
            })
          break
          case "Properties":
            return Object.assign({}, state, {
                items: {
                    ...state.items,
                    attrerties: action.data
                },
                attrertiesFetching: false
            })
          break
      }
    case INVENTORY_ITEM_FETCH:
      return Object.assign({}, state, {
          itemFetching: true
      })
    case INVENTORY_ITEM_FETCH_FAIL:
      return Object.assign({}, state, {
          itemFetching: false,
          error: action.err
      })
    case INVENTORY_ITEM_FETCH_DONE:
      switch( action.category ) {
          case "Entities":
            return Object.assign({}, state, {
                item: {
                    ...state.item,
                    entity: action.data
                },
                itemFetching: false
            })
          break
          case "Components":
            return Object.assign({}, state, {
                item: {
                    ...state.item,
                    component: action.data
                },
                itemFetching: false
            })
          break
          case "Properties":
            return Object.assign({}, state, {
                item: {
                    ...state.item,
                    attribute: action.data
                },
                itemFetching: false
            })
          break
      }
    case INVENTORY_UPDATE_FETCH:
      return Object.assign({}, state, {
          fetching: true,
          updated: false
      })
    case INVENTORY_UPDATE_DONE:
      return Object.assign({}, state, {
          updated: action.updated,
          fetching: false
      })
    case INVENTORY_UPDATE_FAIL:
      return Object.assign({}, state, {
          error: action.err,
          fetching: false
      })
    case INVENTORY_DELETE_FETCH:
      return Object.assign({}, state, {
          fetching: true,
          deleted: false
      })
    case INVENTORY_DELETE_DONE:
      return Object.assign({}, state, {
          deleted: action.data,
          fetching: false
      })
    case INVENTORY_DELETE_FAIL:
      return Object.assign({}, state, {
          error: action.err,
          fetching: false
      })
    case INVENTORY_ADD_TO_SPACE_FETCH:
      return Object.assign({}, state, {
          fetching: true,
          addedToSpace: false
      })
    case INVENTORY_ADD_TO_SPACE_DONE:
      return Object.assign({}, state, {
          addedToSpace: action.data,
          fetching: false
      })
    case INVENTORY_ADD_TO_SPACE_FAIL:
      return Object.assign({}, state, {
          error: action.err,
          fetching: false
      })   
    default:
      return state;
  }
};
