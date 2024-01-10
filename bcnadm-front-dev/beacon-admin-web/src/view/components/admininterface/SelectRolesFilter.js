import React, { Component } from 'react';
import { FormControl, Select, MenuItem, Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';
import images from 'src/view/images';

const iconStyle = {
  borderRadius: '30%',
  width: '30px',
  height: '30px'
};

const menuItemTextStyle = {
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: '10px'
};

export class SelectRolesFilter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rolesChosen: null,
      values: []
    };
  }

  menuItems = () => {
    return this.props.role.map((roleKeyValue, index) => (
      <MenuItem key={index} value={roleKeyValue}>
        <Avatar style={iconStyle} src={images.role} />
        <span style={menuItemTextStyle}>{roleKeyValue}</span>
      </MenuItem>
    ));
  };

  setRolesChosen = (values) => {
    const rolesChosen = [];
    values.forEach((value) => rolesChosen.push(value));
    return rolesChosen;
  };

  handleChange = (event) => {
    const rolesChosen = this.setRolesChosen(event.target.value);
    this.setState({ values: event.target.value, rolesChosen }, () => this.props.setRolesFilter(this.state.rolesChosen));
  };

  renderValue = (selected) => {
    if (selected.length === 0) {
      return this.props.hintText;
    }

    return selected.join(', ');
  };

  render() {
    return (
      <FormControl style={{ width: '100%' }}>
        <Select
          multiple
          value={this.state.values}
          onChange={this.handleChange}
          disabled={this.props.role.size === 0}
          displayEmpty
          renderValue={this.renderValue}
        >
          <MenuItem value="" disabled>
            {this.props.hintText}
          </MenuItem>
          {this.menuItems()}
        </Select>
      </FormControl>
    );
  }
}

SelectRolesFilter.propTypes = {
  role: PropTypes.arrayOf(PropTypes.string),
  setRolesFilter: PropTypes.func.isRequired,
  hintText: PropTypes.string.isRequired
};
