import React, { Component } from 'react';
import { IconButton } from '@material-ui/core';
import ReactTooltip from 'react-tooltip';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

import { LocationService } from 'src/utils/LocationService';

export const buttonType = {
  ACTION: 'ACTION',
  MODE: 'MODE'
};

const tooltipStyle = {
  fontSize: '12px',
  lineHeight: '2.3',
  fontWeight: '500'
};

export class ModeButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active !== this.props.active) {
      this.changeStatus(this.props.active);
    }
  }

  changeStatus = (status) =>
    this.setState({
      active: status
    });

  onClick = () => {
    const urlParams = this.props.match.params;
    const location = LocationService.getLayerLocation(
      urlParams.building,
      urlParams.level,
      this.props.link,
      urlParams.edit
    );
    this.props.history.push(location);
  };

  render() {
    const { onClick, width, tooltip, buttonId, icon, disabled } = this.props;
    const insideTernary = this.props.buttonType === buttonType.ACTION ? '#B22746' : '#39C2D7';
    const buttonStyle = {
      backgroundColor: this.state.active ? insideTernary : '#FFFFFF',
      borderRadius: '3px',
      boxShadow: '1px 2px 2px #999999',
      width: width ? width : '36px',
      height: '36px',
      margin: '1px',
      padding: '0px',
      opacity: disabled ? '0.5' : '1'
    };
    return (
      <>
        <IconButton
          style={buttonStyle}
          onClick={onClick ? onClick : this.onClick}
          data-tip
          data-for={buttonId}
          disabled={disabled}
        >
          {icon}
        </IconButton>
        {tooltip ? (
          <ReactTooltip id={buttonId} place="bottom" type="light" effect="solid">
            <span style={tooltipStyle}>{tooltip}</span>
          </ReactTooltip>
        ) : null}
      </>
    );
  }
}

ModeButton.propTypes = {
  icon: PropTypes.element.isRequired,
  link: PropTypes.string,
  onClick: PropTypes.func,
  buttonId: PropTypes.string.isRequired,
  tooltip: PropTypes.string,
  buttonType: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  match: PropTypes.shape({
    params: PropTypes.object
  }),
  history: PropTypes.object,
  width: PropTypes.string,
  disabled: PropTypes.bool
};

export default withRouter(ModeButton);
