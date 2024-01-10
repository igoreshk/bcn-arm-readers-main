import SelectFieldContainer from 'src/view/containers/SelectFieldContainer';
import { BuildingService } from 'src/service/BuildingService';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import { withLocalize } from 'react-localize-redux';

import CustomAppBar from '../../admininterface/appbar/CustomAppBar';
import FloorChooser from '../FloorChooser';

import './mainOperator.scss';

class MainOperator extends Component {
  constructor(props) {
    super(props);
    this.state = {
      levelsArray: [],
      showAdditionalFields: false
    };
  }

  componentDidMount() {
    const building = this.props.match.params.building;
    this.loadLevels(building);
  }

  componentDidUpdate(prevProps) {
    const building = this.props.match.params.building;
    if (prevProps.location !== this.props.location) {
      this.loadLevels(building);
    }
  }

  loadLevels(buildingId) {
    BuildingService.findBuildingLevels(buildingId)
      .then((levels) => {
        this.setState({
          levelsArray: levels
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  handleClickOnMore = () => {
    this.setState((prevState) => ({ showAdditionalFields: !prevState.showAdditionalFields }));
  };

  render() {
    const title = this.state.levelsArray ? (
      <div className="mainOperator">
        <div className="more" onClick={this.handleClickOnMore}>
          <span>{this.props.translate('admin.more')}</span>
          {this.state.showAdditionalFields ? <ExpandLess /> : <ExpandMore />}
        </div>
        <div className="base" style={this.state.showAdditionalFields ? {} : { display: 'none' }}>
          <SelectFieldContainer {...this.props} />
          <FloorChooser levelsArray={this.state.levelsArray} />
        </div>
      </div>
    ) : null;

    return <CustomAppBar title={title} />;
  }
}

export default withRouter(withLocalize(MainOperator));
