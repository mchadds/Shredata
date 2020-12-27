// import React from 'react';
// import ReactDOM from 'react-dom';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// The wrapper exports only a default component class that at the same time is a
// namespace for the related Props interface (HighchartsReact.Props). All other
// interfaces like Options come from the Highcharts module itself.

const options: Highcharts.Options = {
    title: {
        text: 'My chart'
    },
    series: [
        {
            type: 'line',
            data: [1, 2, 3]
        }
    ]
};

// React supports function components as a simple way to write components that
// only contain a render method without any state (the App component in this
// example).

const App = (props: HighchartsReact.Props) => (
    <div>
        <HighchartsReact highcharts={Highcharts} options={options} {...props} />
    </div>
);

// Render your App component into the #root element of the document.

ReactDom.render(<App />, document.getElementById('root'));
