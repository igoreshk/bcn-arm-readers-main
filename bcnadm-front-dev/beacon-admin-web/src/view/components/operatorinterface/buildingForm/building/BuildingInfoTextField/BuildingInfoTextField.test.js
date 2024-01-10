import React from 'react';
import { shallow } from 'enzyme/build/index';

import BuildingInfoTextField from './index';

const props = {
  label: 'label',
  meta: {
    touched: false,
    error: ''
  }
};

const wrapper = shallow(<BuildingInfoTextField {...props} />);

describe('BuildingInfoTextField', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
