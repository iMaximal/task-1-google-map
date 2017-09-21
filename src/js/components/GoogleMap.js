import React, {Component} from 'react'
import {connect} from 'react-redux'
import NewPoint from './NewPoint'
import PointItem from './PointItem'
import {
    addPoint,
    changePoint,
    checkPoint,
    changeMapStore,
    isNewPoint,
    mapLoaded
} from '../actions'


@connect(({map, markers}) => ({map, markers}))
export default class GoogleMap extends Component {
    constructor(props) {
        super(props)

        this._mapContainer = null
        this._map = null
        this._infoWindow = null
    }

    // Adds a marker to the map and push to the array (Global store).
    addMarker = (location) => {
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
            const contentString = marker.name
            // Set the info window's content and position.
            this._infoWindow.setContent(contentString)
            this._infoWindow.open(this._map, marker)
            this.markPointFromMap(marker)
        })

        this.props.dispatch(addPoint(marker))
        this.props.dispatch(isNewPoint(markerId))

    }

    /**
     *  If click on Map -> Mark checked Point in List
     * @param id - Point id
     */
    markPointFromMap = ({id}) => {
        this.props.dispatch(checkPoint(id))
    }

    /**
     * If click on List -> Mark & Center map
     * @param event
     */
    markPointFromList = (event) => {
        const pointId = event.currentTarget.dataset.id

        if (this.props.map.checkedPoint !== pointId) {
            this.props.dispatch(checkPoint(pointId))
        }

        const elem = this.props.markers.find(point => point.id === pointId)
        this._map.setCenter(elem.position)
    }

    handlePointSave = (event, pointName) => {
        event.preventDefault()

        const id = event.target.parentNode.parentNode.dataset.id

        this.props.dispatch(changePoint(id, pointName))
        this.props.dispatch(changeMapStore({
            newPoint: false,
            editablePoint: null
        }))

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

        this.props.dispatch(mapLoaded(true))

        // Define an info window on the map.
        this._infoWindow = new window.google.maps.InfoWindow()

        // This event listener will call addMarker() when the map is clicked.
        this._map.addListener('click', (event) => {
            // if editable field is exist -> nothing
            if (this.props.map.editablePoint || this.props.map.editableNote) return // todo
            this.addMarker(event.latLng)
        }
        )

    }

    render() {
        if (this.props.map.gApiLoaded && !this.props.map.mapInitialized) { //todo
            setTimeout(() => {
                this._initMap()
            }, 4)
        }

        const {markers} = this.props
        const {newPoint} = this.props.map

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
                        {newPoint && <NewPoint onPointSave={this.handlePointSave} />}

                        {/**
                         * Show exist Points
                         */}
                        {markers.map(point =>
                            <PointItem key={point.id}
                                       point={point}
                                       onMarkPointFromList={this.markPointFromList}
                                       onPointSave={this.handlePointSave}
                            />
                        )}
                    </ul>
                </div>
            </div>
        )
    }
}


