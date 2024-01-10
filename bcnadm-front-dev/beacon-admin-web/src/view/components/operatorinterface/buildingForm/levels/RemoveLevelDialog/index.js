import { BuildingService } from 'src/service/BuildingService';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';

class RemoveLevelDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };
  }

  onDeleteClick = () => {
    BuildingService.deleteLevel(this.props.match.params.id, this.props.levelId)
      .then(() => {
        this.props.onRemoveLevelClick();
        this.closeDialog();
      })
      .catch((err) => {
        throw err;
      });
  };

  closeDialog = () => {
    this.setState({ open: false });
  };

  onCancelClick = () => {
    this.closeDialog();
  };

  onOpenClick = () => {
    this.setState({ open: true });
  };

  render() {
    const { translate } = this.props;

    return (
      <>
        <Button onClick={this.onOpenClick} className="removeButton">
          {translate('removeLevel.removeButton')}
        </Button>
        <Dialog open={this.state.open} onClose={this.onCancelClick}>
          <DialogTitle>{translate('removeLevel.title')}</DialogTitle>
          <DialogContent>
            <p>
              {translate('removeLevel.warningMessage')}
              <strong>{this.props.levelName}</strong>?
              <br />
              {translate('removeLevel.undoneMessage')}
            </p>
          </DialogContent>
          <DialogActions>
            <Button key="level-cancel-button" color="primary" onClick={this.onCancelClick}>
              {translate('common.cancel')}
            </Button>
            <Button key="level-remove-button" color="primary" onClick={this.onDeleteClick}>
              {translate('common.remove')}
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

RemoveLevelDialog.propTypes = {
  translate: PropTypes.func.isRequired,
  levelId: PropTypes.string.isRequired,
  levelName: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  match: PropTypes.object,
  onRemoveLevelClick: PropTypes.func
};

export default withRouter(RemoveLevelDialog);
