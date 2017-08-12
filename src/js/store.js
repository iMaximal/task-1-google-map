import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { createLogger } from 'redux-logger'
import * as reducers from './reducers'

const DEBUG = process.env.NODE_ENV !== 'production'

export const history = createHistory()
export const store = createStore(combineReducers({
    ...reducers
}), applyMiddleware(
    DEBUG ? createLogger() : () => next => action => next(action)
))
