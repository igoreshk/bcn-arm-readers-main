import GoogleMapConfiguration from './index';

describe('GoogleMapConfirguration', () => {
  const bounds = {
    Ta: {
      g: -0.3785,
      i: 0.3785
    },

    Ya: {
      g: -0.3785,
      i: 0.3785
    }
  };
  class LatLngBounds {
    Ta = {
      g: -0.3785,
      i: 0.3785
    };
    Ya = {
      g: -0.3785,
      i: 0.3785
    };
    extend() {
      jest.fn();
    }
  }

  const node = '<div class="mapContainer"></div>';
  const mapObj = {
    map: 'map'
  };
  const google = {
    maps: {
      Map: jest.fn(() => mapObj),
      OverlayView: jest.fn(),
      LatLngBounds,
      Point: jest.fn().mockReturnValue({ x: 128, y: 128 })
    }
  };
  const center = {
    lat: 50,
    lng: 50
  };
  const size = {
    width: 50,
    height: 50
  };
  const pixelsPerMeter = 10;

  const mapConfiguration = new GoogleMapConfiguration(google, node, center);
  const realImage = window.Image;

  beforeEach(() => {
    window.Image = realImage;
  });

  afterAll(() => {
    window.Image = realImage;
  });

  it('createMap should work with promise', () => {
    expect.assertions(1);
    return expect(mapConfiguration.createMap()).resolves.toEqual(mapObj);
  });

  it('configureOverlay should work with promise', () => {
    const image = 'image_link';
    const overlayResult = {
      bounds,
      div: null,
      image,
      map: mapObj
    };
    expect.assertions(1);
    return expect(mapConfiguration.configureOverlay(mapObj, bounds, image)).resolves.toEqual(overlayResult);
  });

  it('getImageAndCalculateBounds should work with promise', () => {
    const getProjection = jest.fn(() => {
      return {
        fromLatLngToPoint: jest.fn().mockReturnValue({ x: 128, y: 128 }),
        fromPointToLatLng: jest.fn()
      };
    });
    const levelId = 'TESTlevelId';
    const map = {
      setCenter: jest.fn(),
      getCenter: jest.fn().mockReturnValue({ x: 128, y: 128 }),
      getZoom: jest.fn(() => 12),
      getProjection
    };
    window.Image = class {
      constructor() {
        setTimeout(() => {
          this.onload();
        }, 100);
      }
    };

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
    const getProjection = jest.fn(() => {
      return {
        fromLatLngToPoint: jest.fn().mockReturnValue({ x: 128, y: 128 }),
        fromPointToLatLng: jest.fn()
      };
    });
    const levelId = 'TESTlevelId';
    const map = {
      setCenter: jest.fn(),
      getCenter: jest.fn().mockReturnValue({ x: 128, y: 128 }),
      getZoom: jest.fn(() => 12),
      getProjection
    };
    window.Image = class {
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
});
