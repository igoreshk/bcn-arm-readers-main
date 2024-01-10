import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import VisitorGroupsService from 'src/service/VisitorGroupsService';
import VisitorService from 'src/service/VisitorService';
import { WATCHERS_LIST } from 'src/consts/RouteConsts';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { withLocalize } from 'react-localize-redux';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import WatcherForm from './WatcherForm';

const TIME_OUT = 400;
const newWatcherEntity = {
  entityId: null,
  name: null,
  visitorIds: []
};

export class WatcherDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitorsList: [],
      visitorGroupsNamesList: [],
      watcher: null,
      isLoading: false,
      isAppropriateName: null,
      originalName: null
    };
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadWatcher();

    VisitorService.findAll()
      .then((visitors) => {
        this.setState({ visitorsList: visitors });
      })
      .catch((err) => {
        throw err;
      });
    VisitorGroupsService.findAll()
      .then((visitorGroups) => {
        this.setState({ visitorGroupsNamesList: visitorGroups.map((visitorGroup) => visitorGroup.name) });
      })
      .catch((err) => {
        throw err;
      });
  }

  async loadWatcher() {
    const { id } = this.props.match.params;
    try {
      if (id === 'new') {
        this.setState({ watcher: newWatcherEntity, isAppropriateName: null });
      } else {
        const watcher = await VisitorGroupsService.findOne(id);
        this.setState({ watcher, originalName: watcher.name, isAppropriateName: true });
      }
    } catch {
      this.props.history.push(WATCHERS_LIST);
      const errorText =
        id === 'new'
          ? this.props.translate('watchers.createWatcherError')
          : this.props.translate('watchers.openWatcherError');
      this.props.addPopupMessageText(errorText, ERROR);
    } finally {
      setTimeout(() => this.props.hideLoadingScreen(), TIME_OUT);
    }
  }

  saveWatcher = () => {
    const { history } = this.props;
    const { watcher } = this.state;
    this.setState((prevState) => ({
      isLoading: !prevState.isLoading
    }));
    VisitorGroupsService.saveWatcher(watcher)
      .then(() => {
        history.push({
          pathname: WATCHERS_LIST,
          updated: true
        });
        this.props.hideLoadingScreen();
      })
      .catch(() => {
        history.push({
          pathname: WATCHERS_LIST,
          updated: true
        });
        this.props.hideLoadingScreen();
        this.props.addPopupMessageText(this.props.translate('watchers.addWatcherError'), ERROR);
      });
  };

  cancel = () => {
    this.setState((prevState) => ({
      isLoading: !prevState.isLoading
    }));
    this.props.history.push(WATCHERS_LIST);
  };

  handleOnChange = (e) => {
    e.persist();
    this.setState((prevState) => ({
      watcher: {
        ...prevState.watcher,
        name: e.target.value
      },
      isAppropriateName: this.checkIfNameIsAppropriate(
        e.target.value,
        prevState.visitorGroupsNamesList,
        prevState.originalName
      )
    }));
  };

  handleOnClick = (visitorIds) => {
    this.setState((prevState) => ({
      watcher: {
        ...prevState.watcher,
        visitorIds
      }
    }));
  };

  checkIfNameIsAppropriate = (visitorGroupName, visitorGroupNamesList, originalName) => {
    return !visitorGroupNamesList.includes(visitorGroupName) || visitorGroupName === originalName;
  };

  render() {
    const { watcher, visitorsList, isLoading, isAppropriateName } = this.state;

    if (watcher) {
      return (
        <WatcherForm
          handleOnChange={this.handleOnChange}
          watcher={watcher}
          saveWatcher={this.saveWatcher}
          cancel={this.cancel}
          selectVisitorsIds={this.handleOnClick}
          visitorsList={visitorsList}
          translate={this.props.translate}
          isLoading={isLoading}
          isAppropriateName={isAppropriateName}
        />
      );
    }
    return null;
  }
}

WatcherDialog.propTypes = {
  translate: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  addPopupMessageText
};

export default withRouter(withLocalize(connect(null, mapDispatchToProps)(WatcherDialog)));
