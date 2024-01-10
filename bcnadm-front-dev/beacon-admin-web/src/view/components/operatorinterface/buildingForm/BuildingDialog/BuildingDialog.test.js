import React from 'react';
import { shallow } from 'enzyme';
import { BuildingDialog } from './index';

describe('BuildingDialog', () => {
  const props = {
    translate: () => '',
    match: { params: {} },
    showLoadingScreen: () => {},
    hideLoadingScreen: () => {},
    values: {},
    history: {
      push: jest.fn()
    }
  };
  let container;

  beforeEach(() => {
    container = shallow(<BuildingDialog {...props} />);
  });

  it('Component has rendered', () => {
    expect(container.length).toEqual(1);
  });

  it('Check props', () => {
    expect(container.instance().props).toEqual(props);
  });
});
