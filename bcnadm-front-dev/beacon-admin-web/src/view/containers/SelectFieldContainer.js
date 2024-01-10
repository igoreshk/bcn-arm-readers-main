import { BuildingService } from 'src/service/BuildingService';
import LevelsSelectField from 'src/view/components/operatorinterface/LevelsSelectField';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SelectFieldContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buildings: []
    };

    this.isNewBuildingCreated = false;
  }

  componentDidMount() {
    this.loadBuildings();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.buildings.length !== nextState.buildings.length) {
      return true;
    }

    if (
      this.props.location.pathname !== nextProps.location.pathname &&
      this.props.location.pathname.indexOf('new') > -1
    ) {
      this.isNewBuildingCreated = true;
      return true;
    }

    return false;
  }

  componentDidUpdate() {
    if (this.isNewBuildingCreated) {
      this.loadBuildings();
      this.isNewBuildingCreated = false;
    }
  }

  loadBuildings = () => {
    BuildingService.findAll()
      .then((buildings) => {
        this.setState({ buildings });
      })
      .catch((err) => {
        throw err;
      });
  };

  render() {
    return <LevelsSelectField buildings={this.state.buildings} />;
  }
}

SelectFieldContainer.propTypes = {
  location: PropTypes.object.isRequired
};

export default SelectFieldContainer;
