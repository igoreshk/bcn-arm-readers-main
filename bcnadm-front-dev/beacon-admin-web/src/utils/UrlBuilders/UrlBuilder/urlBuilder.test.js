import { linkBuilder } from '../linkBuilder';

const BUILDING_ID = '012345678901234567890123';
const USER_ID = 'CCDDD5678901234567890123';
const LEVEL_ID = 'AAAAA56789012345678BBBBB';
const BEACON_ID = 'AAAAA56789012345678CCCCC';
const EDGE_ID = 'DDDDD55555577777778DDDDD';
const VERTEX_ID = 'EEEEE99999997777778EEEEE';
const VERTEX2_ID = 'AAAEE77777777777778FFFFF';
const AREA_ID = 'BBBBB99999997777778EEEEE';
const SCALE_ID = 'CCCBB55558887777778CCCFF';
const SCALE_VERTEX_ID = 'CCDDD555588DD777778DDDDF';
const FILE_ID = '5afe97f8cc7b9d2f0f652';
const VISITOR_GROUP_ID = '60d1d11d52be2510f6c3e6dd';

const API_PREFIX = process.env.API_PREFIX;
const BUILDINGS_URL = `${API_PREFIX}/buildings`;
const BUILDING_WITH_ID_URL = `${BUILDINGS_URL}/${BUILDING_ID}`;
const LEVELS_URL = `${BUILDING_WITH_ID_URL}/levels`;
const LEVEL_BY_ID_URL = `${LEVELS_URL}/${LEVEL_ID}`;

const BUILDINGS_LEVELS_URL = LEVEL_BY_ID_URL;
const BEACONS_URL = `${API_PREFIX}/beacons`;
const AREAS_URL = `${BUILDINGS_LEVELS_URL}/areas`;
const BEACON_BY_ID_URL = `${BEACONS_URL}/${BEACON_ID}`;
const AREA_BY_ID_URL = `${AREAS_URL}/${AREA_ID}`;
const VERTICES_URL = `${API_PREFIX}/vertices`;
const EDGES_URL = `${API_PREFIX}/edges`;
const SCALES_URL = `${BUILDINGS_LEVELS_URL}/scale`;
const SCALE_VERTICES_URL = `${API_PREFIX}/scale-vertex`;
const VISITOR_GROUPS_URL = `${API_PREFIX}/visitor-groups`;

const VERTEX_BY_ID_URL = `${VERTICES_URL}/${VERTEX_ID}`;
const VERTICES_BY_LEVEL_ID = `${VERTICES_URL}/byLevel/${LEVEL_ID}`;
const VERTICES_BY_EDGE_ID_URL = `${VERTICES_URL}/byEdge/${EDGE_ID}`;
const EDGE_BY_VERTEX_ID_URL = `${EDGES_URL}/byVertex/${VERTEX_ID}`;

const EDGE_BY_VERTICES_ID_URL = `${EDGES_URL}/byVertices/${VERTEX_ID}/${VERTEX2_ID}`;
const EDGE_BY_LEVEL_ID_URL = `${EDGES_URL}/byLevel/${LEVEL_ID}`;

const SCALE_VERTEX_BY_ID_URL = `${SCALE_VERTICES_URL}/${SCALE_VERTEX_ID}`;
const SCALE_BY_ID_URL = `${SCALES_URL}/${SCALE_ID}`;
const SCALES_CLEAR_BY_LEVEL_ID_URL = `${SCALES_URL}/clear`;

const SCALE_BY_VERTEX_ID_URL = `${SCALES_URL}/byVertex/${SCALE_VERTEX_ID}`;
const SCALE_VERTICES_BY_SCALE_ID_URL = `${SCALE_VERTICES_URL}/byEdge/${SCALE_ID}`;

const SCALE_VERTICES_BY_LEVEL_ID_URL = `${SCALE_VERTICES_URL}/byLevel/${LEVEL_ID}`;

const FILES_UPLOAD_URL = `${API_PREFIX}/files/upload/${FILE_ID}`;
const FILES_IMG_URL = `${API_PREFIX}/files/img/${FILE_ID}`;

