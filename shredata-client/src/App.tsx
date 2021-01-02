import React, { Component } from 'react';

import logo from './logo.svg';

import './App.css';
import { TileLayer, Marker, Popup, MapContainer } from 'react-leaflet';

class App extends Component {
    state = {
        response: '',
        post: '',
        responseToPost: ''
    };

    componentDidMount() {
        this.callApi()
            .then((res) => this.setState({ response: res.express }))
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

                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
                    <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        );
    }
}

export default App;
