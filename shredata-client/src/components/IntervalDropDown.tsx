import React, { Component } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';

class IntervalDropDown extends Component {
    render() {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Snowfall Interval
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">24 Hours</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">48 Hours</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">7 Days</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default IntervalDropDown;
