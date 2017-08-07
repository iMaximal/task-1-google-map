import { routerReducer, routerMiddleware } from 'react-router-redux'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import createHistory from 'history/createBrowserHistory'
import { createLogger } from 'redux-logger'
import * as reducers from './reducers'

const DEBUG = process.env.NODE_ENV !== 'production'

export const history = createHistory()
export const store = createStore(combineReducers({
    ...reducers,
    router: routerReducer
}), applyMiddleware(
    routerMiddleware(history),
    DEBUG ? createLogger() : () => next => action => next(action)
))