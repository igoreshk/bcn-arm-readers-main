import React from 'react';
import { shallow } from 'enzyme';
import { DrawingBar } from 'view/map/DrawingBar/DrawingBar';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { modes } from 'view/map/MapConsts';

const match = {
  path: '/buildings/:building/levels/:level/:layer/:edit?',
  url: '/buildings/6127807a5c161c2136ae8cb4/levels/614085264bb5bb44010a68cb/drawing',
  isExact: true,
  params: {
    building: '6127807a5c161c2136ae8cb4',
    level: '614085264bb5bb44010a68cb',
    layer: modes.DRAWING_MODE
  }
};

const buildingCenterCoordinates = [57.2, 19.1];

const pictureCoords = [
  [{ lat: 57.97220388411178, lng: 19.271508080117208 }],
  [{ lat: 57.97535120449788, lng: 19.263594881636408 }]
];

const translate = jest.fn();

const picture = 'http://localhost:3000/api/v1/levels/614085264bb5bb44010a68cb/image';

const loadedOSMap = {
  current: {
    provider: 'OSM',
    options: {
      'center': [57.97377757885401, 19.267551480876808],
      'zoom': 18
    },
    _lastCenter: {
      'lat': 57.973066416050386,
      'lng': 19.265937209129337
    }
  }
};

const propsOSM = {
  loadedOSMap,
  selectedMapProviderName: 'OSM',
  match,
  translate
};
const propsGoogle = {
  buildingCenterCoordinates,
  pictureCoords,
  picture,
  selectedMapProviderName: 'Google',
  match,
  translate
};

const store = configureStore();

describe('renders DrawingBar with Google map', () => {
  const wrapperForGoogle = shallow(
    <Provider store={store({})}>
      <BrowserRouter>
        <DrawingBar {...propsGoogle} />
      </BrowserRouter>
    </Provider>
  );
  const containerForGoogle = wrapperForGoogle.find(DrawingBar);

  it('Checks that props with Google map are passed properly', () => {
    expect(containerForGoogle.props()).toEqual(propsGoogle);
  });
});

describe('Check matching snapshot with Google map', () => {
  const wrapperForGoogle = shallow(
    <Provider store={store({})}>
      <DrawingBar {...propsGoogle} />
    </Provider>
  );
  it('Check matching snapshot', () => expect(wrapperForGoogle).toMatchSnapshot());
});

describe('renders DrawingBar with OSM map', () => {
  const wrapperForOsm = shallow(
    <Provider store={store({})}>
      <BrowserRouter>
        <DrawingBar {...propsOSM} />
      </BrowserRouter>
    </Provider>
  );
  const containerForOsm = wrapperForOsm.find(DrawingBar);

  it('Checks that props with OSMap are passed properly', () => {
    expect(containerForOsm.props()).toEqual(propsOSM);
  });
});

describe('Check matching snapshot with OSM map', () => {
  const wrapperForOsm = shallow(
    <Provider store={store({})}>
      <DrawingBar {...propsOSM} />
    </Provider>
  );
  it('Check matching snapshot', () => expect(wrapperForOsm).toMatchSnapshot());
});
