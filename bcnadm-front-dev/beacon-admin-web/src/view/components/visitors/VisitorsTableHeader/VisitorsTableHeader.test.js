import React from 'react';
import { shallow } from 'enzyme';
import { VisitorsTableHeader } from './index';

const props = {
  translate: jest.fn(),
  toggleFilter: jest.fn(),
  toggleSortVisitorsByField: jest.fn()
};

const wrapper = shallow(<VisitorsTableHeader {...props} />);

describe('VisitorsTableHeader', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
