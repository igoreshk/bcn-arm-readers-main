import { BUILDING_DIALOG_FORM, LEVEL_FIELD } from 'src/consts/FormsNames';
import React, { Component } from 'react';
import { unregisterField, arrayRemove, change } from 'redux-form';
import PropTypes from 'prop-types';

import BuildingInfoForm from './building/BuildingInfoForm';
import LevelsMaps from './levels/LevelsMaps';
import { getSortedObjectsbyProperty } from './helpers';
import { fieldsAreFilled, validationsArePassed, levelMapsFieldsAreValid } from './ValidateBuildingForm';

const SET_BUILDING_INFO = 'SET_BUILDING_INFO';
const SET_LEVELS_MAPS = 'SET_LEVELS_MAPS';
const steps = [SET_BUILDING_INFO, SET_LEVELS_MAPS];

export class BuildingForm extends Component {
  constructor(props) {
    super(props);

    let currentStep = SET_BUILDING_INFO;
    let currentStepIndex = 0;

    if (this.props.savedCurrentStepIndex) {
      currentStep = this.props.savedCurrentStep;
      currentStepIndex = this.props.savedCurrentStepIndex;
    }

    this.state = {
      currentStep,
      currentStepIndex
    };
  }

  updateLevels = (levels) => {
    const { setCurrentLevels, dispatch } = this.props;
    dispatch(change(BUILDING_DIALOG_FORM, LEVEL_FIELD, levels));
    setCurrentLevels(levels);
  };

  fieldsAreValid() {
    const { width, height, longitude, latitude, workingHours, mapImage, imageLink, name, address } = this.props;
    return (
      fieldsAreFilled(name, address, mapImage || imageLink) &&
      validationsArePassed({ width, height, longitude, latitude, workingHours })
    );
  }

  next = () => {
    const sortedLevels = getSortedObjectsbyProperty(this.props.levels, 'number');
    this.updateLevels(sortedLevels);

    const { currentStepIndex } = this.state;
    const nextStepIndex = currentStepIndex + 1 >= steps.length ? steps.length - 1 : currentStepIndex + 1;
    this.setState((prevState) => ({
      ...prevState,
      currentStepIndex: nextStepIndex,
      currentStep: steps[nextStepIndex]
    }));
  };

  back = () => {
    const { currentStepIndex } = this.state;
    const prevStepIndex = currentStepIndex - 1 < 0 ? 0 : currentStepIndex - 1;
    this.setState((prevState) => ({
      ...prevState,
      currentStepIndex: prevStepIndex,
      currentStep: steps[prevStepIndex]
    }));
  };

  removeLevelField = (fieldIndex) => {
    const { dispatch, levels } = this.props;
    dispatch(arrayRemove(BUILDING_DIALOG_FORM, LEVEL_FIELD, fieldIndex));
    dispatch(unregisterField(BUILDING_DIALOG_FORM, LEVEL_FIELD));
    const changedLevels = levels.filter((level) => level !== levels[fieldIndex]);
    this.updateLevels(changedLevels);
  };

  render() {
    const { imageLink, translate, handleSubmit, closeDialog, isNew, levels } = this.props;
    const { currentStep } = this.state;

    if (currentStep === SET_BUILDING_INFO) {
      return (
        <BuildingInfoForm
          next={this.next}
          translate={translate}
          allowedToProceed={!!this.fieldsAreValid()}
          closeDialog={closeDialog}
          imageLink={imageLink}
          isNew={isNew}
        />
      );
    } else if (currentStep === SET_LEVELS_MAPS) {
      return (
        <LevelsMaps
          allowedToProceed={levelMapsFieldsAreValid(levels)}
          updateLevels={this.updateLevels}
          back={this.back}
          translate={translate}
          levels={levels}
          isNew={isNew}
          handleSubmit={handleSubmit}
          closeDialog={closeDialog}
          removeLevelField={this.removeLevelField}
          addPopupMessageText={this.props.addPopupMessageText}
        />
      );
    }
  }
}

// additional string prop-type for number fields for case of empty field
BuildingForm.propTypes = {
  name: PropTypes.string,
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mapImage: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  address: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  imageLink: PropTypes.string,
  translate: PropTypes.func.isRequired,
  levels: PropTypes.arrayOf(PropTypes.object),
  setCurrentLevels: PropTypes.func,
  dispatch: PropTypes.func,
  handleSubmit: PropTypes.func,
  closeDialog: PropTypes.func,
  isNew: PropTypes.bool,
  addPopupMessageText: PropTypes.func
};

export default BuildingForm;
