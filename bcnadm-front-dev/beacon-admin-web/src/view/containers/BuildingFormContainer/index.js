import { submitBuilding } from 'src/view/components/operatorinterface/buildingForm/SubmitBuilding';
import { validate } from 'src/view/components/operatorinterface/buildingForm/ValidateBuildingForm';
import BuildingForm from 'src/view/components/operatorinterface/buildingForm/BuildingForm';
import { BUILDING_DIALOG_FORM } from 'src/consts/FormsNames';
import { isNewInstance } from 'src/view/components/common/InstanceValidation';
import { addPopupMessageText } from 'src/actions/popupMessage';
import { connect } from 'react-redux';
import { formValueSelector, reduxForm } from 'redux-form';
import { BuildingImageService } from 'src/service/BuildingImageService';

const selector = formValueSelector(BUILDING_DIALOG_FORM);

const mapStateToProps = (state, props) => {
  const building = props.currentBuilding;
  const levels = props.levels;

  return {
    initialValues: {
      entityId: building.entityId,
      levels: getLevelsInitialValue('levels', state, levels),
      name: getInitialValue('name', state, building),
      latitude: getInitialValue('latitude', state, building),
      longitude: getInitialValue('longitude', state, building),
      mapImage: getInitialValue('mapImage', state, building),
      fileId: getInitialValue('fileId', state, building),
      address: getInitialValue('address', state, building),
      phoneNumber: getInitialValue('phoneNumber', state, building),
      workingHours: getInitialValue('workingHours', state, building),
      customFields: getInitialValue('customFields', state, building),
      height: getInitialValue('height', state, building),
      width: getInitialValue('width', state, building)
    },

    imageLink: !isNewInstance(building) ? BuildingImageService.getBuildingImageLink(building.entityId) : null,
    name: selector(state, 'name'),
    latitude: selector(state, 'latitude'),
    longitude: selector(state, 'longitude'),
    mapImage: selector(state, 'mapImage'),
    fileId: selector(state, 'fileId'),
    address: selector(state, 'address'),
    workingHours: selector(state, 'workingHours'),
    phoneNumber: selector(state, 'phoneNumber'),
    customFields: selector(state, 'customFields'),
    height: selector(state, 'height'),
    width: selector(state, 'width'),
    enableReinitialize: false,
    isNew: isNewInstance(building),

    savedCurrentStep: state.buildings.currentStep,
    savedCurrentStepIndex: state.buildings.currentStepIndex
  };
};

function getInitialValue(fieldName, state, building) {
  return selector(state, fieldName) ? selector(state, fieldName) : building[fieldName];
}

function getLevelsInitialValue(fieldName, state, levels) {
  return selector(state, fieldName)
    ? selector(state, fieldName)
    : levels.map((level) => {
        return { ...level };
      });
}

const mapDispatchToProps = {
  addPopupMessageText
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(
  reduxForm({
    form: BUILDING_DIALOG_FORM,
    validate,
    onSubmit: submitBuilding
  })(BuildingForm)
);
