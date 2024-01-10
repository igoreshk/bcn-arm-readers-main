import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import List from '@material-ui/icons/List';
import PropTypes from 'prop-types';

import ModeButton, { buttonType } from '../ModeButton';
import AreasTableContainer from './AreasTableContainer';
import areaDataProvider from './AreaDataProvider';

const iconColorGray = {
  fill: '#999999'
};

class AreasListButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isListShowed: false,
      areas: [],
      isAreasLoading: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isListShowed && this.state.isListShowed !== prevState.isListShowed) {
      const { level: levelId } = this.props.match.params;
      this.loadAreas(levelId);
    }
  }

  loadAreas(levelId) {
    this.setState({ isAreasLoading: true });
    areaDataProvider
      .getDtos(levelId)
      .then((areas) => {
        this.setState({ areas, isAreasLoading: false });
      })
      .catch((err) => {
        throw err;
      });
  }

  handleClick = () => {
    this.setState((prevState) => ({ isListShowed: !prevState.isListShowed }));
  };

  render() {
    return (
      <>
        <ModeButton
          icon={<List style={iconColorGray} />}
          onClick={this.handleClick}
          active={false}
          tooltip={this.props.translate('operator.listOfAreas')}
          buttonId="list-of-areas"
          buttonType={buttonType.ACTION}
        />
        {this.state.isListShowed && (
          <AreasTableContainer
            close={this.handleClick}
            areas={this.state.areas}
            isAreasLoading={this.state.isAreasLoading}
            levelNumber={this.props.levelNumber}
            translate={this.props.translate}
          />
        )}
      </>
    );
  }
}

AreasListButton.propTypes = {
  levelNumber: PropTypes.number,
  translate: PropTypes.func.isRequired
};

export default withRouter(AreasListButton);
