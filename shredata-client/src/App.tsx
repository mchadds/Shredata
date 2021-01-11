import React, { Component } from 'react';
import Map from './components/Map';
import TwentyFourHourSnowChart from './components/TwentyFourHourSnowChart';
import FourtyEightHourSnowChart from './components/FourtyEightHourSnowChart';
import SevenDaySnowChart from './components/SevenDaySnowChart';
import IntervalSnowChartComparison from './components/IntervalSnowChartComparison';
import './App.css';
import { format } from 'highcharts';
import { SelectCallback } from 'react-bootstrap/esm/helpers';
import ButtonGroup from 'react-bootstrap/esm/ButtonGroup';
import Button from 'react-bootstrap/esm/Button';

class App extends Component {
    state = {
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
        post: '',
        responseToPost: '',
        interval: '24 Hours'
    };

    createBaseSnowfallSeries(resorts: any) {
        return resorts.map((resort: { _id: any; snowreport: { values: { base: any } } }) => {
            return {
                name: resort._id,
                y: resort.snowreport.values.base
            };
        });
    }

    create24HourSnowfallSeries(resorts: any) {
        return resorts.map((resort: { _id: any; snowreport: { values: { past24Hours: any } } }) => {
            return {
                name: resort._id,
                y: resort.snowreport.values.past24Hours
            };
        });
    }

    create48HourSnowfallSeries(resorts: any) {
        return resorts.map((resort: { _id: any; snowreport: { values: { past48Hours: any } } }) => {
            return {
                name: resort._id,
                y: resort.snowreport.values.past48Hours
            };
        });
    }

    create7DaySnowfallSeries(resorts: any) {
        return resorts.map((resort: { _id: any; snowreport: { values: { past7Days: any } } }) => {
            return {
                name: resort._id,
                y: resort.snowreport.values.past7Days
            };
        });
    }

    createIntervalSnowfallSeries(interval: string, resorts: any) {
        if (interval == '48 Hours') {
            return this.create48HourSnowfallSeries(resorts);
        } else if (interval == '7 Days') {
            return this.create7DaySnowfallSeries(resorts);
        } else if (interval == 'Base') {
            return this.createBaseSnowfallSeries(resorts);
        } else {
            return this.create24HourSnowfallSeries(resorts);
        }
    }

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

    handleIntervalSelect(e: any) {
        const state = this.state;
        state.interval = e;
        //this.state.interval = e.eventKey;
        this.setState({ state });
        //return e;
    }

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
                <main className="container">
                    <h1 style={{ color: 'white' }}>Snow Intelligence</h1>
                    {/* <ButtonGroup style={{ marginTop: '5vh' }} size="lg" className="mb-2"> */}
                    <Button style={{ border: '2px solid black', marginTop: '5vh', marginRight: '1%' }} onClick={() => this.handleIntervalSelect('24 Hours')}>
                        24 Hours
                    </Button>
                    <Button style={{ border: '2px solid black', marginTop: '5vh', marginRight: '1%' }} onClick={() => this.handleIntervalSelect('48 Hours')}>
                        48 Hours
                    </Button>
                    <Button style={{ border: '2px solid black', marginTop: '5vh', marginRight: '1%' }} onClick={() => this.handleIntervalSelect('7 Days')}>
                        7 Days
                    </Button>
                    <Button style={{ border: '2px solid black', marginTop: '5vh' }} onClick={() => this.handleIntervalSelect('Base')}>
                        Base
                    </Button>
                    {/* </ButtonGroup> */}
                    {/* <button onClick={() => this.handleDropdownSelect('24 Hours')}>24 Hours</button>
                    <button onClick={() => this.handleDropdownSelect('48 Hours')}>48 Hours</button>
                    <button onClick={() => this.handleDropdownSelect('7 Days')}>7 Days</button> */}
                    {/* <IntervalDropdown
                        //onSelect={this.handleDropdownSelect(this.state)}
                        handleDropdownSelect={(e: any) => this.handleDropdownSelect(e)}
                        // handleDropdownSelect={this.handleDropdownSelect()}
                    /> */}
                    <Map state={this.state} />
                    {/* <TwentyFourHourSnowChart resorts={this.state.response.resorts} /> */}
                    <TwentyFourHourSnowChart seriesData={this.createIntervalSnowfallSeries(this.state.interval, this.state.response.resorts)} interval={this.state.interval} />
                    {/* <FourtyEightHourSnowChart resorts={this.state.response.resorts} /> */}
                    {/* <SevenDaySnowChart resorts={this.state.response.resorts} /> */}
                    {/* <IntervalSnowChartComparison resorts={this.state.response.resorts} /> */}
                </main>
            </React.Fragment>
        );
    }
}
export default App;
