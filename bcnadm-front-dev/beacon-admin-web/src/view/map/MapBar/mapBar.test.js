import React from 'react';
import { shallow } from 'enzyme';
import { MapBar } from './index';

const props = {
  levelNumber: 1,
  translate: jest.fn(),
  handleRemoveMarkers: jest.fn(),
  changeEditMode: jest.fn(),
  selectedMapProviderName: 'Google'
};

const wrapperWithoutBuildingSizeLegend = shallow(<MapBar {...props} />);
const wrapperWithBuildingSizeLegend = shallow(
  <MapBar {...props} buildingSizeForScaleMode={{ height: 100, width: 200 }} />
);

describe('MapBar', () => {
  it('should match snapshot', () => expect(wrapperWithoutBuildingSizeLegend).toMatchSnapshot());

  it('with buildingSizeForScaleMode prop should match snapshot', () =>
    expect(wrapperWithBuildingSizeLegend.first().shallow()).toMatchSnapshot());
});
