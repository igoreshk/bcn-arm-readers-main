import React, { Component } from 'react';
import { FormControl, InputLabel, Select, MenuItem, Avatar } from '@material-ui/core';
import PropTypes from 'prop-types';

import { BuildingService } from 'src/service/BuildingService';
import { BuildingImageService } from 'src/service/BuildingImageService';

const formControlStyle = {
  maxWidth: '200px'
};

const iconStyle = {
  borderRadius: '0%',
  width: '100%',
  maxWidth: '60px',
  height: '60px',
  marginRight: '0px',
  objectFit: 'cover'
};

const menuItemTextStyle = {
  maxWidth: '200px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  marginLeft: '10px'
};

export class SelectBuildings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: [],
      buildings: []
    };
  }

  componentDidMount() {
    BuildingService.findAll()
      .then((buildings) => {
        this.setState({ buildings });
      })
      .catch((err) => {
        throw err;
      });
  }

  menuItems = () => {
    return this.state.buildings.map((building) => (
      <MenuItem key={building.entityId} value={building.entityId}>
        <Avatar style={iconStyle} src={BuildingImageService.getBuildingImageLink(building.entityId)} />
        <span style={menuItemTextStyle}>{building.name}</span>
      </MenuItem>
    ));
  };

  handleChange = (event) => {
    this.setState({ value: event.target.value }, () => this.props.input.onChange(this.state.value));
  };

  renderValue = (selected) => {
    return selected.map((elem) => this.state.buildings.find((building) => building.entityId === elem).name).join(', ');
  };

  render() {
    return (
      <FormControl margin="normal" style={formControlStyle}>
        <InputLabel style={{ whiteSpace: 'nowrap' }} shrink>
          {this.props.label}
        </InputLabel>
        <Select
          multiple
          value={this.state.value}
          onChange={this.handleChange}
          disabled={this.state.buildings.length === 0}
          renderValue={this.renderValue}
        >
          {this.menuItems()}
        </Select>
      </FormControl>
    );
  }
}

SelectBuildings.propTypes = {
  label: PropTypes.string.isRequired,
  input: PropTypes.object
};
