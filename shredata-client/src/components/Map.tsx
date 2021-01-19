import React, { Component } from 'react';
import '../App.css';
import { TileLayer, CircleMarker, MapContainer, Tooltip } from 'react-leaflet';

class Map extends Component {
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

    getIntervalSnowFallValueForRadius(interval: string, resort: any) {
        if (interval == '48 Hours') {
            return resort.snowreport.values.past48Hours != null ? resort.snowreport.values.past48Hours : 0;
        } else if (interval == '7 Days') {
            return resort.snowreport.values.past7Days != null ? resort.snowreport.values.past7Days : 0;
        } else if (interval == 'Base') {
            // 4 because base numbers are high
            return resort.snowreport.values.base != null ? resort.snowreport.values.base / 4 : 0;
        } else {
            return resort.snowreport.values.past24Hours;
        }
    }

    getIntervalSnowFallValueForTooltip(interval: string, resort: any) {
        if (interval == '48 Hours') {
            return resort.snowreport.values.past48Hours != null ? resort.snowreport.values.past48Hours : 0;
        } else if (interval == '7 Days') {
            return resort.snowreport.values.past7Days != null ? resort.snowreport.values.past7Days : 0;
        } else if (interval == 'Base') {
            return resort.snowreport.values.base != null ? resort.snowreport.values.base : 0;
        } else {
            return resort.snowreport.values.past24Hours;
        }
    }

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
                            center={[resort.latitude, resort.longitude]}
                            radius={10 + this.getIntervalSnowFallValueForRadius(interval, resort) / 1.4}
                            fillOpacity={0.5}
                            stroke={false}
                            eventHandlers={{
                                mouseover: function (e) {
                                    e.target._path.attributes['fill-opacity'].value = 1;
                                    // console.log(e);
                                    // console.log(this);
                                },
                                mouseout: function (e) {
                                    e.target._path.attributes['fill-opacity'].value = 0.5;
                                }
                            }}
                        >
                            <Tooltip>
                                <div>
                                    {/* <p style={{ fontSize: '13px', textAlign: 'center' }}> */}
                                    <b>{resort._id}</b>
                                    {/* </p> */}
                                    <br /> Past {interval}: {this.getIntervalSnowFallValueForTooltip(interval, resort)} cm
                                    {/* <br /> Timestamp: {resort.snowreport.updateTime} */}
                                </div>
                            </Tooltip>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        );
    }
}

export default Map;
