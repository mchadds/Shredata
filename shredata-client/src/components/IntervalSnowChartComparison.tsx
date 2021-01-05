import React, { Component } from 'react';
import '../App.css';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { ResolvedTypeReferenceDirectiveWithFailedLookupLocations } from 'typescript';

class IntervalSnowChartComparison extends Component {
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

    // create7DaySnowfallSeries(resorts: any) {
    //     const series7DayData: [{}] = [{}];
    //     var resort7Day = {};
    //     resorts.map((resort: { _id: any; snowreport: { values: { past7Days: any } } }) => {
    //         resort7Day = {
    //             name: resort._id,
    //             y: resort.snowreport.values.past7Days
    //         };

    //         series7DayData.push(resort7Day);
    //     });
    //     console.log(series7DayData);
    //     return series7DayData;
    // }

    // create48HourSnowfallSeries(resorts: any) {
    //     const series48HourData: [{}] = [{}];
    //     var resort48Hour = {};
    //     resorts.map((resort: { _id: any; snowreport: { values: { past48Hours: any } } }) => {
    //         resort48Hour = {
    //             name: resort._id,
    //             y: resort.snowreport.values.past48Hours
    //         };

    //         series48HourData.push(resort48Hour);
    //     });
    //     console.log(series48HourData);
    //     return series48HourData;
    // }

    // create24HourSnowfallSeries(resorts: any) {
    //     const series24HourData: [{}] = [{}];
    //     var resort24Hour = {};
    //     resorts.map((resort: { _id: any; snowreport: { values: { past24Hours: any } } }) => {
    //         resort24Hour = {
    //             name: resort._id,
    //             y: resort.snowreport.values.past24Hours
    //         };

    //         series24HourData.push(resort24Hour);
    //     });
    //     console.log(series24HourData);
    //     return series24HourData;
    // }

    createCategories(resorts: any) {
        const seriesCategories: string[] = [];
        var resortName = '';
        resorts.map((resort: { _id: any }) => {
            resortName = resort._id;

            seriesCategories.push(resortName);
        });
        return seriesCategories;
    }

    createSeriesSnowfallData(resorts: any) {
        const seriesSnowfallData: Highcharts.SeriesOptionsType[] = [];
        var allResortsSnowfall: Highcharts.SeriesOptionsType;
        resorts.map((resort: { _id: any; snowreport: { values: { past24Hours: number; past48Hours: number; past7Days: number } } }) => {
            allResortsSnowfall = {
                type: 'column',
                name: resort._id,
                data: [resort.snowreport.values.past24Hours, resort.snowreport.values.past48Hours, resort.snowreport.values.past7Days]
            };

            seriesSnowfallData.push(allResortsSnowfall);
        });
        console.log(seriesSnowfallData);
        return seriesSnowfallData;
    }

    createHighChartOptions(resorts: any) {
        const options: Highcharts.Options = {
            title: {
                text: 'Snowfall Interval Comparison'
            },
            xAxis: {
                categories: this.createCategories(resorts),
                crosshair: true
            },
            yAxis: {
                title: {
                    text: 'Snow'
                },
                labels: {
                    format: '{value} cm'
                }
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
                // series: {
                //     borderWidth: 0,
                //     dataLabels: {
                //         enabled: true,
                //         format: '{point.y} cm'
                //     }
                // }
            },
            tooltip: {
                pointFormat: '<span>Snowfall</span>: <b>{point.y} cm</b>'
            },
            series: this.createSeriesSnowfallData(resorts)
            // legend: {
            //     enabled: true
            // }
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

export default IntervalSnowChartComparison;
