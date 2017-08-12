import React, {Component} from 'react'
import {connect} from 'react-redux'
import PointItem from './PointItem'
import {
    addPoint,
    changePoint } from '../actions'


@connect(({markers}) => ({markers}))
export default class GoogleMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapInitialized: false,
            newPoint: false,
            pointName: '',
            editablePoint: null,
            checkedPoint: null
        }
        this._mapContainer = null
        this._map = null
        this._infoWindow = null
    }

    // Adds a marker to the map and push to the array (Global store).
    addMarker = location => {
        let markerId = Date.now() + Math.random().toString()
        let marker = new window.google.maps.Marker({
            position: location,
            map: this._map,
            draggable: true,
            animation: window.google.maps.Animation.DROP,
            id: markerId,
            name: '',
            notes: []
        })

        marker.addListener('click', () => {
            let contentString = marker.name
            // Set the info window's content and position.
            this._infoWindow.setContent(contentString)
            this._infoWindow.open(this._map, marker)
            this.markPointFromMap(marker)
        })

        this.setState(prevState => ({
            newPoint: markerId
        }))

        this.props.dispatch(addPoint(marker))

    }

    /**
     *  If click on Map -> Mark checked Point in List
     * @param id - Point id
     */
    markPointFromMap = ({id}) => {
        this.setState({
            checkedPoint: id
        })
    }

    /**
     * If click on List -> Mark & Center map
     * @param event
     */
    markPointFromList = event => {
        let pointId = event.currentTarget.dataset.id
        if (this.state.checkedPoint !== pointId) {
            this.setState({
                checkedPoint: pointId
            })
        }

        let elem = this.props.markers.find(point => point.id === pointId)
        this._map.setCenter(elem.position)
    }

    /**
     * Save New Point Name (from Local state to Global state)
     * @param event
     */
    handlePointSave = event => {
        event.preventDefault()

        const pointName = this.state.pointName.trim() || 'Забыли назвать точку :-('
        const id = event.target.parentNode.parentNode.dataset.id

        this.props.dispatch( changePoint(id, pointName) )

        this.setState({
            newPoint: false,
            pointName: '',
            editablePoint: null
        })
    }

    /**
     * Write input for Point (new / exist) to Local state
     * @param event
     */
    handleChangePoint = event => {
        const {value} = event.target
        this.setState({
            pointName: value
        })
    }

    /**
     * If click Edit Point -> Local state mark Point editable
     */
    handlePointEditing = (id, name) => {
        this.setState({
            editablePoint: id,
            pointName: name
        })
    }

    /**
     * Create Map Object if Google API loaded
     * @private
     */
    _initMap() {

        this._map = new window.google.maps.Map(this._mapContainer, {
            zoom: 14,
            center: {lat: 56.840375, lng: 60.568951},
            mapTypeId: 'terrain'
        })

        this.setState({mapInitialized: true})

        // Define an info window on the map.
        this._infoWindow = new window.google.maps.InfoWindow()

        // This event listener will call addMarker() when the map is clicked.
        this._map.addListener('click', event => {
                // if editable field is exist -> nothing
                if (this.state.editablePoint || this.state.editableNote) return
                this.addMarker(event.latLng)
            }
        )

    }

    render() {
        if (this.props.gapiLoaded && !this.state.mapInitialized) {
            setTimeout(() => {
                this._initMap()
            }, 4)
        }

        const {markers} = this.props
        const {pointName} = this.state
        const {newPoint} = this.state

        return (

            <div style={{height: `100%`}}>
                {/**
                 * Show the Google map
                 */}
                <div ref={(map) => {
                    this._mapContainer = map
                }} className="main"/>

                {/**
                * Points and their Notes
                */}
                <div id="right-side">
                    <ul className="right-side__list">
                        {/**
                        * If New Point -> Show form -> Ask Point name
                        */}
                        {newPoint && <li data-id={newPoint}
                                         className="right-side__point">
                            <div className="edit-li">
                                <form onSubmit={this.handlePointSave}>
                                    <textarea autoFocus type="text"
                                              className="edit-area"
                                              onChange={this.handleChangePoint}
                                              value={pointName}>
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
                        }

                        {/**
                        * Show exist Points
                        */}
                        {markers.map(point =>
                            <PointItem key={point.id}
                                       point={point}
                                       onMarkPointFromList={this.markPointFromList}
                                       checkedPoint={this.state.checkedPoint}
                                       editablePoint={this.state.editablePoint}
                                       pointName={this.state.pointName}
                                       onPointEditable={this.handlePointEditing}
                                       onChangePoint={this.handleChangePoint}
                                       onPointSave={this.handlePointSave}
                            />
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}


