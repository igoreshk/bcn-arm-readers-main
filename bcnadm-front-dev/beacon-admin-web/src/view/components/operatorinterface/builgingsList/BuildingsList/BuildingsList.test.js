import React from 'react';
import { shallow } from 'enzyme/build/index';

import { BuildingsList } from './index';

const props = {
  isLoading: false,
  location: {
    updated: false
  }
};

const wrapper = shallow(<BuildingsList {...props} />);

describe('BuildingsList', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
