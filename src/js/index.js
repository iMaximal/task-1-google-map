import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'react-router-redux'
import { Route, Switch, Redirect } from 'react-router-dom'


import { store, history } from './store'
import * as routes from './components'

render(
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <div className="app">
                <Switch>
                    <Route exact path="/" component={routes.Main} />
                    <Redirect to="/" />
                </Switch>
            </div>
        </ConnectedRouter>
    </Provider>,
document.getElementById('app'))
