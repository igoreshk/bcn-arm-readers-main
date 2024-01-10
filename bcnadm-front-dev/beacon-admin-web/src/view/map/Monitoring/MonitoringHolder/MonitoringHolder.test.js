import React from 'react';
import { mount } from 'enzyme';
import WatcherService from 'src/service/VisitorGroupsService';
import { connectComponent } from 'test/redux-mock';
import { MonitoringHolder } from './index';

const props = {
  map: {},
  translate: jest.fn(),
  transformer: jest.fn(),
  levelNumber: 1,
  setListeners: jest.fn(),
  selectedMap: 'OSM',

  match: {
    isExact: true,
    params: {
      building: '6001837cc3d7c91f1535a363',
      edit: undefined,
      layer: 'monitoring',
      level: '6001837ec3d7c91f1535a364'
    },
    path: '/buildings/:building/levels/:level/:layer/:edit?',
    url: '/buildings/6001837cc3d7c91f1535a363/levels/6001837ec3d7c91f1535a364/monitoring'
  },
  classes: {}
};
const propsForSnapshot = {
  map: {},
  isMapRendered: true,
  match: {}
};

const selectedWatchers = [
  {
    entityId: '61c6fc88d0786b15b4caff5c',
    name: 'George',
    visitorIds: []
  }
];

describe('MonitoringHolder', () => {
  const findAll = jest.spyOn(WatcherService, 'findAll');
  const wrapper = mount(<MonitoringHolder {...props} />);
  const wrapped = connectComponent(MonitoringHolder, { propsForSnapshot }, {});

  it('renders', () => expect(wrapper.exists()).toBe(true));
  it('WatcherService.findAll was called when rendering', () => expect(findAll).toHaveBeenCalled());
  it('Check matching snapshot', () => {
    expect(wrapped).toMatchSnapshot();
  });

  it('getVisitors will be called when call selectWatchersIds', () => {
    const selectWatchersIds = jest.spyOn(wrapper.instance(), 'selectWatchersIds');
    const getVisitors = jest.spyOn(wrapper.instance(), 'getVisitors');
    selectWatchersIds(selectedWatchers);
    expect(getVisitors).toHaveBeenCalled();
  });
});

describe('getMonitoringTimeInMilliseconds', () => {
  jest.spyOn(window.Date.prototype, 'getTimezoneOffset').mockReturnValueOnce(0);
  const mockDate = new Date('Fri Aug 20 2021 00:00:00 GMT+0300 (Moscow Standard Time)');
  it('shall return correct monitoring time in ms', () => {
    const wrapper = mount(<MonitoringHolder />);
    wrapper.setState({ startDate: mockDate });
    expect(wrapper.instance().getMonitoringTimeInMilliseconds()).toEqual(1629406800000);
  });
});

describe('getStartDateQueryParam', () => {
  it('should return date in expected format', () => {
    const mockDate = new Date('Fri Aug 20 2021 12:00:00 GMT+0300 (Moscow Standard Time)');
    const wrapper = mount(<MonitoringHolder />);
    wrapper.setState({ startDate: mockDate });
    const expectedDateFormat = '2021-08-20 12:00:00';
    expect(wrapper.instance().getStartDateQueryParam()).toEqual(expectedDateFormat);
  });
});
