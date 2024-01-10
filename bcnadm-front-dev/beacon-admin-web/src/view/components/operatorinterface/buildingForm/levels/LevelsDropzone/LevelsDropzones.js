import { LevelImageService } from 'src/service/LevelImageService';
import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { Scrollbars } from 'react-custom-scrollbars';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';

import { LEVEL_FIELD } from 'src/consts/FormsNames';
import LevelField from '../LevelField';

export default class LevelsDropzones extends Component {
  /**
   * After render levels (after adding new, for example) - scroll to last.
   */
  componentDidUpdate() {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }
  lastLevelElement = React.createRef();
  shouldScrollToBottom = false;

  addNewLevelToModel = () => {
    const { levels, updateLevels } = this.props;
    const newLevelNumber = levels.length !== 0 && levels[levels.length - 1] ? levels[levels.length - 1].number + 1 : 1;
    levels.push({
      number: newLevelNumber,
      image: undefined
    });
    updateLevels(levels);
    this.shouldScrollToBottom = true;
  };

  changeLevelNumber = (levelIndex, newNumber) => {
    const { levels, updateLevels, changeStatusOfSubmit } = this.props;
    const unqieValue = this.checkValueForUnique(newNumber, 0);
    changeStatusOfSubmit(!unqieValue);
    const changedLevels = levels;
    changedLevels[levelIndex].number = Number(newNumber);
    updateLevels(changedLevels);
  };

  checkValueForUnique = (value, maxNumUniqueValue = 1) => {
    const { levels } = this.props;
    const numUniqueValue = levels.filter((level) => level.number === value).length;
    if (numUniqueValue > maxNumUniqueValue) {
      return false;
    }
    return true;
  };

  changeLevelImage = (levelIndex, newImage) => {
    const { levels, updateLevels } = this.props;
    const changedLevels = levels;
    changedLevels[levelIndex].image = newImage;
    updateLevels(changedLevels);
  };

  scrollToBottom = () => {
    const scrollToStartOfElement = true;
    this.lastLevelElement.current.scrollIntoView(scrollToStartOfElement);
  };

  renderLevelDropzones = () => {
    return this.props.levels.map((level, idx) => (
      <Field
        key={idx}
        component={LevelField}
        name={`${LEVEL_FIELD}[${idx}]`}
        params={{
          unique: this.checkValueForUnique(level.number),
          entityId: level.entityId,
          number: level.number,
          image: level.image,
          levelIndex: idx,
          imageLink: level.entityId ? LevelImageService.getLevelImageLink(level.entityId) : null
        }}
        onRemoveLevelClick={this.props.removeLevelField}
        changeLevelNumber={this.changeLevelNumber}
        changeLevelImage={this.changeLevelImage}
        translate={this.props.translate}
      />
    ));
  };

  render() {
    return (
      <div className="levelsDropzones">
        <Scrollbars className="scrollbar">
          <div className="scrollbarContent">
            {this.renderLevelDropzones()}
            <div ref={this.lastLevelElement} />
          </div>
        </Scrollbars>
        <div className="addLevelButtonContainer">
          <Button onClick={this.addNewLevelToModel} color="primary">
            {this.props.translate('building.addLevel')}
          </Button>
        </div>
      </div>
    );
  }
}

LevelsDropzones.propTypes = {
  levels: PropTypes.arrayOf(PropTypes.object),
  translate: PropTypes.func,
  updateLevels: PropTypes.func,
  removeLevelField: PropTypes.func,
  changeStatusOfSubmit: PropTypes.func
};
