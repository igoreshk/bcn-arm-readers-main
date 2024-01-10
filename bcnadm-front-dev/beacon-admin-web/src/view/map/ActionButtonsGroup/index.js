import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Edit from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';

import ModeButton, { buttonType } from '../ModeButton';
import ConfirmDeleteDialog from '../ConfirmDeleteDialog';

import './actionButtonsGroup.scss';

class ActionButtonsGroup extends Component {
  render() {
    const { clear, translate, toEdit } = this.props;
    const { edit: editMode } = this.props.match.params;

    function setClassName() {
      return editMode ? 'activeEditButtonIcon' : 'inactiveEditButtonIcon';
    }

    return (
      <div className="actionButtonsGroup">
        <ModeButton
          icon={<Edit className={setClassName()} />}
          onClick={toEdit}
          active={Boolean(editMode)}
          tooltip={translate('operator.edit')}
          buttonId="edit"
          buttonType={buttonType.ACTION}
        />
        {editMode && <ConfirmDeleteDialog clear={clear} translate={translate} />}
      </div>
    );
  }
}

ActionButtonsGroup.propTypes = {
  translate: PropTypes.func.isRequired,
  clear: PropTypes.func.isRequired,
  match: PropTypes.object,
  toEdit: PropTypes.func
};

export default withRouter(ActionButtonsGroup);
