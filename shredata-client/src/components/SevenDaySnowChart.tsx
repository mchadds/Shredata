import React, { Component } from 'react';
import '../App.css';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from 'typescript';

class SevenDaySnowChart extends Component {
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

    props = {
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
                        past7Days: 0
                    }
                }
            }
        ]
    };

    create7DaySnowfallSeries(resorts: any) {
        const series7DayData: [{}] = [{}];
        var resort7Day = {};
        console.log(this.props);
        resorts.map((resort: { _id: any; snowreport: { values: { past7Days: any } } }) => {
            console.log(resort);
            resort7Day = {
                name: resort._id,
                y: resort.snowreport.values.past7Days
            };

            series7DayData.push(resort7Day);
        });
        console.log(series7DayData);
        return series7DayData;
    }

    createHighChartOptions(resorts: any) {
        const options: Highcharts.Options = {
            title: {
                text: 'Past 7 Days Snowfall'
            },
            plotOptions: {
                column: {
                    stacking: 'normal'
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
                    data: this.create7DaySnowfallSeries(resorts)
                }
            ],
            legend: {
                enabled: false
            }
        };
        return options;
    }

    render() {
        const { resorts } = this.props;
        this.options = this.createHighChartOptions(resorts);
        return (
            <div style={{ width: '55%' }}>
                <HighchartsReact highcharts={Highcharts} options={{ ...this.options }} {...this.props} />
            </div>
        );
    }
}

export default SevenDaySnowChart;
