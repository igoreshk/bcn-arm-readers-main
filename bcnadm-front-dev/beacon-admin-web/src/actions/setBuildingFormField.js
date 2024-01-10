import { SET_BUILDING_FORM_FIELD } from './actionTypes';

export const setBuildingFormField = (fieldName, payload) => ({
  type: SET_BUILDING_FORM_FIELD,
  meta: {
    form: 'BuildingForm',
    field: fieldName,
    touch: false,
    persistentSubmitErrors: false
  },
  payload
});
