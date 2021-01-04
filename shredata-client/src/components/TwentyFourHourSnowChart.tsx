import React, { Component } from 'react';
import '../App.css';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

class TwentyFourHourSnowChart extends Component {
    // The wrapper exports only a default component class that at the same time is a
    // namespace for the related Props interface (HighchartsReact.Props). All other
    // interfaces like Options come from the Highcharts module itself.

    options: Highcharts.Options = {
        title: {
            text: 'My chart'
        },
        series: [
            {
                type: 'bar',
                data: [1, 2, 3]
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
