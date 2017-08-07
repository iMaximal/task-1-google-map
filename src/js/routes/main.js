import React, {Component} from 'react'
import {connect} from 'react-redux'
import GoogleMap from './google_map'

@connect(({map}) => ({map}))
export default class Main extends Component {
    constructor(props) {
        super(props)

        this.state = {
            gapiLoaded: false,
        }
    }

    componentDidMount() {
        this.timerID = setInterval(() => {
            if (window.google) {
                this.setState({gapiLoaded: true})
                clearInterval(this.timerID)
            }
        }, 150)
    }

    componentWillUnmount() {
        clearInterval(this.timerID)
    }


    render() {
        return (
            <GoogleMap gapiLoaded={this.state.gapiLoaded} />
        )
    }
}

// export default connect(state => {
//     return {
//         map: state.map
//     }
// })(Main)
