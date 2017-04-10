import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

import { combineReducers } from 'redux'
import app from './reducers/app'
import worlds from './reducers/world'
import entities from './reducers/entity'
import components from './reducers/component'
import users from './reducers/user'
import avatars from './reducers/avatar'
import messages from './reducers/message'
import files from './reducers/file'
import network from './reducers/network'

export default function configureStore(router, initialState = {}) {
  return createStore(
        combineReducers({
            routing: router,
                     app,
                     worlds,
                     components,
                     users,
                     avatars,
                     entities,
                     messages,
                     network,
                     files
        }),
        initialState,
        applyMiddleware(
            ReduxThunk,
            loggerMiddleware
        )
  )
}
