import { isNewInstance } from 'src/view/components/common/InstanceValidation';
import React from 'react';
import { Field } from 'redux-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types';

import VisitorFormTextField from '../VisitorFormTextField';

import './visitorForm.scss';

export const VisitorForm = (props) => {
  const {
    currentVisitor,
    translate,
    valid,
    cancel,
    saveVisitor,
    handleOnChangeName,
    handleOnChangeDeviceId,
    isAppropriateName,
    isAppropriateDeviceId
  } = props;

  return (
    <Dialog open onClose={cancel}>
      <DialogTitle>
        {isNewInstance(currentVisitor) ? translate('visitors.newVisitor') : translate('visitors.editVisitor')}
      </DialogTitle>
      <DialogContent>
        <form className="visitorForm">
          <div className="firstBlock">
            <div>
              <Field
                name="name"
                component={VisitorFormTextField}
                hintText={translate('visitors.dialog.name')}
                floatingLabelText={translate('visitors.dialog.name')}
                onChange={handleOnChangeName}
              />
            </div>
          </div>

          <div className="secondBlock">
            <Field
              name="deviceId"
              component={VisitorFormTextField}
              floatingLabelText={translate('visitors.dialog.deviceId')}
              hintText={translate('visitors.dialog.deviceId')}
              onChange={handleOnChangeDeviceId}
            />
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>{translate('visitors.dialog.cancel')}</Button>
        <Button disabled={!valid || !isAppropriateName || !isAppropriateDeviceId} onClick={saveVisitor} color="primary">
          {currentVisitor.entityId ? translate('visitors.dialog.save') : translate('visitors.dialog.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

VisitorForm.propTypes = {
  currentVisitor: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
  translate: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  saveVisitor: PropTypes.func,
  handleOnChangeName: PropTypes.func,
  handleOnChangeDeviceId: PropTypes.func,
  isAppropriateName: PropTypes.bool,
  isAppropriateDeviceId: PropTypes.bool
};

export default VisitorForm;