const USERS_URL = `${API_PREFIX}/users`;
const USERS_LOGIN = 'login';
const USERS_EMAIL = 'test@test.com';
const USERS_URL_BY_ID = `${USERS_URL}/${USER_ID}`;
const USERS_URL_BY_LOGIN = `${USERS_URL}/by-login/${USERS_LOGIN}`;
const USERS_URL_CURRENT = `${USERS_URL}/current`;
const USERS_URL_CURRENT_IMAGE = `${USERS_URL_CURRENT}/image`;
const USERS_URL_LOGIN_IMAGE = `${USERS_URL}/${USERS_LOGIN}/image`;
const USERS_URL_CHECK_LOGIN = `${USERS_URL}/check-login/${USERS_LOGIN}`;
const USERS_URL_CHECK_EMAIL = `${USERS_URL}/check-email/${USERS_EMAIL}`;
const USERS_URL_CHANGE = `${USERS_URL}/`;
const USERS_URL_ROLES = `${USERS_URL}/roles`;
const USERS_SHOULD_ADD_TRAILING_SLASH = true;

const VISITOR_GROUP_BY_ID_URL = `${VISITOR_GROUPS_URL}/${VISITOR_GROUP_ID}`;
const VISITOR_GROUP_BY_ID_AND_LEVEL_ID_URL = `${VISITOR_GROUP_BY_ID_URL}/levels/${LEVEL_ID}`;

let builder;

describe('building url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build root url', () => {
    expect(builder.build()).toEqual(`${API_PREFIX}/`);
  });

  it('build buildings url', () => {
    expect(
      builder
        .building()
        .and()
        .build()
    ).toEqual(BUILDINGS_URL);
  });

  it('build building url with id', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .build()
    ).toEqual(BUILDING_WITH_ID_URL);
  });
});

describe('level url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build url with buildingId and without levelId', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level()
        .and()
        .build()
    ).toEqual(LEVELS_URL);
  });

  it('build url with buildingId and levelId', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .build()
    ).toEqual(LEVEL_BY_ID_URL);
  });
});

describe('beacons url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build url for beacons', () => {
    expect(
      builder
        .beacon()
        .and()
        .build()
    ).toEqual(BEACONS_URL);
  });

  it('build url by beaconId', () => {
    expect(
      builder
        .beacon(BEACON_ID)
        .and()
        .build()
    ).toEqual(BEACON_BY_ID_URL);
  });
});

describe('areas url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('area url for areas', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .area()
        .and()
        .build()
    ).toEqual(AREAS_URL);
  });

  it('build url by areaId', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .area(AREA_ID)
        .and()
        .build()
    ).toEqual(AREA_BY_ID_URL);
  });
});

describe('routes (vertex & edge) url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build vertices url', () => {
    expect(
      builder
        .vertex()
        .and()
        .build()
    ).toEqual(VERTICES_URL);
  });

  it('build vertex by id url', () => {
    expect(
      builder
        .vertex(VERTEX_ID)
        .and()
        .build()
    ).toEqual(VERTEX_BY_ID_URL);
  });

  it('build vertices by edge id url', () => {
    expect(
      builder
        .vertex()
        .byEdge(EDGE_ID)
        .and()
        .build()
    ).toEqual(VERTICES_BY_EDGE_ID_URL);
  });

  it('build vertices by levelId', () => {
    expect(
      builder
        .vertex()
        .byLevel(LEVEL_ID)
        .and()
        .build()
    ).toEqual(VERTICES_BY_LEVEL_ID);
  });

  it('build edges url', () => {
    expect(
      builder
        .edge()
        .and()
        .build()
    ).toEqual(EDGES_URL);
  });

  it('build edge by vertex id url', () => {
    expect(
      builder
        .edge()
        .byVertex(VERTEX_ID)
        .and()
        .build()
    ).toEqual(EDGE_BY_VERTEX_ID_URL);
  });

  it('build get edge by vertices id url', () => {
    expect(
      builder
        .edge()
        .byVertices(VERTEX_ID, VERTEX2_ID)
        .and()
        .build()
    ).toEqual(EDGE_BY_VERTICES_ID_URL);
  });

  it('build get edge by level Id', () => {
    expect(
      builder
        .edge()
        .byLevel(LEVEL_ID)
        .and()
        .build()
    ).toEqual(EDGE_BY_LEVEL_ID_URL);
  });
});

