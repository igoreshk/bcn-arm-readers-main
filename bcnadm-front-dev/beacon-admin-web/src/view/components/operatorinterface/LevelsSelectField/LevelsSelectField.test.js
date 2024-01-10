import React from 'react';
import { shallow } from 'enzyme';

import { LevelsSelectField } from './index';

const props = {
  buildings: [
    {
      address: 'address',
      description: 'description',
      entityId: 1,
      latitude: 1,
      longitude: 1,
      mapImage: null,
      mimiType: null,
      name: 'name',
      noImage: false
    }
  ],
  match: {
    params: {
      building: '',
      layer: ''
    }
  },
  translate: jest.fn()
};

const wrapper = shallow(<LevelsSelectField {...props} />);

describe('LevelsSelectField', () => {
  it('render connected(SMART) component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for LevelsSelectField', () => expect(wrapper).toMatchSnapshot());
});
