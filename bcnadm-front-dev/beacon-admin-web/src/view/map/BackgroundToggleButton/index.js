import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Map from '@material-ui/icons/Map';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { toggleBackground } from 'src/reducers/mapBackgroundReducer/mapBackgroundSlice';

import ModeButton, { buttonType } from '../ModeButton';

import './backgroundToggleButton.scss';

class BackgroundToggleButton extends Component {
  componentDidMount() {
    const { showMapBackground } = this.props;

    // If current state of showMapBackground is false, toggle it
    if (showMapBackground !== true) {
      this.props.toggleBackground();
    }
  }

  handleClick = () => {
    this.props.toggleBackground();
  };

  render() {
    const { showMapBackground } = this.props;
    const activeClassName = showMapBackground ? 'activeMapButtonIcon' : 'inactiveMapButtonIcon';

    return (
      <>
        <ModeButton
          icon={<Map className={activeClassName} />}
          onClick={this.handleClick}
          active={showMapBackground}
          buttonId="toggleBackgroundMapButton"
          buttonType={buttonType.MODE}
        />
      </>
    );
  }
}

BackgroundToggleButton.propTypes = {
  showMapBackground: PropTypes.bool.isRequired,
  toggleBackground: PropTypes.func.isRequired
};

const mapStateToProps = (state) => ({
  showMapBackground: state.mapBackground.showMapBackground
});

const mapDispatchToProps = {
  toggleBackground
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BackgroundToggleButton));
