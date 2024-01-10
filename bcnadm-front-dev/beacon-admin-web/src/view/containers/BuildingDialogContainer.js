import BuildingDialog from 'src/view/components/operatorinterface/buildingForm/BuildingDialog';
import { hideLoadingScreen, showLoadingScreen } from 'src/actions/loadingScreen';
import { connect } from 'react-redux';
import { withLocalize } from 'react-localize-redux';

const mapStateToProps = (state) => ({
  isFetching: state.loading.processesFetching
});

const mapDispatchToProps = {
  showLoadingScreen,
  hideLoadingScreen
};

export default connect(mapStateToProps, mapDispatchToProps)(withLocalize(BuildingDialog));
