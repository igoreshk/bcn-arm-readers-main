import React from 'react';
import { shallow } from 'enzyme';
import { VisitorsSelectField } from './index';

const props = {
  selectVisitorsIds: jest.fn(),
  visitors: [],
  translate: jest.fn(),
  isLoading: false,
  watcher: {
    entityId: 'someId',
    name: 'someName',
    visitorIds: []
  }
};

const wrapper = shallow(<VisitorsSelectField {...props} />);

describe('VisitorsSelectField', () => {
  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});

