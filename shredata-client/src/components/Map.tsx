import React, { Component } from 'react';
import '../App.css';
import { TileLayer, Marker, CircleMarker, Popup, MapContainer } from 'react-leaflet';

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

    props = {
        response: {
            resorts: [
                {
                    _id: 0,
                    latitude: 0,
                    longitude: 0,
                    snowreport: {
                        values: {
                            past24Hours: 0,
                            past48Hours: 0,
                            past7Days: 0
                        }
                    }
                }
            ]
        }
    };

    render() {
        return (
            <div>
                <MapContainer center={[50.82793, -116.84341]} zoom={8} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {this.props.response.resorts.map((resort) => (
                        <CircleMarker center={[resort.latitude, resort.longitude]} radius={10 + resort.snowreport.values.past24Hours / 1.4} fillOpacity={0.5} stroke={false}>
                            <Popup>
                                {resort._id} <br /> Snowfall: <br /> Past 24 Hours: {resort.snowreport.values.past24Hours} cm <br /> Past 48 Hrs: {resort.snowreport.values.past48Hours} cm <br /> Past
                                7 Days: {resort.snowreport.values.past7Days} cm
                            </Popup>
                        </CircleMarker>
                    ))}
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
