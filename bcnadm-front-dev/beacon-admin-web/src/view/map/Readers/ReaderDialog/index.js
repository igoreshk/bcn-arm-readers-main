import { ReadersService } from 'src/service/ReaderService';
import { LocationService } from 'src/utils/LocationService';
import { LevelService } from 'src/service/LevelService';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { SUCCESSFUL, ERROR } from 'src/utils/popUpConsts';
import React, { Component } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';
import PropTypes from 'prop-types';
import { withLocalize } from 'react-localize-redux';
import { fetchReaderNames } from 'src/thunk/fetchReaderNames';

import ReaderForm from '../ReaderForm';
import '../../GeneralDialogsStyles/dialogs.scss';

export class ReaderDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reader: null,
      level: null
    };
  }

  componentDidMount() {
    const { reader } = this.props.match.params;

    Promise.all([this.loadReader(reader), this.getLevel()])
      .then((response) => {
        this.setState({
          reader: response[0],
          level: response[1]
        });
      })
      .catch((err) => {
        throw err;
      });

    this.props.fetchReaderNames();
  }

  async loadReader(readerId) {
    try {
      const readerTemplate = {
        entityId: null,
        uuid: null,
        levelId: null,
        latitude: 0.0,
        longitude: 0.0
      };
      let currentReader;
      if (readerId === 'new') {
        currentReader = readerTemplate;
      } else {
        currentReader = await ReadersService.findOne(readerId);
      }

      if (this.props.location.state) {
        Object.assign(currentReader, this.props.location.state);
      }
      if (!currentReader.levelId) {
        Object.assign(currentReader, {
          levelId: this.props.match.params.level
        });
      }
      return currentReader;
    } catch {
      const errorText =
        readerId === 'new'
          ? this.props.translate('mapAlerts.reader.createReaderError')
          : this.props.translate('mapAlerts.reader.openReaderError');
      this.closeReaderDialog(errorText, ERROR);
    }
  }

  closeReaderDialog = (messageText, style) => {
    this.props.history.push({
      pathname: LocationService.getReadersLocation(
        this.props.match.params.building,
        this.props.match.params.level,
        true
      ),
      updated: true
    });
    this.props.addPopupMessageText(messageText, style);
  };

  saveReader = () => {
    const { readerInfo, translate } = this.props;
    ReadersService.saveReader(Object.assign(this.state.reader, readerInfo))
      .then(() => this.closeReaderDialog(translate('mapAlerts.reader.success'), SUCCESSFUL))
      .catch((err) => {
        if (err.response) {
          this.closeReaderDialog(err.response.data, ERROR);
        }
        throw err;
      });
  };

  deleteReader = () => {
    const { translate } = this.props;
    ReadersService.deleteReader(this.state.reader)
      .then(() => this.closeReaderDialog(translate('mapAlerts.reader.deleted'), ERROR))
      .catch((err) => {
        throw err;
      });
  };

  getLevel = () =>
    LevelService.getLevel(this.props.match.params.level).then((level) => {
      return level;
    });

  renderReaderDeleteButton = (reader) =>
    reader && reader.entityId ? (
      <Button key={1} onClick={this.deleteReader} className="deleteButton">
        {this.props.translate('map.delete')}
      </Button>
    ) : null;

  renderActions = (reader) => (
    <>
      {this.renderReaderDeleteButton(reader)}
      <div className="mock" />
      <Button key={2} onClick={() => this.onCancel(reader)}>
        {this.props.translate('map.cancel')}
      </Button>
      <Button key={3} onClick={this.saveReader} disabled={!this.props.isValid} color="primary">
        {this.props.translate('map.save')}
      </Button>
    </>
  );

  onCancel = (reader) => {
    if (reader.entityId) {
      this.closeReaderDialog(this.props.translate('mapAlerts.reader.cancelledEdition'), ERROR);
    } else {
      this.closeReaderDialog(this.props.translate('mapAlerts.reader.cancelledCreation'), ERROR);
    }
  };

  render() {
    const { reader, level } = this.state;

    let title = null;

    if (level) {
      title =
        reader && reader.entityId
          ? this.props.translate('map.editReader', { value: level.number })
          : this.props.translate('map.newReader', { value: level.number });

      return (
        <Dialog open classes={{ paper: 'mapDialog' }} onClose={() => this.onCancel(reader)}>
          <DialogTitle>{title}</DialogTitle>
          <DialogContent>
            <ReaderForm
              initialValues={
                this.state.reader
                  ? {
                      id: this.state.reader.id,
                      uuid: this.state.reader.uuid,
                      allReaders: this.props.allReaders
                    }
                  : {}
              }
              enableReinitialize
            />
          </DialogContent>
          <DialogActions>{this.renderActions(reader)}</DialogActions>
        </Dialog>
      );
    }

    return null;
  }
}

ReaderDialog.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired
    })
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      building: PropTypes.string.isRequired,
      layer: PropTypes.string.isRequired,
      level: PropTypes.string.isRequired,
      reader: PropTypes.string.isRequired
    }).isRequired
  }).isRequired,
  addPopupMessageText: PropTypes.func,
  fetchReaderNames: PropTypes.func,
  history: PropTypes.object,
  readerInfo: PropTypes.object,
  translate: PropTypes.func,
  isValid: PropTypes.bool,
  allReaders: PropTypes.arrayOf(PropTypes.string)
};

const selector = formValueSelector('ReaderInfo');

const mapDispatchToProps = {
  addPopupMessageText,
  fetchReaderNames
};

const mapStateToProps = (state) => {
  const form = state.form.ReaderInfo;
  const uuid = form ? form.values.uuid : '';
  return {
    readerInfo: {
      id: selector(state, 'id'),
      uuid
    },
    isValid: form ? !form.syncErrors : false,
    allReaders: state.readers.allReaders
  };
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(ReaderDialog)));
