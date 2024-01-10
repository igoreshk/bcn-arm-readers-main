import React, { Component } from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import { statusItem } from '../SelectStatusFilter';

const formControlStyle = {
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
  // marginLeft: '10px'
};

export class UserStatusGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.status || ''
    };
  }

  menuItems = () => {
    return statusItem.map((roleKeyValue, index) => (
      <MenuItem key={index} value={roleKeyValue}>
        <span style={formControlStyle}>{roleKeyValue}</span>
      </MenuItem>
    ));
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value }, () => this.props.input.onChange(this.state.value));
  };

  render() {
    return (
      <FormControl margin="normal" style={formControlStyle}>
        <InputLabel style={{ whiteSpace: 'nowrap' }} shrink>
          {this.props.label}
        </InputLabel>
        <Select value={this.state.value} onChange={this.handleChange}>
          {this.menuItems()}
        </Select>
      </FormControl>
    );
  }
}
UserStatusGroup.propTypes = {
  input: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired
};
