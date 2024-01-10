import React, { Component } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';

const menuItemTextStyle = {
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: '10px'
};

export const statusItem = ['ACTIVE', 'INACTIVE'];

export class SelectStatusFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  menuItems = () => {
    return statusItem.map((roleKeyValue, index) => (
      <MenuItem key={index} value={roleKeyValue}>
        <span style={menuItemTextStyle}>{roleKeyValue}</span>
      </MenuItem>
    ));
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value }, () => this.props.setStatusFilter(this.state.value));
  };

  renderValue = (selected) => {
    if (selected.length === 0) {
      return this.props.hintText;
    }

    return selected;
  };

  render() {
    return (
      <FormControl style={{ width: '100%' }}>
        <Select value={this.state.value} onChange={this.handleChange} displayEmpty renderValue={this.renderValue}>
          <MenuItem value="" disabled>
            {this.props.hintText}
          </MenuItem>
          {this.menuItems()}
        </Select>
      </FormControl>
    );
  }
}

SelectStatusFilter.propTypes = {
  setStatusFilter: PropTypes.func.isRequired,
  hintText: PropTypes.string.isRequired
};
