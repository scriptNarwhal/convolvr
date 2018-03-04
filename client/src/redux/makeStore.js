import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

import { combineReducers } from 'redux'
import app from './reducers/app'
import spaces from './reducers/world'
import places from './reducers/place'
import entities from './reducers/entity'
import components from './reducers/component'
import users from './reducers/user'
import avatars from './reducers/avatar'
import messages from './reducers/message'
import files from './reducers/file'
import util from './reducers/util'
import inventory from './reducers/inventory'

export default function configureStore(router, initialState = {}) {
  return createStore(
        combineReducers({
            routing: router,
                     app,
                     util,
                     spaces,
                     places,
                     components,
                     users,
                     avatars,
                     entities,
                     messages,
                     files,
                     inventory
        }),
        initialState,
        applyMiddleware(
            ReduxThunk,
            loggerMiddleware
        )
  )
}
