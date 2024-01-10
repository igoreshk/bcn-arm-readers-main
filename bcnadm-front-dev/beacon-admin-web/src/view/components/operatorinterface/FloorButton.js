import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FloorButton extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.props.changeCurrentLevel(this.props.row);
  }

  render() {
    const level = this.props.levelNumber;
    const className = this.props.label === level ? 'floorButtonActive' : 'floorButtonInactive';
    return (
      <div onClick={this.handleClick} name="level-button" id={`level-button-${this.props.label}`} className={className}>
        <span className="label">{this.props.label}</span>
      </div>
    );
  }
}

FloorButton.propTypes = {
  label: PropTypes.number
};

export default FloorButton;
