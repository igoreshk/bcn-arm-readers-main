import React from 'react';
import { mount } from 'enzyme';
import { OSMap } from './index';

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

const currentLevel = {
  scaleStartLatitude: 50,
  scaleStartLongitude: 30,
  scaleEndLatitude: 40,
  scaleEndLongitude: 40,
  scaleDistance: 40
};

const props = {
  hideLoadingScreen: jest.fn(),
  showLoadingScreen: jest.fn(),
  setMapRenderedStatus: jest.fn(),
  match,
  history: {
    push: jest.fn()
  },
  location: {
    hash: '',
    key: 'zjzhge',
    pathname: '/buildings/5dd3c1d2f79fb2000125f0c0/levels/5dd3c219f79fb2000125f0c1/beacons',
    search: ''
  },
  loading: false,
  currentLevel
};

describe('OSMap test cases', () => {
  const div = document.createElement('div');
  div.setAttribute('id', 'OSMap');
  document.body.appendChild(div);
  const waitForPromises = () => new Promise(setImmediate);
  let container;
  let wrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = mount(<OSMap {...props} />);
    container = wrapper.find(OSMap);
  });

  it('Checks if props are passed correctly', () => {
    expect(wrapper.props()).toEqual(props);
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

  it('Snapshot for OSMap component', () => {
    wrapper.setProps({ match: { params: { level: '' } } });
    expect(wrapper).toMatchSnapshot();
  });
});
