import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

import PropTypes from 'prop-types';
import ModeButton, { buttonType } from '../ModeButton';

class ConfirmDeleteDialog extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  confirmDelete = () => {
    this.props.clear();
    this.handleClose();
  };

  render() {
    return (
      <>
        <ModeButton
          icon={<div style={{ color: '#1A9CB0', fontSize: '14px' }}>{this.props.translate('operator.clear')}</div>}
          active={false}
          onClick={this.handleOpen}
          buttonId="clear"
          buttonType={buttonType.ACTION}
          width="104px"
        />
        <Dialog open={this.state.open} onClose={this.handleClose}>
          <DialogTitle>{this.props.translate('map.clearAll')}</DialogTitle>
          <DialogContent>{this.props.translate('map.clearAllDialog')}</DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              {this.props.translate('map.cancel')}
            </Button>
            <Button color="primary" onClick={this.confirmDelete}>
              {this.props.translate('map.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

ConfirmDeleteDialog.propTypes = {
  clear: PropTypes.func,
  translate: PropTypes.func
};

export default ConfirmDeleteDialog;
