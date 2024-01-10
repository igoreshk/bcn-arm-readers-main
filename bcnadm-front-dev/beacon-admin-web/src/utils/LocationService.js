/* @flow */

import { BUILDINGS, LEVELS, EDIT } from 'src/consts/RouteConsts';
import { modes } from 'src/view/map/MapConsts';

const LocationService = {};

LocationService.getAreaLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.AREAS_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getRoutingLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.ROUTE_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getBeaconsLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.BEACON_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getReadersLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.READER_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getDrawingLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.DRAWING_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getScalingLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.SCALE_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getMonitoringLocation = (buildingId, levelId, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.MONITORING_MODE}${isEditMode ? EDIT : ''}`;
};

LocationService.getLayerLocation = (buildingId, levelId, layer, isEditMode) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${layer}${isEditMode ? EDIT : ''}`;
};

LocationService.getBeaconsDialogLocation = (buildingId, levelId, isEditMode, beaconId) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.BEACON_MODE}${EDIT}/${beaconId}`;
};

LocationService.getReadersDialogLocation = (buildingId, levelId, isEditMode, readerId) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.READER_MODE}${EDIT}/${readerId}`;
};

LocationService.getAreasDialogLocation = (buildingId, levelId, areaId) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.AREAS_MODE}${EDIT}/${areaId}`;
};

LocationService.getScalingDialogLocation = (buildingId, levelId, isEditMode, edgeId) => {
  return `${BUILDINGS}/${buildingId}${LEVELS}/${levelId}/${modes.SCALE_MODE}${EDIT}/${edgeId}`;
};

export { LocationService };
