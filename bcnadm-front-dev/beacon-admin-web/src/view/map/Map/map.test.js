import React from 'react';
import { mount } from 'enzyme';
import { INITIAL_ZOOM } from 'view/map/MapConsts';
import { calculatePixelsPerMeter, rotateImage } from './helpers';
import { Map } from './index';
import * as helpers from './helpers';

const getProjection = jest.fn(() => {
    return {
        fromLatLngToPoint: jest.fn().mockReturnValue({ x: 141, y: 70 }),
        fromPointToLatLng: jest.fn()
    };
});


const selectedMap = {
    setCenter: jest.fn(),
    getCenter: jest.fn().mockReturnValue({ x: 128, y: 128 }),
    getZoom: jest.fn().mockReturnValue(INITIAL_ZOOM),
    getProjection,
    setZoom: jest.fn(),
    panTo: jest.fn()
};

class LatLng {
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

class LatLngBounds {
    extend() {
        jest.fn();
    }
}

const google = {
    maps: {
        Map: jest.fn(() => selectedMap),
        OverlayView: jest.fn(),
        LatLngBounds,
        LatLng,
        Point: jest.fn().mockReturnValue({ x: 128, y: 128 }),
        event: {
            addListenerOnce: jest.fn()
        }
    }
};

const match = {
    isExact: true,
    params: {
        building: '5dd3c1d2f79fb2000125f0c0',
        edit: true,
        layer: 'beacons',
        level: '5dd3c219f79fb2000125f0c1'
    },
    path: '/buildings/:building/levels/:level/:layer/:edit?',
    url: '/buildings/5dd3c1d2f79fb2000125f0c0/levels/5dd3c219f79fb2000125f0c1/beacons'
};
const coordinate = {
    latitude: 50,
    longitude: 50
};
const size = {
    width: 50,
    height: 50
};

const currentLevel = {
    scaleStartLatitude: 59.888661046666236,
    scaleStartLongitude: 30.326315760612488,
    scaleEndLatitude: 59.88888651067054,
    scaleEndLongitude: 30.328509944346113,
    scaleDistance: 0
};

const level = {
    scaleStartLatitude: 59.888661046666236,
    scaleStartLongitude: 30.326315760612488,
    scaleEndLatitude: 59.88888651067054,
    scaleEndLongitude: 30.328509944346113,
    scaleDistance: 40
};

const curLevel = {
    scaleStartLatitude: 0,
    scaleStartLongitude: 0,
    scaleEndLatitude: 0,
    scaleEndLongitude: 0,
    scaleDistance: 40
};

const currentBuilding = {
    height: 150,
    width: 200
};

const props = {
    google,
    hideLoadingScreen: jest.fn(),
    showLoadingScreen: jest.fn(),
    setMapRenderedStatus: jest.fn(),
    setCurrentBuilding: jest.fn(),
    setMapProvider: jest.fn(),
    match,
    saveGoogle: jest.fn(),
    saveMap: jest.fn(),
    history: {
        push: jest.fn()
    },
    location: {
        hash: '',
        key: 'zjzhge',
        pathname: '/buildings/5dd3c1d2f79fb2000125f0c0/levels/5dd3c219f79fb2000125f0c1/beacons',
        search: ''
    },
    selectedMap,
    showMapBackground: true,
    staticContext: undefined,
    coordinate,
    loading: false,
    size,
    currentLevel,
    currentBuilding
};

jest.mock('service/BuildingService');


describe('Map', () => {
    let wrapper;
    let container;
    jest.spyOn(helpers, 'toggleBackgroundIfMapExist').mockImplementation();
    const waitForPromises = () => new Promise(setImmediate);

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = mount(<Map {...props} />);
        container = wrapper.find(Map);
    });

    it('Checks that props are passed properly', () => {
        expect(container.props()).toEqual(props);
    });

    it('Checks showLoadingScreen have been called', async () => {
        const showLoadingScreen = jest.spyOn(container.props(), 'showLoadingScreen');
        await waitForPromises();
        // eslint-disable-next-line require-atomic-updates
        container.mapConfiguration = {
            getImageAndCalculateBounds: jest.fn(() => Promise.resolve({ bounds: {}, imageLink: '' }))
        };
        wrapper.setProps({ match: { params: { level: '' } } });
        expect(showLoadingScreen).toHaveBeenCalled();
    });

    it('Check matching snapshot', () => expect(wrapper.html()).toMatchSnapshot());

    it('returns baseValue if distance equals to zero', () => {
        expect(calculatePixelsPerMeter(selectedMap, google, { ...currentLevel })).toEqual(10);
    });

    it('returns calculated value if distance not equals to zero', () => {
        expect(calculatePixelsPerMeter(selectedMap, google, { ...level })).toEqual(0);
    });
    it('returns 0 if level params equals to zero', () => {
        expect(rotateImage(selectedMap, google, { ...curLevel })).toEqual(0);
    });

    it('returns calculated value if distance not equals to zero', () => {
        expect(calculatePixelsPerMeter(selectedMap, google, { ...level })).toEqual(0);
    });
    it('returns 0 if level params equals to zero', () => {
        expect(rotateImage(selectedMap, google, { ...curLevel })).toEqual(0);
    });
});
