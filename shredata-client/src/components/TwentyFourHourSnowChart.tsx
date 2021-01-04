import React, { Component } from 'react';
import '../App.css';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from 'typescript';

class TwentyFourHourSnowChart extends Component {
    // The wrapper exports only a default component class that at the same time is a
    // namespace for the related Props interface (HighchartsReact.Props). All other
    // interfaces like Options come from the Highcharts module itself.

    props = {
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
    };

    // create24HourSnowfallSeries = () => {
    //     seriesTest: Highcharts.Series;

    //     this.props.resorts.forEach(resort => (
    //         resortSnow: {
    //             name:
    //         }
    //     ));
    //     // "..." is the spread operator that clones the object
    //     const counters = [...this.state.counters];
    //     let i = 0;
    //     counters.forEach(c => i+= c.value);
    //     return i;
    //   }

    options: Highcharts.Options = {
        title: {
            text: 'Past 24 Hours Snowfall'
        },
        plotOptions: {
            column: {
                stacking: 'normal'
            }
        },

        series: [
            {
                type: 'column',
                name: 'Snowfall',
                data: [
                    { name: 'one', y: 1 },
                    { name: 'two', y: 2 }
                ]
            },
            {
                type: 'column',
                name: 'Snowfall 2',
                data: [
                    { name: 'one', y: 1 },
                    { name: 'two', y: 2 }
                ]
            }
        ]
    };

    render() {
        return (
            <div>
                <HighchartsReact highcharts={Highcharts} options={this.options} {...this.props} />
            </div>
        );
    }
}

export default TwentyFourHourSnowChart;
