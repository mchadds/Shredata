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

    constructor(
        props: any
        //  {
        //     resorts: [
        //         {
        //             _id: 0,
        //             latitude: 0,
        //             longitude: 0,
        //             snowreport: {
        //                 values: {
        //                     past24Hours: 0,
        //                     past48Hours: 0,
        //                     past7Days: 0
        //                 }
        //             }
        //         }
        //     ]
        // }
    ) {
        super(props);
        this.props = props;
    }
    // componentDidMount() {
    //     // example of use
    //     this.internalChart.addSeries({ data: [1, 2, 3] })
    //   }

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

    create24HourSnowfallSeries(resorts: any) {
        const seriesTestData: [{}] = [{}];
        var obj = {};
        console.log(this.props);
        resorts.map((resort: { _id: any; snowreport: { values: { past24Hours: any } } }) => {
            console.log(resort);
            obj = {
                name: resort._id,
                y: resort.snowreport.values.past24Hours
            };

            seriesTestData.push(obj);
        });
        // "..." is the spread operator that clones the object
        //const counters = [...this.state.counters];
        console.log(seriesTestData);
        return seriesTestData;
    }

    // options: Highcharts.Options = {
    //     title: {
    //         text: 'Past 24 Hours Snowfall'
    //     },
    //     plotOptions: {
    //         column: {
    //             stacking: 'normal'
    //         }
    //     },

    //     series: [
    //         {
    //             type: 'column',
    //             name: 'Snowfall',
    //             data: this.create24HourSnowfallSeries()
    //         }
    //         // {
    //         //     type: 'column',
    //         //     name: 'Snowfall 2',
    //         //     data: [
    //         //         { name: 'one', y: 1 },
    //         //         { name: 'two', y: 2 }
    //         //     ]
    //         // }
    //     ]
    // };

    render() {
        const { resorts } = this.props;
        console.log(this.props);
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    //options={{...this.options}}

                    options={{
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
                                data: this.create24HourSnowfallSeries(resorts)
                            }
                        ]
                    }}
                    {...this.props}
                />
            </div>
        );
    }
}

export default TwentyFourHourSnowChart;
