import React, { Component } from 'react';
import Map from './components/Map';

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
            <React.Fragment>
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

                <Map resorts={this.state.response.resorts} />
            </React.Fragment>
        );
    }
}
export default App;
