import VisitorFormContainer from 'src/view/containers/VisitorDialogFormContainer';
import VisitorService from 'src/service/VisitorService';
import { VISITORS_LIST } from 'src/consts/RouteConsts';
import { VISITOR_DIALOG_FORM } from 'src/consts/FormsNames';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { ERROR } from 'src/utils/popUpConsts';
import { isVisitorNameUnique, isDeviceIdUnique } from 'src/utils/checkUniquenessOfVisitor';

const TIME_OUT = 400;
const newVisitorEntity = {
  entityId: null,
  name: null,
  deviceId: null,
  type: 'EMITTER'
};

let currentVisitorType;

export class VisitorDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visitor: null,
      isAppropriateName: false,
      isAppropriateDeviceId: false,
      visitorsList: []
    };
  }

  componentDidMount() {
    this.props.showLoadingScreen();
    this.loadVisitor();
    VisitorService.findAll()
      .then((visitors) => {
        this.setState({ visitorsList: visitors });
      })
      .catch((err) => {
        throw err;
      });
  }

  async loadVisitor() {
    const {
      translate,
      addPopupMessageText: addPopupText,
      hideLoadingScreen: hideLoading,
      history,
      match: {
        params: { id }
      }
    } = this.props;
    try {
      if (id === 'new') {
        this.setState({ visitor: newVisitorEntity, isAppropriateName: false, isAppropriateDeviceId: false });
        currentVisitorType = 'EMITTER';
      } else {
        const visitor = await VisitorService.findOne(id);
        this.setState({ visitor, isAppropriateName: true, isAppropriateDeviceId: true });
        currentVisitorType = visitor.type;
      }
    } catch {
      history.push(VISITORS_LIST);
      const errorText =
        id === 'new' ? translate('visitors.createVisitorError') : translate('visitors.openVisitorError');
      addPopupText(errorText, ERROR);
    } finally {
      setTimeout(() => hideLoading(), TIME_OUT); // for smoothness
    }
  }

  handleOnChangeName = (e) => {
    this.setState({ isAppropriateName: this.checkIfNameIsAppropriate(e.target.value) });
  };

  handleOnChangeDeviceId = (e) => {
    this.setState({ isAppropriateDeviceId: this.checkIfDeviceIdIsAppropriate(e.target.value) });
  };

  checkIfNameIsAppropriate = (name) => {
    const { visitorsList } = this.state;
    const { id } = this.props.match.params;
    return isVisitorNameUnique(visitorsList, name, id);
  };

  checkIfDeviceIdIsAppropriate = (deviceId) => {
    const { visitorsList } = this.state;
    const { id } = this.props.match.params;
    return isDeviceIdUnique(visitorsList, deviceId, id);
  };

  saveVisitor = () => {
    const { values, history, addPopupMessageText: addPopupText, translate } = this.props;
    VisitorService.saveVisitor(values)
      .then(() =>
        history.push({
          pathname: VISITORS_LIST,
          updated: true
        })
      )
      .catch(() => {
        history.push(VISITORS_LIST);
        const errorText = translate('visitors.dialog.saveVisitorError');
        addPopupText(errorText, ERROR);
      });
  };

  cancel = () => {
    this.props.history.push(VISITORS_LIST);
  };

  render() {
    const { visitor, isAppropriateName, isAppropriateDeviceId } = this.state;

    if (visitor) {
      return (
        <VisitorFormContainer
          visitor={visitor}
          saveVisitor={this.saveVisitor}
          cancel={this.cancel}
          handleOnChangeName={this.handleOnChangeName}
          handleOnChangeDeviceId={this.handleOnChangeDeviceId}
          isAppropriateName={isAppropriateName}
          isAppropriateDeviceId={isAppropriateDeviceId}
        />
      );
    }

    return null;
  }
}

VisitorDialog.propTypes = {
  match: PropTypes.object.isRequired,
  showLoadingScreen: PropTypes.func.isRequired,
  hideLoadingScreen: PropTypes.func.isRequired,
  addPopupMessageText: PropTypes.func.isRequired,
  values: PropTypes.object,
  history: PropTypes.object
};

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen,
  addPopupMessageText
};

const mapStateToProps = (state) => {
  const visitorForm = state.form[VISITOR_DIALOG_FORM];
  return {
    values: visitorForm ? { ...visitorForm.values, type: currentVisitorType } : null
  };
};

export default withRouter(withLocalize(connect(mapStateToProps, mapDispatchToProps)(VisitorDialog)));
