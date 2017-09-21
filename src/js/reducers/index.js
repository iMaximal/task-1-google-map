import { combineReducers } from 'redux'
import map from './map'
import markers from './markers'

export default combineReducers({
    map,
    markers
})
