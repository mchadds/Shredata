import React, { Component } from 'react';
import '../App.css';
import { TileLayer, Marker, CircleMarker, Popup, MapContainer, Tooltip, useMapEvents } from 'react-leaflet';
import { threadId } from 'worker_threads';

class Map extends Component {
    // this method can decide whether an ajax call should be made to get new data based on props and state objects
    //   componentDidUpdate(prevProps, prevState) {
    //     console.log('prevProps', prevProps);
    //     console.log('prevState', prevState);
    //     if (prevProps.counter.value !== this.props.counter.value) {
    //       // Ajax call and get new data
    //     }
    //   }
    //   // opportunity to do any clean up before componenet is removed from the DOM - otherwise will end up with memory leaks
    //   componentWillUnmount() {
    //     console.log('Counter - Unmount');
    //   }

    constructor(props: any) {
        super(props);
        this.props = props;
    }

    props = {
        state: {
            response: {
                resorts: [
                    {
                        _id: 0,
                        latitude: 0,
                        longitude: 0,
                        snowreport: {
                            updateTime: Date.now() - 1,
                            values: {
                                past24Hours: 0,
                                past48Hours: 0,
                                past7Days: 0,
                                base: 0
                            }
                        }
                    }
                ]
            },
            interval: '24 Hours'
        }
    };

    getIntervalSnowFallValue(interval: string, resort: any) {
        if (interval == '48 Hours') {
            return resort.snowreport.values.past48Hours ? !null : 0;
        } else if (interval == '7 Days') {
            return resort.snowreport.values.past7Days;
        } else if (interval == 'Base') {
            // 4 because base numbers are high
            return resort.snowreport.values.base / 4;
        } else {
            return resort.snowreport.values.past24Hours;
        }
    }

    onHover() {
        console.log('HEY');
    }

    //  map = useMapEvent('click', () => {
    //     map.setCenter([50.5, 30.5])
    //   })

    render() {
        const { interval } = this.props.state;
        const { resorts } = this.props.state.response;
        return (
            <div>
                <MapContainer center={[50.82793, -116.84341]} zoom={7.4} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {resorts.map((resort) => (
                        <CircleMarker
                            key={resort._id}
                            //mouseover={this.onHover}
                            center={[resort.latitude, resort.longitude]}
                            radius={10 + this.getIntervalSnowFallValue(interval, resort) / 1.4}
                            fillOpacity={0.5}
                            stroke={false}
                            // eventHandlers={{
                            //     mouseover: function (e) {
                            //         CircleMarker marker = e.target;
                            //         marker.setSyle({
                            //             fillOpacity: 1.0
                            //         });

                            //         console.log(e);
                            //         console.log(this);
                            //     }
                            //     // () => {
                            //     //this.onHover
                            //     //     console.log('marker clicked');
                            //     // }
                            // }}
                        >
                            {/* <Tooltip permanent={true} direction={'top'} className={'text 2'}>
                                {resort._id}
                            </Tooltip> */}
                            <Tooltip>
                                {resort._id} <br /> Snowfall: <br /> Past 24 Hours: {resort.snowreport.values.past24Hours} cm <br /> Past 48 Hrs: {resort.snowreport.values.past48Hours} cm <br /> Past
                                7 Days: {resort.snowreport.values.past7Days} cm <br /> Base: {resort.snowreport.values.base} cm <br /> Time of Recording: {resort.snowreport.updateTime}
                            </Tooltip>
                        </CircleMarker>
                    ))}
                    {/* <Marker
                        onMouseOver={(e) => {
                            return e.target.openPopup();
                        }}
                    ></Marker> */}
                </MapContainer>

                {/* <span
          style={{ marginRight: 2 + "em", marginLeft: 1 + "em", minWidth: 3 + "em" }}
          className={this.getBadgeClasses()}
        >
          {this.formatCount()}
        </span>
        <button
        // pass reference of counter object cause it will make the implementation of the handler simpler
          onClick={() => this.props.onIncrement(this.props.counter)}
          className="btn btn-secondary btn-sm m-2"
        >
          +
        </button>
        <button
        // pass reference of counter object cause it will make the implementation of the handler simpler
          onClick={() => this.props.onDecrement(this.props.counter)}
          className="btn btn-secondary btn-sm m-2"
        >
          -
        </button>
        <button onClick={() => this.props.onDelete(this.props.counter.id)} className="btn btn-danger btn-sm m-2">Delete</button> */}
            </div>
        );
    }

    // dynamically determine what to display in the count button
    //   formatCount() {
    //     const { value } = this.props.counter;
    //     return value === 0 ? "Zero" : value;
    //   }
}

export default Map;
