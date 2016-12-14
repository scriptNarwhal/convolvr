import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import createLogger from 'redux-logger'
const loggerMiddleware = createLogger()

import { combineReducers } from 'redux'
import app from './reducers/app'
import entities from './reducers/entity'
import components from './reducers/component'
import structures from './reducers/structure'
import tools from './reducers/tool'
import users from './reducers/user'
import npcs from './reducers/npc'
import avatars from './reducers/avatar'
import pages from './reducers/page'
import messages from './reducers/message'
import files from './reducers/file'

export default function configureStore(router, initialState = {}) {
  return createStore(
        combineReducers({
            routing: router,
                     app,
                     components,
                     structures,
                     users,
                     npcs,
                     avatars,
                     tools,
                     entities,
                     pages,
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
