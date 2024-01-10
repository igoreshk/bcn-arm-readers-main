import React from 'react';
import { shallow } from 'enzyme';
import { WatchersTableHeader } from './WatchersTableHeader';

const props = {
  toggleFilter: jest.fn(),
  toggleSortWatchersByField: jest.fn(),
  translate: jest.fn()
};

const wrapper = shallow(<WatchersTableHeader {...props} />);

describe('WatchersTableHeader', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());

  it('Check toggleSortWatchersByField was called with "visitors"', () => {
    wrapper.find('.visitors').simulate('click');
    expect(props.toggleSortWatchersByField).toHaveBeenCalledWith('visitors');
  });

  it('Check toggleSortWatchersByField was called with "name"', () => {
    wrapper.find('.name').simulate('click');
    expect(props.toggleSortWatchersByField).toHaveBeenCalledWith('name');
  });
});
