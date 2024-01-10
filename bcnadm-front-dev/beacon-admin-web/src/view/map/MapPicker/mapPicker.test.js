import React from 'react';
import { shallow } from 'enzyme';
import { mapProviders } from 'src/view/map/MapConsts';

import MapPicker from './index';

const props = {
  selectedMap: mapProviders.GOOGLE,
  setMap: jest.fn()
};

const wrapper = shallow(<MapPicker {...props} />);

describe('mock', () => {
  it('render component', () => expect(wrapper.length).toEqual(1));
  it('snapshot for MapPicker', () => expect(wrapper).toMatchSnapshot());
});
