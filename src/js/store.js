import { createStore, applyMiddleware } from 'redux'
import rootReducer from './reducers'
import createHistory from 'history/createBrowserHistory'
import { createLogger } from 'redux-logger'

const DEBUG = process.env.NODE_ENV !== 'production'

export const history = createHistory()
export const store = createStore(
    rootReducer,
    applyMiddleware(
    DEBUG ? createLogger() : () => next => action => next(action)
))
