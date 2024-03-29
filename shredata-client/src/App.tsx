import React, { Component } from 'react';
import Map from './components/Map';
import TwentyFourHourSnowChart from './components/TwentyFourHourSnowChart';
import './App.css';
import Button from 'react-bootstrap/esm/Button';

type Endpoint = 'http://localhost:1337' | 'prod';

const getEndpoint = (): Endpoint => {
    if (process.env.NODE_ENV === 'production') {
        return 'prod';
    }
    return 'http://localhost:1337';
};

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
        interval: '24 Hours',
        mouseOverMap: this.mouseOverMap
    };

    mouseOverMap(e: any) {
        debugger;
        e.target._path.attributes['fill-opacity'].value = 1;
        console.log(e);
        console.log(this);
    }

    createBaseSnowfallSeries(resorts: any) {
        return resorts.map((resort: { _id: any; snowreport: { values: { base: any } } }) => {
            let snow = resort.snowreport.values.base ? !null : 'N/A';
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
                y: resort.snowreport.values.past48Hours != null ? resort.snowreport.values.past48Hours : 0
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
        const response = await fetch(`${getEndpoint()}/api/resorts/get/snowReportsByResort`);
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
                    <Map state={this.state} />
                    <TwentyFourHourSnowChart seriesData={this.createIntervalSnowfallSeries(this.state.interval, this.state.response.resorts)} interval={this.state.interval} />
                </main>
            </React.Fragment>
        );
    }
}
export default App;
