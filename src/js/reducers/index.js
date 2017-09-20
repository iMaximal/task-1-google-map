import { combineReducers } from 'redux'
import map from './google_map'
import markers from './markers'

export default combineReducers({
    map,
    markers
})
