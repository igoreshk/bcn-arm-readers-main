import { BUILDINGS_DID_INVALIDATE, SET_BUILDING_FORM_CURRENTSTEP } from 'src/actions/actionTypes';

const initialState = {
  isFetching: false,
  wasError: false,
  buildings: [],
  didInvalidate: true,
  currentStep: 'SET_BUILDING_INFO',
  currentStepIndex: 0
};

export default function buildingsReducer(state = initialState, action) {
  switch (action.type) {
    case BUILDINGS_DID_INVALIDATE:
      return {
        ...state,
        didInvalidate: true
      };
    case SET_BUILDING_FORM_CURRENTSTEP:
      return {
        ...state,
        currentStep: action.currentStep,
        currentStepIndex: action.currentStepIndex
      };
    default:
      return state;
  }
}
