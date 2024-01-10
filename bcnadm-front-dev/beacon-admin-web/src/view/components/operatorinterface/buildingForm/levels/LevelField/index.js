import React, { Component } from 'react';
import { TextField, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { maxFileSize } from 'src/view/FileConsts';
import LevelImageDropZone from '../LevelImageDropZone';
import RemoveLevelDialog from '../RemoveLevelDialog';
const multiplier = 5;
const maxLevelImageMapSize = multiplier * maxFileSize; // max level image size

export default class LevelField extends Component {
  changeCurrentLevelNumber = (event) => {
    const {
      changeLevelNumber,
      params: { levelIndex },
      input: { onChange, value }
    } = this.props;
    const newNumber = Number(event.target.value);
    onChange({
      ...value,
      entityId: value.entityId,
      number: newNumber
    });
    changeLevelNumber(levelIndex, newNumber);
  };

  onRemoveFieldClick() {
    const {
      onRemoveLevelClick,
      params: { levelIndex }
    } = this.props;
    onRemoveLevelClick(levelIndex);
  }

  changeCurrentLevelImage = (newImage) => {
    const {
      params: { levelIndex },
      changeLevelImage
    } = this.props;
    changeLevelImage(levelIndex, newImage);
  };

  renderButton = () => {
    const {
      params: { number, entityId },
      translate
    } = this.props;
    return entityId ? (
      <RemoveLevelDialog
        levelId={entityId}
        levelName={number}
        onRemoveLevelClick={() => this.onRemoveFieldClick()}
        translate={translate}
      />
    ) : (
      <Button onClick={() => this.onRemoveFieldClick()} classes={{ root: 'removeButton', label: 'removeButtonText' }}>
        {translate('removeLevel.removeButton')}
      </Button>
    );
  };

  render() {
    const {
      params: { entityId, number, imageLink, image, unique },
      input,
      translate
    } = this.props;

    return (
      <div className="createLevelContainer">
        <TextField
          type="number"
          name="level"
          value={number}
          onChange={this.changeCurrentLevelNumber}
          className="levelNumber"
          error={!unique}
          helperText={unique ? null : translate('validation.uniqueLevel')}
        />
        <LevelImageDropZone
          imageLink={imageLink}
          maxSize={maxLevelImageMapSize}
          input={input}
          entityId={entityId}
          number={number}
          image={image}
          changeLevelImage={this.changeCurrentLevelImage}
          translate={translate}
        />
        {this.renderButton()}
      </div>
    );
  }
}

LevelField.propTypes = {
  input: PropTypes.shape({
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    mimeType: PropTypes.string,
    entityId: PropTypes.string,
    onChange: PropTypes.func
  }).isRequired,
  params: PropTypes.shape({
    entityId: PropTypes.string,
    image: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    imageLink: PropTypes.string,
    unique: PropTypes.bool
  }).isRequired,
  translate: PropTypes.func.isRequired,
  changeLevelNumber: PropTypes.func,
  onRemoveLevelClick: PropTypes.func,
  changeLevelImage: PropTypes.func
};
