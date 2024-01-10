/* eslint-disable max-statements */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, MenuItem, IconButton, Button } from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import PropTypes from 'prop-types';

import { LocationService } from 'src/utils/LocationService';
import FloorButton from '../FloorButton';

import './floorChooser.scss';

let arrayLeft = [];
let arrayRight = [];
const NUMBER_OF_FLOOR = 4;
const ANGEL_SIZE = 22;

class FloorChooser extends Component {
  constructor(props) {
    super(props);
    this.changeCurrentLevel = this.changeCurrentLevel.bind(this);
    this.state = {
      anchorEl: null,
      openLeft: false,
      openRight: false
    };
  }

  changeCurrentLevel = (level) => {
    const { match, history } = this.props;

    history.push(
      LocationService.getLayerLocation(match.params.building, level.entityId, match.params.layer, match.params.edit)
    );
  };

  renderLabel(level) {
    const maxLevelLength = 3;
    if (/([0-9])+/i.test(level) || level.length < maxLevelLength) {
      return level;
    }
    if (level.split(' ').length > 1) {
      const words = level.split(' ');
      return words[0][0] + words[1][0];
    }
    return level[0][0];
  }

  renderArrow(isRightArrow) {
    if (isRightArrow) {
      return <FaAngleRight size={ANGEL_SIZE} />;
    }

    return <FaAngleLeft size={ANGEL_SIZE} />;
  }

  renderPaper(row) {
    if (row) {
      return <div className="floor">{row.number}</div>;
    }
  }

  renderDotes(isSecondPaperPresent) {
    if (isSecondPaperPresent) {
      return <MoreHorizIcon style={{ color: 'white' }} />;
    }
  }

  handleIconButtonClick = (event) => {
    if (event.currentTarget.id === 'icon-button-right') {
      this.setState({
        anchorEl: event.currentTarget,
        openRight: true
      });
    } else {
      this.setState({
        anchorEl: event.currentTarget,
        openLeft: true
      });
    }
  };

  handleCloseDropMenu = () => {
    this.setState({
      anchorEl: null,
      openLeft: false,
      openRight: false
    });
  };

  renderDropMenu(levelsArray, rightArrow) {
    if (!levelsArray.length) {
      return null;
    }
    const identify = rightArrow ? 'right' : 'left';
    return (
      <>
        <IconButton
          name="icon-button"
          // eslint-disable-next-line react/forbid-component-props
          id={`icon-button-${identify}`}
          onClick={this.handleIconButtonClick}
          className="iconButton"
        >
          {this.renderArrow(rightArrow)}
        </IconButton>
        <Menu
          anchorEl={this.state.anchorEl}
          open={rightArrow ? this.state.openRight : this.state.openLeft}
          onClose={this.handleCloseDropMenu}
          classes={{ paper: 'floorChooserDropdownMenu' }}
          MenuListProps={{ className: 'list' }}
        >
          {levelsArray.map((levelPair) => (
            <MenuItem key={levelPair[0].entityId} className="item">
              <Button
                onClick={() => {
                  this.handleCloseDropMenu();
                  this.changeCurrentLevel(levelPair[0]);
                }}
                name="level-button"
              >
                <div className="buttonContent">
                  {this.renderPaper(levelPair[0])}
                  {this.renderDotes(levelPair[1])}
                  {this.renderPaper(levelPair[1])}
                </div>
              </Button>
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  getBorderLevelsForMenu(array, destinationArray, revers) {
    const result = [];
    const length = array.length;
    let end;
    let start;
    if (!length) {
      return [];
    }
    if (length >= NUMBER_OF_FLOOR) {
      if (revers) {
        start = array[0];
        end = array[NUMBER_OF_FLOOR - 1];
      } else {
        start = array[length - NUMBER_OF_FLOOR];
        end = array[length - 1];
      }
    } else if (length === 1) {
      start = array[0];
    } else {
      start = array[0];
      end = array[length - 1];
    }

    result.push(start);
    if (end) {
      result.push(end);
    }
    destinationArray.push(result);

    if (length >= NUMBER_OF_FLOOR) {
      let mas;
      if (revers) {
        mas = array.slice(NUMBER_OF_FLOOR, length);
      } else {
        mas = array.slice(0, length - NUMBER_OF_FLOOR);
      }

      if (mas.length !== 0) {
        this.getBorderLevelsForMenu(mas, destinationArray, revers);
      }
    }
    return result;
  }

  render() {
    const { levelsArray, levelNumber } = this.props;
    if (!levelsArray || levelsArray.length === 0) {
      return null;
    }

    let leftDropDownMenu;
    let rightDropDownMenu;
    // TODO write sort, that sort both numbers and strings
    const sortedArray = levelsArray.sort((a, b) => a.number - b.number);
    const curLev = Number(this.props.levelNumber);
    let middleL;
    let middleR;
    const leftL = 0;
    let leftR = curLev - 1;
    const rightL = curLev + NUMBER_OF_FLOOR - 1;
    const rightR = sortedArray.length;

    arrayLeft = [];
    arrayRight = [];

    if (curLev + NUMBER_OF_FLOOR > sortedArray.length) {
      middleL = sortedArray.length - NUMBER_OF_FLOOR;
      if (middleL < 0) {
        middleL = 0;
      }
      middleR = sortedArray.length;
      leftR = middleL;
    } else {
      middleL = leftR;
      middleR = rightL;
    }

    const arrayMid = sortedArray.slice(middleL, middleR);

    if (curLev > 1) {
      this.getBorderLevelsForMenu(sortedArray.slice(leftL, leftR), arrayLeft, false);
      leftDropDownMenu = this.renderDropMenu(arrayLeft);
    }

    if (curLev + NUMBER_OF_FLOOR - 1 < sortedArray.length) {
      this.getBorderLevelsForMenu(sortedArray.slice(rightL, rightR), arrayRight, true);
      rightDropDownMenu = this.renderDropMenu(arrayRight, true);
    }

    return (
      <div className="floorChooser">
        {leftDropDownMenu}
        {arrayMid.map((row) => {
          return (
            <FloorButton
              row={row}
              key={row.entityId}
              label={this.renderLabel(row.number)}
              levelNumber={levelNumber}
              changeCurrentLevel={this.changeCurrentLevel}
            />
          );
        })}
        {rightDropDownMenu}
      </div>
    );
  }
}

FloorChooser.propTypes = {
  levelsArray: PropTypes.arrayOf(PropTypes.object),
  match: PropTypes.object,
  history: PropTypes.object,
  levelNumber: PropTypes.number
};

const mapStateToProps = (state) => {
  return {
    levelNumber: state.activeLevelInfo.currentLevel.number
  };
};

export default withRouter(connect(mapStateToProps)(FloorChooser));
