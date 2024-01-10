import React from 'react';
import { shallow } from 'enzyme';

import VisitorService from 'src/service/VisitorService';
import VisitorGroupsService from 'src/service/VisitorGroupsService';
import { WatchersTable } from './index';

const props = {
  translate: jest.fn(),
  showLoadingScreen: jest.fn(),
  hideLoadingScreen: jest.fn(),
  history: {},
  updated: false
};

describe('WatchersTable', () => {
  let wrapper;

  describe('loadData tests', () => {
    let loadData;
    let showLoadingScreen;
    beforeEach(() => {
      wrapper = shallow(<WatchersTable {...props} />);
      loadData = jest.spyOn(WatchersTable.prototype, 'loadData');
      showLoadingScreen = jest.spyOn(wrapper.instance().props, 'showLoadingScreen');
    });

    it('Check showLoadingScreen was called from componentWillMount and componentDidUpdate life hooks', () => {
      wrapper.setProps({ updated: true });
      expect(showLoadingScreen).toHaveBeenCalledTimes(2);
    });

    it('Check loadData was called from componentDidUpdate life hook', () => expect(loadData).toHaveBeenCalled());
  });

  describe('function tests', () => {
    beforeEach(() => {
      wrapper = shallow(<WatchersTable {...props} />, { disableLifecycleMethods: true });
    });

    it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

    it('Check setStringFilter was called with "name"', () => {
      wrapper.setState({ isFilterShown: true });
      const setStringFilter = jest.spyOn(wrapper.instance(), 'setStringFilter');
      wrapper.find('.filter-name').simulate('change', { target: { value: 'test' } });
      expect(setStringFilter).toHaveBeenCalledWith('test', 'name');
    });

    it('Check setStringFilter was called with "visitorNames"', () => {
      wrapper.setState({ isFilterShown: true });
      const setStringFilter = jest.spyOn(wrapper.instance(), 'setStringFilter');
      wrapper.find('.filter-visitor-names').simulate('change', { target: { value: '46gj56g' } });
      expect(setStringFilter).toHaveBeenCalledWith('46gj56g', 'visitorNames');
    });

    it('Check applyFilters was called with "name"', () => {
      wrapper.setState({ isFilterShown: true });
      const applyFilters = jest.spyOn(wrapper.instance(), 'applyFilters');
      wrapper.find('.filter-name').simulate('change', { target: { value: 'test' } });
      expect(applyFilters).toHaveBeenCalled();
    });

    it('Check applyFilters was called with "visitorNames"', () => {
      wrapper.setState({ isFilterShown: true });
      const applyFilters = jest.spyOn(wrapper.instance(), 'applyFilters');
      wrapper.find('.filter-visitor-names').simulate('change', { target: { value: '46gj56g' } });
      expect(applyFilters).toHaveBeenCalled();
    });

    it('Check toggleSortWatchersByField was called with "name"', () => {
      wrapper.setState({
        watchers: [
          { entityId: 3, name: 'test3', visitorIds: [] },
          { entityId: 2, name: 'test2', visitorIds: [] },
          { entityId: 1, name: 'test1', visitorIds: [] }
        ],
        filteredWatchers: [
          { entityId: 3, name: 'test3', visitorIds: [] },
          { entityId: 2, name: 'test2', visitorIds: [] },
          { entityId: 1, name: 'test1', visitorIds: [] }
        ]
      });
      wrapper
        .find('WatchersTableHeader')
        .dive()
        .find('.name')
        .simulate('click');
      wrapper.update();
      expect(wrapper.instance().state).toMatchObject({
        filteredWatchers: [
          { entityId: 1, name: 'test1' },
          { entityId: 2, name: 'test2' },
          { entityId: 3, name: 'test3' }
        ],
        sortedBy: 'BY_WATCHER_NAME_ASC'
      });
    });

    it('Check toggleSortWatchersByField was called with "visitors"', () => {
      wrapper.setState({
        watchers: [
          { entityId: 3, visitorIds: ['3'] },
          { entityId: 2, visitorIds: ['2'] },
          { entityId: 1, visitorIds: ['1'] }
        ],
        filteredWatchers: [
          { entityId: 3, visitorIds: ['3'] },
          { entityId: 2, visitorIds: ['2'] },
          { entityId: 1, visitorIds: ['1'] }
        ],
        visitors: [
          { entityId: '1', firstName: 'Terr5', lastName: 'Aversione' },
          { entityId: '2', firstName: 'Terr5', lastName: 'Aversione' },
          { entityId: '3', firstName: 'Terr5', lastName: 'Aversione' }
        ]
      });
      wrapper
        .find('WatchersTableHeader')
        .dive()
        .find('.visitors')
        .simulate('click');
      wrapper.update();
      expect(wrapper.instance().state).toMatchObject({
        filteredWatchers: [
          { entityId: 1, visitorIds: ['1'] },
          { entityId: 2, visitorIds: ['2'] },
          { entityId: 3, visitorIds: ['3'] }
        ],
        sortedBy: 'BY_VISITORS_ASC'
      });
    });

    it('Check toggleFilter was called', () => {
      wrapper
        .find('WatchersTableHeader')
        .dive()
        .find('.removeButton')
        .simulate('click');
      wrapper.update();
      expect(wrapper.instance().state).toMatchObject({ isFilterShown: true });
    });
  });

  describe('check setting the state using mocked service', () => {
    const mockedVisitors = [
      {
        'entityId': '5f75e6c82226f30e13968598',
        'firstName': 'Terr5',
        'lastName': 'Aversione',
        'middleName': 'Caelum',
        'mac': '222222222222',
        'major': 2123,
        'minor': 32144,
        'fileId': '5ed774df2261f70001fe753f',
        'image': '/c68ce1e3162dbf1d12c1c7fcd8c098e8.svg'
      }
    ];
    const mockedWatchers = [
      {
        'entityId': '5f75e7313d9aaa21ea87a773',
        'name': null,
        'visitorIds': ['5f75e6c82226f30e13968598']
      }
    ];
    jest.spyOn(VisitorGroupsService, 'findAll').mockImplementation(() => Promise.resolve(mockedWatchers));
    jest.spyOn(VisitorService, 'findAll').mockImplementation(() => Promise.resolve(mockedVisitors));

    it('checking if state was set', async () => {
      wrapper = shallow(<WatchersTable {...props} />);
      await wrapper.instance().loadWatchersAndVisitors();
      expect(wrapper.instance().state.visitors).toMatchObject(mockedVisitors);
    });
  });
});
