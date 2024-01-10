import OSMapConfiguration from './index';

jest.mock('service/BeaconService');
jest.mock('service/BuildingService');

describe('OSMapConfiguration tests', () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'OSMap');
  document.body.appendChild(div);

  const mapCenter = [30, 50];
  const defaultZoom = 18;
  const mapConfiguration = new OSMapConfiguration(mapCenter);

  it('createMap should work with promise', () => {
    const mapOptions = {
      center: mapCenter,
      zoom: defaultZoom
    };

    expect.assertions(1);
    return mapConfiguration.createMap().then((map) => {
      expect(map.options).toEqual(mapOptions);
    });
  });

  it('getImageAndCalculateBounds should work with promise', () => {
    const map = {
      panTo: jest.fn(),
      getCenter: jest.fn().mockReturnValue(mapCenter),
      latLngToLayerPoint: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      layerPointToLatLng: jest.fn()
    };
    const levelId = 'TESTlevelId';
    const size = {
      height: 50,
      width: 30
    };
    const pixelsPerMeter = 10;

    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 100);
      }
    };

    const bounds = {};
    const result = {
      bounds,
      imageLink: `/api/v1/levels/${levelId}/image`
    };

    expect.assertions(1);
    return expect(mapConfiguration.getImageAndCalculateBounds(map, levelId, size, pixelsPerMeter)).resolves.toEqual(
      result
    );
  });

  it('getImageAndCalculateBounds should throw error', () => {
    const map = {
      panTo: jest.fn(),
      getCenter: jest.fn().mockReturnValue(mapCenter),
      latLngToLayerPoint: jest.fn().mockReturnValue({ x: 100, y: 100 }),
      layerPointToLatLng: jest.fn()
    };
    const levelId = 'TESTlevelId';
    const size = {
      height: 50,
      width: 30
    };
    const pixelsPerMeter = 10;

    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.onerror();
        }, 100);
      }
    };
    return expect(mapConfiguration.getImageAndCalculateBounds(map, levelId, size, pixelsPerMeter)).rejects.toEqual(
      expect.any(Error)
    );
  });

  it('configureOverlay should add 3 layers to map', () => {
    let layerCounter = 0;
    const map = {
      addLayer: jest.fn(() => (layerCounter += 1)),
      eachLayer: jest.fn(),
      removeLayer: jest.fn(),
      removeControl: jest.fn()
    };
    const image = 'imageLink';
    const mapParams = {
      bounds: {},
      rotation: 0,
      isMapRendered: false
    };

    mapConfiguration.configureOverlay(map, image, mapParams);
    expect(layerCounter).toEqual(3);
  });
});
