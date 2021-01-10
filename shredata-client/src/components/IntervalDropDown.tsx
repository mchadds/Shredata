import React, { Component } from 'react';
import { DropdownProps } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { SelectCallback } from 'react-bootstrap/esm/helpers';

class IntervalDropdown extends Component {
    constructor(props: any) {
        super(props);
        this.props = props;
    }

    props = {
        handleDropdownSelect: (e: any) => {}
        // onSelect: (e: SelectCallback) => {}
    };

    // handleDropdownSelect = (e: any) => {
    //     console.log(e);
    // };

    render() {
        //const { handleDropdownSelect } = this.props;
        return (
            <Dropdown onSelect={(e: any) => this.props.handleDropdownSelect(e)}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Snowfall Interval
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item eventKey="24Hours">24 Hours</Dropdown.Item>
                    <Dropdown.Item eventKey="48Hours" href="48Hours">
                        48 Hours
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="7Days" href="7Days">
                        7 Days
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }
}

export default IntervalDropdown;
