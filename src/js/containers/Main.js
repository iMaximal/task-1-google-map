import React, {Component} from 'react'
import {connect} from 'react-redux'
import GoogleMap from '../components/GoogleMap'
import {
    ApiLoaded
} from '../actions/MainActions'

@connect(({map}) => ({map}))
export default class Main extends Component {
    constructor(props) {
        super(props)

    }

    /**
     * If Google Maps API loaded -> Change local state -> Transfer state as prop to Child component
     */
    componentWillMount() {
        this.loadApiScript().then(() => {
            this.props.dispatch(ApiLoaded(true))
        })
    }

    loadApiScript() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script')

            script.type = 'text/javascript'
            script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyD54W7M8hb_hKeVYG9yEh0z1SJJvbRv59A'
            script.defer = true
            script.onload = resolve
            script.onerror = reject

            document.head.appendChild(script)
        })
    }

    render() {
        return (
            <GoogleMap gApiLoaded={this.props.map.gApiLoaded}/>
        )
    }
}


