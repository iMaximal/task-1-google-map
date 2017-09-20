import React, {PureComponent} from "react"
import {connect} from 'react-redux'
import {
    changePoint,
    finishEdit
} from '../actions'

@connect(({map}) => ({map}))
export default class NewPoint extends PureComponent {

    constructor(props) {
        super(props)

        this.state = {
            pointName: '',
        }
    }

    /**
     * Write input for Point (new / exist) to Local state
     * @param event
     */
    handleChangePoint = (event) => {
        const {value} = event.target
        this.setState({
            pointName: value
        })
    }

    /**
     * Save New Point Name (from Local state to Global state)
     * @param event
     */
    newPointSave = (event) => {
        event.preventDefault()

        const pointName = this.state.pointName.trim() || 'Забыли назвать точку :-('
        this.props.onPointSave(event, pointName)
        this.setState({
            pointName: ''
        })
    }

    render() {

        const {pointName} = this.state
        const {newPoint} = this.props.map

        return (
            <li data-id={newPoint}
                className="right-side__point">
                <div className="edit-li">
                    <form onSubmit={this.newPointSave}>
                                    <textarea autoFocus type="text"
                                              className="edit-area"
                                              onChange={this.handleChangePoint}
                                              value={pointName}
                                    >
                                    </textarea>
                        <div className="edit-controls">
                            <button
                                className="edit-ok">OK
                            </button>
                        </div>
                    </form>
                </div>
                <div id="box"></div>
            </li>
        )
    }
}
