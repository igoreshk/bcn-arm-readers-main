import * as types from 'src/actions/actionTypes';

export const edgesToDelete = 'edgesToDelete';
export const response = 'response';
export const deletedBeacon = 'deletedBeacon';
export const deletedArea = 'deletedArea';
export const deletedVertex = 'deletedVertex';
export const beacons = 'beacons';
export const beacon = 'beacon';
export const err = 'err';
export const row = 'row';
export const buildings = 'buildings';
export const edge = 'edge';
export const id = 'id';
export const image = 'image';
export const level = 'level';
export const url = 'url';
export const building = 'building';
export const levelsArray = 'levelsArray';
export const count = 'count';
export const data = 'data';
export const areas = 'areas';
export const areaInfo = 'areaInfo';
export const arr = 'arr';
export const scale = 'scale';
export const vertices = 'vertices';
export const vertex = 'vertex';
export const area = 'area';
export const vertexWithId = 'vertexWithId';
export const applicationTitle = 'be@con';
export const applicationDefaultBaseUrl = 'http://localhost:10020';
export const settingData = 'be@con';
export const icon = '/sample/link';
export const error = 'error';

export const clearBeaconsSuccessAction = {
  type: types.CLEAR_BEACONS
};
export const deleteBeaconSuccessAction = {
  type: types.DELETE_BEACON,
  payload: { deletedBeacon }
};
export const clearAreasSuccessAction = {
  type: types.CLEAR_AREAS,
  payload: { response }
};
export const deleteAreaSuccessAction = {
  type: types.DELETE_AREA,
  payload: { deletedArea }
};
export const getBeaconsSuccessAction = {
  type: types.LOAD_BEACONS_SUCCESS,
  payload: { beacons }
};
export const getBeaconsStartAction = {
  type: types.LOAD_BEACONS_START
};
export const getBeaconsErrorAction = {
  type: types.LOAD_BEACONS_ERROR,
  payload: { error: err }
};
export const addBeaconRefAction = {
  type: types.ADD_BEACON_REF,
  payload: { beacon }
};
export const getBuildingsSuccessAction = {
  type: types.LOAD_BUILDINGS_SUCCESS,
  payload: { buildings }
};
export const getBuildingsStartAction = {
  type: types.LOAD_BUILDINGS_START
};
export const getBuildingsFailAction = {
  type: types.LOAD_BUILDINGS_FAIL
};
export const openAddFormAction = {
  type: types.OPEN_ADD_FORM
};
export const openUpdateFormAction = {
  type: types.OPEN_UPDATE_FORM,
  payload: { rowId: row }
};
export const closeAddFormAction = {
  type: types.CLOSE_ADD_FORM
};
export const closeUpdateFormAction = {
  type: types.CLOSE_UPDATE_FORM,
  payload: { rowId: -1 }
};
export const saveImagePreviewAction = {
  type: types.SAVE_IMAGE_PREVIEW,
  payload: {
    mainImage: image
  }
};
export const saveMapPreviewAction = {
  type: types.SAVE_MAP_PREVIEW,
  payload: {
    image,
    id
  }
};
export const getMapSuccessAction = {
  type: types.LOAD_MAP_SUCCESS,
  payload: {
    imageURL: url,
    buildingIdx: building,
    levelIdx: level,
    levels: levelsArray
  }
};
export const getMapStartAction = {
  type: types.LOAD_MAP_START,
  payload: {
    buildingIdx: building,
    levelIdx: level,
    levels: levelsArray
  }
};
export const getMapFailAction = {
  type: types.LOAD_MAP_FAIL
};
export const showObjectFormAction = {
  type: types.SHOW_OBJECT_FORM
};
export const showLevelsFormAction = {
  type: types.SHOW_LEVELS_FORM,
  payload: {
    levels: count
  }
};
export const saveLevelsDataAction = {
  type: types.SAVE_LEVELS_DATA,
  payload: {
    levelsData: data
  }
};
export const getAreasSuccessAction = {
  type: types.LOAD_AREAS_SUCCESS,
  payload: { areas }
};
export const getAreasStartAction = {
  type: types.LOAD_AREAS_START
};
export const getAreasErrorAction = {
  type: types.LOAD_AREAS_ERROR,
  payload: { error: err }
};
export const getAreasInfoSuccessAction = {
  type: types.LOAD_AREAS_INFO_SUCCESS,
  payload: { areaInfo }
};
export const getAreasInfoStartAction = {
  type: types.LOAD_AREAS_INFO_START
};
export const getAreasInfoErrorAction = {
  type: types.LOAD_AREAS_INFO_ERROR,
  payload: { error: err }
};
export const getRolesStartAction = {
  type: types.FETCH_ROLES_START
};
export const getRolesSuccessAction = {
  type: types.FETCH_ROLES_SUCCEED,
  payload: { data: arr }
};
export const getRolesFailAction = {
  type: types.FETCH_ROLES_FAILED
};
export const getScaleSuccessAction = {
  type: types.LOAD_SCALE_SUCCESS,
  payload: { scale }
};
export const getScaleStartAction = {
  type: types.LOAD_SCALE_START
};
export const getScaleErrorAction = {
  type: types.LOAD_SCALE_ERROR,
  payload: { error: err }
};
export const getUsersRowAction = {
  type: types.GET_USER_ADD_ROW,
  payload: { tableData: data }
};
export const getUsersSuccessAction = {
  type: types.GET_USER_SUCCESS,
  payload: { data: arr }
};
export const getUsersFailAction = {
  type: types.GET_USER_ERROR,
  payload: { error: err }
};
export const getUsersStartAction = {
  type: types.GET_USER_START
};
export const setUsersInvalidateAction = {
  type: types.GET_USER_SET_INVALIDATE
};
export const saveBeaconSuccessAction = {
  type: types.ADD_BEACON_REF,
  payload: { beacon }
};
export const saveAreaSuccessAction = {
  type: types.ADD_AREA_REF,
  payload: { area }
};
export const selectBeaconAction = {
  type: types.SET_CURRENT_BEACON,
  payload: { currentBeacon: beacon }
};
export const loadImageSizeAction = {
  type: types.LOAD_IMAGE_SIZE,
  payload: { size: 'size' }
};
export const loadImageSizeStartAction = {
  type: types.LOAD_IMAGE_SIZE_START
};
export const loadImageSizeSuccessAction = {
  type: types.LOAD_IMAGE_SIZE_SUCCESS
};
export const saveProjectionAction = {
  type: types.SAVE_PROJECTION,
  payload: { projection: 'projection' }
};
export const saveMapAction = {
  type: types.SAVE_MAP,
  payload: { map: 'map' }
};
export const loadAppTitleSuccess = {
  type: types.LOAD_APP_TITLE_SUCCESS,
  payload: { title: 'be@con' }
};
export const loadAppBaseUrlSuccess = {
  type: types.LOAD_APP_BASE_URL_SUCCESS,
  payload: { baseUrl: 'http://localhost:10020' }
};
export const saveSettingSuccess = {
  type: types.SAVE_SETTING_SUCCESS,
  payload: { data: 'be@con' }
};

export const saveAppIconSuccess = {
  type: types.SAVE_APP_ICON_SUCCESS,
  payload: { icon: '/sample/link' }
};

export const closeObjectFormAction = {
  type: types.CLOSE_OBJECT_FORM
};

export const readerNames = {
  type: types.SET_READER_NAMES,
  payload: {
    readersInfo: [{ uuid: 'stationIdName' }, { uuid: 'stationIdName2' }]
  }
};

export const userSettings = {
  type: types.SAVE_USER_SETTINGS,
  payload: {
    settings: {
      locale: 'ru',
      userIcon: '',
      firstName: 'John',
      lastName: 'Doe'
    }
  }
};
