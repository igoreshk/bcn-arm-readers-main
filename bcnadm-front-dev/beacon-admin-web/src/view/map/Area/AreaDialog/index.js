import { LocationService } from 'src/utils/LocationService';
import { LevelService } from 'src/service/LevelService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR, SUCCESSFUL } from 'src/utils/popUpConsts';
import React, { Component } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import areaDataProvider from '../AreaDataProvider';

import AreaForm from '../AreaForm';
import '../../GeneralDialogsStyles/dialogs.scss';

class AreaDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      area: null,
      level: null
    };
  }

  componentDidMount() {
    const { area: areaId } = this.props.match.params;

    Promise.all([this.loadArea(areaId), this.getLevel()])
      .then((response) => {
        this.setState({
          area: response[0],
          level: response[1]
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  async loadArea(areaId) {
    if (areaId === 'new') {
      return {
        entityId: null,
        description: null,
        name: null,
        levelId: this.props.match.params.level,
        coordinates: null
      };
    }
    return await areaDataProvider.getDto(areaId);
  }

  closeAreaDialog = (messageText, style) => {
    const { building: buildingId, level: levelId } = this.props.match.params;
    const { history } = this.props;
    history.push({
      pathname: LocationService.getAreaLocation(buildingId, levelId, true),
      updated: true
    });
    this.props.addPopupMessageText(messageText, style);
  };

  saveArea = () => {
    const { areaInfo, translate } = this.props;
    areaDataProvider
      .saveDto(Object.assign(this.state.area, areaInfo))
      .then(() => this.closeAreaDialog(translate('mapAlerts.area.success'), SUCCESSFUL))
      .catch(() => this.closeAreaDialog(translate('mapAlerts.area.failedToSave'), ERROR));
  };

  deleteArea = () => {
    const { translate } = this.props;
    areaDataProvider
      .removeDto(this.state.area)
      .then(() => this.closeAreaDialog(translate('mapAlerts.area.deleted'), ERROR))
      .catch(() => this.closeAreaDialog(translate('mapAlerts.area.failedToDelete'), ERROR));
  };

  getLevel = () => {
    const { level: levelId } = this.props.match.params;
    return LevelService.getLevel(levelId);
  };

  renderAreaDeleteButton = (area) =>
    area && area.entityId ? (
      <Button key={1} onClick={this.deleteArea} className="deleteButton">
        {this.props.translate('map.delete')}
      </Button>
    ) : null;

  renderActions = (area) => (
    <>
      {this.renderAreaDeleteButton(area)}
      <div className="mock" />
      <Button key={2} onClick={() => this.onCancel(area)}>
        {this.props.translate('map.cancel')}
      </Button>
      <Button key={3} onClick={this.saveArea} disabled={!this.props.isValid} color="primary">
        {this.props.translate('map.save')}
      </Button>
    </>
  );

  onCancel = (area) => {
    if (area.entityId) {
      this.closeAreaDialog(this.props.translate('mapAlerts.area.cancelledEdition'), ERROR);
    } else {
      this.closeAreaDialog(this.props.translate('mapAlerts.area.cancelledCreation'), ERROR);
    }
  };

  render() {
    const { area, level } = this.state;

    let title = null;

    if (level) {
      title =
        area && area.entityId
          ? this.props.translate('map.editArea', { value: level.number })
          : this.props.translate('map.newArea', { value: level.number });

      return (
        <Dialog open classes={{ paper: 'mapDialog' }} onClose={() => this.onCancel(area)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <AreaForm
              initialValues={
                area
                  ? {
                      description: area.description,
                      name: area.name
                    }
                  : {}
              }
              enableReinitialize
              translate={this.props.translate}
            />
          </DialogContent>
          <DialogActions>{this.renderActions(area)}</DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

AreaDialog.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.string.isRequired,
      layer: PropTypes.string.isRequired,
      area: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  history: PropTypes.object,
  addPopupMessageText: PropTypes.func,
  areaInfo: PropTypes.shape({
    description: PropTypes.string,
    name: PropTypes.string
  }),
  translate: PropTypes.func,
  isValid: PropTypes.bool
};

const selector = formValueSelector('AreaInfo');

const mapDispatchToProps = {
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const description = selector(state, 'description');
  const name = selector(state, 'name');
  const form = state.form.AreaInfo;
  return {
    areaInfo: {
      description,
      name
    },
    isValid: form ? !form.syncErrors : false
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withLocalize(AreaDialog)));
