import VisitorService from 'src/service/VisitorService';
import { VISITORS_LIST } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';

const TIME_OUT = 400;

export class VisitorDeleteDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentVisitor: null
    };
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadVisitor()
      .then(() => {
        setTimeout(() => this.props.hideLoadingScreen(), TIME_OUT); // for smoothness
      })
      .catch((err) => {
        throw err;
      });
  }

  setCurrentVisitor(visitor) {
    this.setState({ currentVisitor: visitor });
  }

  loadVisitor() {
    const { id } = this.props.match.params;
    return new Promise((resolve) => {
      if (id) {
        VisitorService.findOne(id)
          .then((visitor) => {
            this.setCurrentVisitor(visitor);
            resolve();
          })

          .finally(() => {
            resolve();
          })
          .catch(() => {
            this.props.history.push(VISITORS_LIST);
          });
      }
    });
  }

  onDeleteClick = () => {
    this.props.showLoadingScreen();
    VisitorService.remove(this.state.currentVisitor.entityId)
      .then(() => {
        this.props.history.push({
          pathname: VISITORS_LIST,
          // to update visitors list
          updated: true
        });
        this.props.hideLoadingScreen();
      })
      .catch(() => {
        this.props.history.push({
          pathname: VISITORS_LIST,
          updated: true
        });
        this.props.hideLoadingScreen();
        this.props.addPopupMessageText(this.props.translate('visitors.dialog.deleteVisitorError'), ERROR);
      });
  };

  onCancelClick = () => {
    this.props.history.push(VISITORS_LIST);
  };

  render() {
    const { currentVisitor } = this.state;

    if (currentVisitor) {
      const { translate } = this.props;

      return (
        <Dialog open onClose={this.onCancelClick}>
          <DialogTitle>{translate('visitors.dialog.deleteVisitorTitle')}</DialogTitle>
          <DialogContent>
            <p>
              {translate('visitors.dialog.warningMessage')}
              <strong>{`${currentVisitor.name}`}</strong>?
              <br />
              {translate('buildingsTable.undoneMessage')}
            </p>
          </DialogContent>
          <DialogActions>
            <Button key="visitor-cancel-button" onClick={this.onCancelClick}>
              {translate('common.cancel')}
            </Button>
            <Button key="visitor-remove-button" color="primary" onClick={this.onDeleteClick}>
              {translate('common.remove')}
            </Button>
          </DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

VisitorDeleteDialog.propTypes = {
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  translate: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func,
  history: PropTypes.object.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  })
};

const mapDispatchToProps = {
  showLoadingScreen,
  addPopupMessageText,
  hideLoadingScreen
};

export default withRouter(connect(null, mapDispatchToProps)(withLocalize(VisitorDeleteDialog)));
