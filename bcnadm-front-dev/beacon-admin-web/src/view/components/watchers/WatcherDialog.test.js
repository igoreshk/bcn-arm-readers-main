import React from 'react';
import { shallow } from 'enzyme';
import VisitorGroupsService from 'src/service/VisitorGroupsService';
import { WatcherDialog } from './WatcherDialog';

describe('WatcherDialog', () => {
  const props = {
    translate: jest.fn(),
    history: {
      push: jest.fn(),
      length: 36
    },
    hideLoadingScreen: jest.fn(),
    showLoadingScreen: jest.fn(),
    addPopupMessageText: jest.fn(),
    match: {
      params: {
        id: 1
      }
    }
  };

  const watcher = {
    entityId: '6092744eff6de31c9094f847',
    name: 'testName',
    visitorIds: null
  };

  const wrapper = shallow(<WatcherDialog {...props} />);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Component has rendered', () => {
    expect(wrapper.length).toEqual(1);
  });

  it('Check props', () => {
    expect(wrapper.instance().props).toEqual(props);
  });

  it('correct watcher', async () => {
    jest.spyOn(VisitorGroupsService, 'saveWatcher').mockImplementationOnce(jest.fn(() => Promise.resolve(watcher)));
    await wrapper.instance().saveWatcher();

    expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    expect(props.hideLoadingScreen).toHaveBeenCalled();
  });

  it('catch watcher', async () => {
    jest.spyOn(VisitorGroupsService, 'saveWatcher').mockImplementationOnce(jest.fn(() => Promise.reject()));
    await wrapper.instance().saveWatcher();
    await wrapper.setState({ watcher }).instance();
    expect(wrapper.instance().props.history.push).toHaveBeenCalled();
    expect(props.hideLoadingScreen).toHaveBeenCalled();
    expect(props.addPopupMessageText).toHaveBeenCalled();
  });

  it('checks if visitorGroupName is appropriate', () => {
    const visitorGroupNamesList = ['myTest', 'newName'];
    const visitorGroupNamesListToCheck = ['okName', 'originalName', 'myTest', '12345', 'newName'];
    const originalName = 'originalName';
    const expectedResult = [true, true, false, true, false];
    const func = jest.spyOn(wrapper.instance(), 'checkIfNameIsAppropriate');
    expect(visitorGroupNamesListToCheck.map(item => func(item, visitorGroupNamesList, originalName))).toEqual(expectedResult);
  });
});

