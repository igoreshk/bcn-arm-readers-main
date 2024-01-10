import React from 'react';
import { Field } from 'redux-form';
import PropTypes from 'prop-types';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

import { UserFormTextfield } from '../UserFormTextfield';
import { RolesCheckBoxGroup } from '../RolesCheckBoxGroup';
import { isNewInstance } from '../../common/InstanceValidation';
import { SelectBuildings } from '../SelectBuildings';

import './userForm.scss';
import { UserStatusGroup } from '../UserStatusGroup';

export const UserForm = ({ error, currentUser, translate, valid, roles, cancel, saveUser }) => {
  return (
    <Dialog className="userFormDialog" open onClose={cancel}>
      <DialogTitle>
        {isNewInstance(currentUser) ? translate('admin.newUser') : translate('admin.updateUser')}
      </DialogTitle>
      <DialogContent>
        <form className="userForm">
          <div className="userFormLeft">
            <Field name="firstName" component={UserFormTextfield} label={translate('admin.dialog.name')} />
            <Field name="lastName" component={UserFormTextfield} label={translate('admin.dialog.surname')} />
            <Field
              // TODO ignoring while developing
              // disabled={!isNewInstance(currentUser)}
              name="email"
              component={UserFormTextfield}
              label={translate('admin.dialog.email')}
            />

            {currentUser.entityId && (
              <Field
                name="availableBuildings"
                component={SelectBuildings}
                userId={currentUser.entityId.id}
                label={translate('admin.dialog.buildings')}
              />
            )}
            <Field
              name="status"
              component={UserStatusGroup}
              status={currentUser.status}
              label={translate('admin.dialog.status')}
            />
          </div>
          <div className="userFormRight">
            <label>{translate('admin.dialog.permissions')}</label>
            <Field name="role" roles={roles} component={RolesCheckBoxGroup} />
            {'error' && <strong>{error}</strong>}
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancel}>{translate('admin.dialog.cancel')}</Button>
        <Button disabled={!valid} onClick={saveUser} color="primary">
          {currentUser.entityId !== 0 ? translate('admin.dialog.save') : translate('admin.dialog.create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

UserForm.propTypes = {
  error: PropTypes.string,
  currentUser: PropTypes.object.isRequired,
  valid: PropTypes.bool.isRequired,
  roles: PropTypes.arrayOf(PropTypes.string),
  translate: PropTypes.func.isRequired,
  cancel: PropTypes.func,
  saveUser: PropTypes.func
};
