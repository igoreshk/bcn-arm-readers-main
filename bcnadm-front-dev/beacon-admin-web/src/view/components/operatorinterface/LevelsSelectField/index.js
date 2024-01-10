import { BUILDINGS, LEVELS, NEW_BUILDING } from 'src/consts/RouteConsts';
import { BuildingService } from 'src/service/BuildingService';
import React, { Component } from 'react';
import { FormControl, Select, MenuItem } from '@material-ui/core';
import { FaBuilding as BuildingIcon } from 'react-icons/fa';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';

import './levelsSelectField.scss';

export class LevelsSelectField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentBuilding: {}
    };
  }

  componentDidUpdate(prevProps) {
    const building = this.props.match.params.building;
    if (prevProps.location !== this.props.location || prevProps.buildings !== this.props.buildings) {
      const currentBuilding = this.props.buildings.filter((item) => {
        return item.entityId === building;
      });
      this.setState({
        currentBuilding: currentBuilding[0]
      });
    }
  }

  setCurrentBuilding = (event) => {
    if (event.target.value === null) {
      return;
    }

    if (this.state.currentBuilding !== event.target.value) {
      this.setState({ currentBuilding: event.target.value });
    }

    BuildingService.findBuildingLevels(event.target.value.entityId)
      .then((levels) => {
        this.props.history.push({
          pathname: `${BUILDINGS}/${event.target.value.entityId}${LEVELS}/${levels[0].entityId}/${this.props.match.params.layer}`
        });
      })
      .catch((err) => {
        throw err;
      });
  };

  renderValue = (value) => {
    return (
      <div className="selectedItem">
        <div className="iconContainer">
          <BuildingIcon className="icon" />
        </div>
        <span className="name">{value.name}</span>
      </div>
    );
  };

  handleClick = () => {
    this.props.history.push(`${this.props.history.location.pathname}${NEW_BUILDING}`);
  };

  render() {
    const { buildings } = this.props;

    if (!Object.keys(this.state.currentBuilding).length) {
      return null;
    }
    return (
      <FormControl className="levelsSelectFormControl">
        <Select
          value={this.state.currentBuilding}
          onChange={this.setCurrentBuilding}
          renderValue={this.renderValue}
          disableUnderline
          classes={{ icon: 'selectIcon' }}
        >
          {buildings &&
            buildings.map((building) => (
              <MenuItem name="building-entry" key={building.entityId} value={building} className="buildingMenuItem">
                {building.name}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    );
  }
}

LevelsSelectField.propTypes = {
  buildings: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.string.isRequired,
      layer: PropTypes.string.isRequired
    })
  }).isRequired,
  location: PropTypes.object,
  history: PropTypes.shape({
    push: PropTypes.func,
    location: PropTypes.shape({
      pathname: PropTypes.string
    })
  })
};

export default withRouter(withLocalize(LevelsSelectField));
