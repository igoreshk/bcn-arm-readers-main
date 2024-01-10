import React from 'react';
import { shallow, mount } from 'enzyme';
import { Button } from '@material-ui/core';
import WatcherForm from './index';

const props = {
  handleOnChange: jest.fn(),
  cancel: jest.fn(),
  visitorsList: [],
  isLoading: false,
  watcher: {
    entityId: 'someId',
    name: 'someName',
    visitorIds: []
  },
  translate: () => '',
  selectVisitorsIds: jest.fn(),
  saveWatcher: jest.fn(),
  isAppropriateName: null
};

describe('WatcherForm', () => {
  const shallowWrapper = shallow(<WatcherForm {...props} />);
  const wrapper = mount(<WatcherForm {...props} />);

  it('Check matching snapshot', () => expect(shallowWrapper).toMatchSnapshot());

  describe('Form header', () => {
    it('should render correct header if the watcher is new', () => {
      wrapper.setProps({
        translate: () => 'Add watcher'
      });

      const title = wrapper.find('.watcherDialogTitle').first();
      expect(title.text()).toEqual('Add watcher');
    });

    it('should render correct header if the watcher is edited', () => {
      wrapper.setProps({
        watcher: {
          entityId: 1,
          name: 'name'
        },
        translate: () => 'Edit watcher'
      });
      const title = wrapper.find('.watcherDialogTitle').first();
      expect(title.text()).toEqual('Edit watcher');
    });
  });

  describe('testSaveButton', () => {
    let saveButton = wrapper.find(Button).at(1);

    it('Check initial state of button is disabled ', () => {
      wrapper.setProps({
        watcher: {
          entityId: 1
        }
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.prop('disabled')).toEqual(true);
    });

    it('Check button is enabled after name was changed and it is appropriate', () => {
      wrapper.setProps({
        watcher: {
          entityId: 1,
          name: 'name'
        },
        isAppropriateName: true
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.prop('disabled')).toEqual(false);
    });

    it('Check button is disabled after name was changed and it is not appropriate', () => {
      wrapper.setProps({
        watcher: {
          entityId: 1,
          name: 'name'
        },
        isAppropriateName: false
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.prop('disabled')).toEqual(true);
    });

    it('renders Save text if the watcher is edited', () => {
      wrapper.setProps({
        watcher: {
          entityId: 1,
          name: 'name'
        },
        translate: () => 'Save'
      });
      saveButton = wrapper.find(Button).at(1);
      expect(saveButton.text()).toEqual('Save');
    });
  });
});
