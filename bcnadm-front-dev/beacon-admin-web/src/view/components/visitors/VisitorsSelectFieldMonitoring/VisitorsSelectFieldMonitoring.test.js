import React from 'react';
import { shallow } from 'enzyme';
import { Select } from '@material-ui/core';
import VisitorsSelectFieldMonitoring from './VisitorsSelectFieldMonitoring';

const props = {
  visitors: [
    {
      entityId: '5fc8bf048dfe557a0c9a9191',
      name: 'George'
    }
  ],
  changeListVisitorIds: jest.fn(),
  translate: jest.fn()
};
const value = [{ entityId: '61c6fc23d0786b15b4caff5b', name: 'George' }];
const wrapper = shallow(<VisitorsSelectFieldMonitoring {...props} />);

describe('VisitorsSelectFieldMonitoring', () => {
  it('Selecting a new visitor should call translate', () => {
    wrapper.find(Select).simulate('click', { target: { value } });
    expect(props.translate).toHaveBeenCalled();
  });

  it('Check matching snapshot', () => expect(wrapper).toMatchSnapshot());
});
