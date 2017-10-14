import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

import { combineReducers } from 'redux'
import app from './reducers/app'
import worlds from './reducers/world'
import places from './reducers/place'
import entities from './reducers/entity'
import components from './reducers/component'
import users from './reducers/user'
import avatars from './reducers/avatar'
import messages from './reducers/message'
import files from './reducers/file'
import util from './reducers/util'

export default function configureStore(router, initialState = {}) {
  return createStore(
        combineReducers({
            routing: router,
                     app,
                     util,
                     worlds,
                     places,
                     components,
                     users,
                     avatars,
                     entities,
                     messages,
                     files
        }),
        initialState,
        applyMiddleware(
            ReduxThunk,
            loggerMiddleware
        )
  )
}
