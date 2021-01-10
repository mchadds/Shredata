import React, { Component } from 'react';
import '../App.css';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from 'typescript';

class TwentyFourHourSnowChart extends Component {
    options: Highcharts.Options;
    // The wrapper exports only a default component class that at the same time is a
    // namespace for the related Props interface (HighchartsReact.Props). All other
    // interfaces like Options come from the Highcharts module itself.

    constructor(props: any, options: Highcharts.Options) {
        super(props, options);
        this.props = props;
        this.options = options;
    }
    // componentDidMount() {
    //     // example of use
    //     this.internalChart.addSeries({ data: [1, 2, 3] })
    //   }

    // props = {
    //     resorts: [
    //         {
    //             _id: 0,
    //             latitude: 0,
    //             longitude: 0,
    //             snowreport: {
    //                 updateTime: Date.now() - 1,
    //                 values: {
    //                     past24Hours: 0,
    //                     past48Hours: 0,
    //                     past7Days: 0
    //                 }
    //             }
    //         }
    //     ]
    // };

    props = {
        seriesData: null,
        interval: ''
    };

    // create24HourSnowfallSeries(resorts: any) {
    //     return resorts.map((resort: { _id: any; snowreport: { values: { past24Hours: any } } }) => {
    //         return {
    //             name: resort._id,
    //             y: resort.snowreport.values.past24Hours
    //         };
    //     });
    // }

    createHighChartOptions(
        //resorts: any
        seriesData: any,
        interval: string
    ) {
        const options: Highcharts.Options = {
            chart: {
                height: '73%'
            },
            title: {
                text: 'Past ' + interval + ' Snowfall'
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
                    //allowPointSelect: true
                },
                series: {
                    borderWidth: 0,
                    dataLabels: {
                        enabled: true,
                        format: '{point.y} cm'
                    }
                }
            },
            tooltip: {
                pointFormat: '<span>Snowfall</span>: <b>{point.y} cm</b>'
            },
            xAxis: {
                type: 'category',
                title: {
                    text: 'Resorts'
                }
            },
            yAxis: {
                title: {
                    text: 'Snow'
                },
                labels: {
                    format: '{value} cm'
                }
            },
            series: [
                {
                    type: 'column',
                    name: 'Snowfall',
                    data: seriesData,
                    //data: this.create24HourSnowfallSeries(resorts)
                    point: {
                        events: {
                            click: (e) => {
                                console.log(e.point.name);
                                console.log(this);
                                //e.point.color = '#a4edba';
                            }
                        }
                    }
                }
            ],
            legend: {
                enabled: false
            }
        };
        return options;
    }

    render() {
        // const { resorts } = this.props;
        // this.options = this.createHighChartOptions(resorts);
        const { seriesData, interval } = this.props;
        this.options = this.createHighChartOptions(seriesData, interval);
        console.log(this.props);
        return (
            <div style={{ width: '45%', float: 'left', border: '4px solid silver', marginTop: '5vh' }}>
                <HighchartsReact highcharts={Highcharts} options={{ ...this.options }} {...this.props} />
            </div>
        );
    }
}

export default TwentyFourHourSnowChart;
