import VisitorsSelectField from 'src/view/components/visitors/VisitorsSelectField';
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import { Form, Field } from 'react-final-form';
import WatcherFormTextField from '../WatcherFormTextField';
import './watcherForm.scss';

const WatcherForm = (props) => {
  const {
    handleOnChange,
    watcher,
    translate,
    cancel,
    selectVisitorsIds,
    visitorsList,
    saveWatcher,
    isLoading,
    isAppropriateName
  } = props;

  const onClickSubmit = () => {
    let isValid;
    if (watcher.name && watcher.name.length && isAppropriateName) {
      isValid = true;
    } else {
      isValid = false;
    }
    return isValid ? saveWatcher() : '';
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onClickSubmit();
  };

  return (
    <Form
      onSubmit={onSubmit}
      render={() => (
        <Dialog open onClose={cancel}>
          <DialogTitle className="watcherDialogTitle">
            {watcher.entityId ? props.translate('watchers.editWatcher') : props.translate('watchers.newWatcher')}
          </DialogTitle>
          <DialogContent>
            <form className="visitorForm">
              <Field>
                {() => (
                  <div className="firstBlock">
                    <WatcherFormTextField
                      name="watcher-name"
                      hintText={props.translate('monitoring.name')}
                      floatingLabelText={props.translate('monitoring.name')}
                      input={watcher.name ? watcher.name : ''}
                      onChange={handleOnChange}
                      isAppropriateName={isAppropriateName}
                      helperText={props.translate('watchers.nonUniqueWatcherName')}
                    />
                  </div>
                )}
              </Field>
              <Field>
                {() => (
                  <div className="secondGroup">
                    <VisitorsSelectField
                      visitors={visitorsList}
                      selectVisitorsIds={selectVisitorsIds}
                      translate={translate}
                      watcher={watcher}
                      isLoading={isLoading}
                    />
                  </div>
                )}
              </Field>
            </form>
          </DialogContent>
          <DialogActions>
            <Button disabled={isLoading} onClick={cancel}>
              {props.translate('visitors.dialog.cancel')}
            </Button>
            <Button
              disabled={!(watcher.name && watcher.name.length && isAppropriateName) || isLoading}
              type={'submit'}
              onClick={onSubmit}
              color="primary"
            >
              {watcher.entityId ? props.translate('visitors.dialog.save') : props.translate('visitors.dialog.create')}
            </Button>
          </DialogActions>
        </Dialog>
      )}
    />
  );
};

WatcherForm.propTypes = {
  handleOnChange: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  visitorsList: PropTypes.arrayOf(PropTypes.object),
  watcher: PropTypes.object,
  translate: PropTypes.func.isRequired,
  selectVisitorsIds: PropTypes.func.isRequired,
  saveWatcher: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired
};

export default WatcherForm;
