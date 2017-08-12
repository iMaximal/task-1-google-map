import 'babel-polyfill'
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import Main from './containers/Main'
import { store, history } from './store'


render(
    <Provider store={store}>
        <div className="app">
            <Main />
        </div>
    </Provider>,
document.getElementById('app'))
