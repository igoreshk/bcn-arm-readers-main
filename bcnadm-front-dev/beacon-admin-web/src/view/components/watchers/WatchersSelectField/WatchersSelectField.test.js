import React from 'react';
import { shallow } from 'enzyme';
import { Select } from '@material-ui/core';
import WatchersSelectField from './index';

const props = {
  watchers: [
    {
      entityId: '5fc8bf048dfe557a0c9a9191',
      id: '5fc8bf048dfe557a0c9a9191',
      visitorsId: ['12324']
    }
  ],
  selectWatchersIds: jest.fn()
};
const value = [{ id: 'test' }];
const wrapper = shallow(<WatchersSelectField {...props} />);

describe('WatchersSelectField', () => {
  it('Test for onChangeCall', () => {
    wrapper.find(Select).simulate('change', { target: { value } });
    expect(props.selectWatchersIds).toHaveBeenCalled();
  });

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
