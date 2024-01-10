import { BUILDINGS_DID_INVALIDATE, SET_BUILDING_FORM_CURRENTSTEP } from './actionTypes';

export const setBuildingsInvalidate = () => ({
  type: BUILDINGS_DID_INVALIDATE
});

export const setBuildingFormCurrentStep = (currentStep, currentStepIndex) => ({
  type: SET_BUILDING_FORM_CURRENTSTEP,
  currentStep,
  currentStepIndex
});
