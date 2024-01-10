import { isVisitorNameUnique, isDeviceIdUnique } from './index';

const visitorListMock = [
  { name: 'vis1',
  deviceId: 'id1',
  entityId: '1'
  },
  { name: 'vis2',
  deviceId: 'id2',
  entityId: '2'
  },
  { name: 'vis3',
  deviceId: 'id3',
  entityId: '3'
  }
];

const idMockNew = 'new';
const entityId1 = '1';
const entityId2 = '2';
const nameMockNew = 'newVis';
const nameMock1 = 'vis1';
const deviceIdMockNew = 'newDeviceId';
const deviceIdMock1 = 'id1';

describe('isVisitorNameUnique', () => {
  it('should return true when visitor is new and no visitor with same name exist', () => {
    expect(isVisitorNameUnique(visitorListMock, nameMockNew, idMockNew)).toEqual(true);
  });

  it('should return false when current visitor is new and visitor with same name exist', () => {
    expect(isVisitorNameUnique(visitorListMock, nameMock1, idMockNew)).toEqual(false);
  });

  it('should return true when visitor is not new and there is no visitor with same name', () => {
    expect(isVisitorNameUnique(visitorListMock, nameMockNew, entityId1)).toEqual(true);
  });

  it('should return true when visitor is not new and visitor with same name has the same id as current visitors id', () => {
    expect(isVisitorNameUnique(visitorListMock, nameMock1, entityId1)).toEqual(true);
  });

  it('should return false when visitor is not new, visitor with same name exist and its id is not the same as current visitors id', () => {
    expect(isVisitorNameUnique(visitorListMock, nameMock1, entityId2)).toEqual(false);
  });
});

describe('isDeviceIdUnique', () => {
  it('should return true when visitor is new and no visitor with same deviceId exist', () => {
    expect(isDeviceIdUnique(visitorListMock, deviceIdMockNew, idMockNew)).toEqual(true);
  });

  it('should return false when current visitor is new and visitor with same deviceId exist', () => {
    expect(isDeviceIdUnique(visitorListMock, deviceIdMock1, idMockNew)).toEqual(false);
  });

  it('should return true when visitor is not new and there is no visitor with same deviceId', () => {
    expect(isDeviceIdUnique(visitorListMock, deviceIdMockNew, entityId1)).toEqual(true);
  });

  it('should return true when visitor is not new and visitor with same deviceId has the same id as current visitors id', () => {
    expect(isDeviceIdUnique(visitorListMock, deviceIdMock1, entityId1)).toEqual(true);
  });

  it('should return false when visitor is not new, visitor with same deviceId exist and its id is not the same as current visitors id', () => {
    expect(isDeviceIdUnique(visitorListMock, deviceIdMock1, entityId2)).toEqual(false);
  });
});
