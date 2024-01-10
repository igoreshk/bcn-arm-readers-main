import React from 'react';
import { shallow } from 'enzyme';
import { mapProviders } from '../MapConsts';
import { SecondButtonGroup } from './index';

const props = {
  translate: jest.fn(),
  levelNumber: 1
};

const wrapperGoogle = shallow(<SecondButtonGroup {...props} selectedMapProviderName={mapProviders.GOOGLE} />);
const wrapperOSM = shallow(<SecondButtonGroup {...props} selectedMapProviderName={mapProviders.OSM} />);

describe('SecondButtonGroup', () => {
  it('should match snapshot if map provider is google', () => expect(wrapperGoogle).toMatchSnapshot());
  it('should match snapshot if map provider is OSM', () => expect(wrapperOSM).toMatchSnapshot());
});
