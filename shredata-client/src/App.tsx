import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';
import { TileLayer, Marker, CircleMarker, Popup, MapContainer } from 'react-leaflet';

class App extends Component {
    state = {
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
        },
        post: '',
        responseToPost: ''
    };

    componentDidMount() {
        this.callApi()
            .then((res) => this.setState({ response: res }))
            .catch((err) => console.log(err));
    }

    callApi = async () => {
        const response = await fetch('/api/resorts/get/snowReportsByResort');
        const body = await response.json();
        if (response.status !== 200) throw Error(body.message);

        return body;
    };

    handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const response = await fetch('/api/world', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ post: this.state.post })
        });
        const body = await response.text();

        this.setState({ responseToPost: body });
    };

    render() {
        return (
            <div className="App">
                {/* <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                        Learn React
                    </a>
                </header>
                <p>{this.state.response}</p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        <strong>Post to Server:</strong>
                    </p>
                    <input type="text" value={this.state.post} onChange={(e) => this.setState({ post: e.target.value })} />
                    <button type="submit">Submit</button>
                </form>
                <p>{this.state.responseToPost}</p> */}

                <MapContainer center={[50.82793, -116.84341]} zoom={8} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    {this.state.response.resorts.map((resort) => (
                        <CircleMarker center={[resort.latitude, resort.longitude]} radius={10 + resort.snowreport.values.past24Hours / 1.4} fillOpacity={0.5} stroke={false}>
                            <Popup>
                                {resort._id} <br /> Snowfall: <br /> Past 24 Hours: {resort.snowreport.values.past24Hours} cm <br /> Past 48 Hrs: {resort.snowreport.values.past48Hours} cm <br /> Past
                                7 Days: {resort.snowreport.values.past7Days} cm
                            </Popup>
                        </CircleMarker>
                    ))}
                </MapContainer>
            </div>
        );
    }
}

export default App;
