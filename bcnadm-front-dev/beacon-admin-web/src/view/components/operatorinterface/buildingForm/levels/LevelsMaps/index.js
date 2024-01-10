import { ERROR, SUCCESSFUL } from 'src/utils/popUpConsts';
import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import { FaBuilding as BuildingIcon } from 'react-icons/fa';
import PropTypes from 'prop-types';

import Logo from '../../styles/Logo';
import LevelsDropzones from '../LevelsDropzone';

import './levelsMaps.scss';

export default class LevelsMaps extends Component {
  state = {
    isSubmitInProgress: false
  };

  changeStatusOfSubmit = (value) => {
    this.setState({
      isSubmitInProgress: value
    });
  };

  handleOnSubmit = async (values) => {
    const { handleSubmit, addPopupMessageText, translate, closeDialog } = this.props;

    try {
      this.setState({
        isSubmitInProgress: true
      });
      const result = await handleSubmit(values);
      if (result.building && result.levels) {
        addPopupMessageText(translate('building.messages.success'), SUCCESSFUL);
        closeDialog();
      } else {
        throw Error(ERROR);
      }
    } catch (error) {
      this.setState(
        {
          isSubmitInProgress: false
        },
        () => addPopupMessageText(translate('building.messages.serverError'), error.message)
      );
    }
  };

  render() {
    const {
      state: { isSubmitInProgress },
      props: { allowedToProceed, back, levels, translate, isNew, updateLevels, removeLevelField },
      handleOnSubmit
    } = this;

    return (
      <form onSubmit={handleOnSubmit} className="levelsMaps">
        <Logo
          title={translate(isNew ? 'building.create.titleLevels' : 'building.update.titleLevels')}
          icon={<BuildingIcon className="logo" />}
        />
        <LevelsDropzones
          changeStatusOfSubmit={this.changeStatusOfSubmit}
          updateLevels={updateLevels}
          removeLevelField={removeLevelField}
          levels={levels}
          translate={translate}
        />
        <div className="buttonsContainer">
          <Button onClick={back}>{translate('building.back')}</Button>
          <Button
            disabled={!allowedToProceed || isSubmitInProgress}
            type="submit"
            className="submitButton"
            variant="contained"
            color="primary"
          >
            {translate(isNew ? 'building.create.save' : 'building.update.save')}
          </Button>
        </div>
      </form>
    );
  }
}

LevelsMaps.propTypes = {
  allowedToProceed: PropTypes.bool.isRequired,
  back: PropTypes.func.isRequired,
  closeDialog: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isNew: PropTypes.bool.isRequired,
  levels: PropTypes.arrayOf(PropTypes.object),
  removeLevelField: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  updateLevels: PropTypes.func.isRequired
};