describe('files url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('file url for upload files', () => {
    expect(
      builder
        .files(FILE_ID)
        .upload()
        .build()
    ).toEqual(FILES_UPLOAD_URL);
  });

  it('file url for image files', () => {
    expect(
      builder
        .files(FILE_ID)
        .img()
        .build()
    ).toEqual(FILES_IMG_URL);
  });
});

describe('scales & scale-vertices url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build scales url', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .scale()
        .and()
        .build()
    ).toEqual(SCALES_URL);
  });

  it('build scale-vertices url', () => {
    expect(
      builder
        .scaleVertex()
        .and()
        .build()
    ).toEqual(SCALE_VERTICES_URL);
  });

  it('build scale by id url', () => {
    expect(
      builder
        .scaleVertex(SCALE_VERTEX_ID)
        .and()
        .build()
    ).toEqual(SCALE_VERTEX_BY_ID_URL);
  });

  it('build scale by vertex id url', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .scale()
        .byVertex(SCALE_VERTEX_ID)
        .and()
        .build()
    ).toEqual(SCALE_BY_VERTEX_ID_URL);
  });

  it('build scale vertices by scale (edge) id url', () => {
    expect(
      builder
        .scaleVertex()
        .byEdge(SCALE_ID)
        .and()
        .build()
    ).toEqual(SCALE_VERTICES_BY_SCALE_ID_URL);
  });

  it('build scale vertices by level id url', () => {
    expect(
      builder
        .scaleVertex()
        .and()
        .byLevel(LEVEL_ID)
        .and()
        .build()
    ).toEqual(SCALE_VERTICES_BY_LEVEL_ID_URL);
  });

  it('build scale by id url', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .scale(SCALE_ID)
        .and()
        .build()
    ).toEqual(SCALE_BY_ID_URL);
  });

  it('build clear scales by level id url', () => {
    expect(
      builder
        .building(BUILDING_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .scale()
        .clear()
        .and()
        .build()
    ).toEqual(SCALES_CLEAR_BY_LEVEL_ID_URL);
  });
});

describe('user url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });

  it('build url for user', () => {
    expect(
      builder
        .user(USER_ID)
        .and()
        .build()
    ).toEqual(USERS_URL_BY_ID);
  });

  it('build url for user by login', () => {
    expect(
      builder
        .user()
        .byLogin('login')
        .and()
        .build()
    ).toEqual(USERS_URL_BY_LOGIN);
  });

  it('build user url for current', () => {
    expect(
      builder
        .user()
        .current()
        .and()
        .build()
    ).toEqual(USERS_URL_CURRENT);
  });

  it('build user url for current image', () => {
    expect(
      builder
        .user()
        .current()
        .image()
        .and()
        .build()
    ).toEqual(USERS_URL_CURRENT_IMAGE);
  });

  it('build user url for image by login', () => {
    expect(
      builder
        .user(USERS_LOGIN)
        .image()
        .and()
        .build()
    ).toEqual(USERS_URL_LOGIN_IMAGE);
  });

  it('build user url for check login', () => {
    expect(
      builder
        .user()
        .checkLogin(USERS_LOGIN)
        .and()
        .build()
    ).toEqual(USERS_URL_CHECK_LOGIN);
  });

  it('build user url for check email', () => {
    expect(
      builder
        .user()
        .checkEmail(USERS_EMAIL)
        .and()
        .build()
    ).toEqual(USERS_URL_CHECK_EMAIL);
  });

  it('build user url for change login and email and password and save profile', () => {
    expect(
      builder
        .user()
        .and()
        .build(USERS_SHOULD_ADD_TRAILING_SLASH)
    ).toEqual(USERS_URL_CHANGE);
  });

  it('build user url for frontend', () => {
    expect(
      builder
        .user()
        .and()
        .frontend()
        .and()
        .build()
    ).toEqual(`${API_PREFIX}/users/frontend`);
  });

  it('build user url for roles', () => {
    expect(
      builder
        .user()
        .and()
        .role()
        .and()
        .build()
    ).toEqual(USERS_URL_ROLES);
  });
});

describe('watcher url builder test', () => {
  beforeEach(() => {
    builder = linkBuilder();
  });
  it('builds visitor groups by id and level id url', () => {
    expect(
      builder
        .visitorGroup(VISITOR_GROUP_ID)
        .and()
        .level(LEVEL_ID)
        .and()
        .build()
    ).toEqual(VISITOR_GROUP_BY_ID_AND_LEVEL_ID_URL);
  });
});
