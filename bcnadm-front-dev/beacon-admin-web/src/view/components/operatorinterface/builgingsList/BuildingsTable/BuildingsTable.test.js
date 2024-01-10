import { BuildingsTable } from 'src/view/components/operatorinterface/builgingsList/BuildingsTable/index';
import React from 'react';
import { shallow } from 'enzyme';

const props = {
  data: [
    {
      address: 'FIRST ADDRESS',
      coordinate: {
        latitude: -0.005321502677898499,
        longitude: 0.05527496337890625
      },
      entityId: '5bf2afcc31d7221230a09ea4',
      name: 'FIRST NAME'
    },
    {
      address: 'SECOND ADDRESS',
      coordinate: {
        latitude: -0.005321502677898499,
        longitude: 0.05527496337890625
      },
      entityId: '5bf2afcc31d7221230a09ea4',
      name: 'SECOND NAME'
    },
    {
      address: 'THIRD ADDRESS',
      coordinate: {
        latitude: -0.005321502677898499,
        longitude: 0.05527496337890625
      },
      entityId: '5bf2afcc31d7221230a09ea4',
      name: 'THIRD NAME'
    }
  ],
  filter: '',
  onEditClick: jest.fn(),
  onRemoveClick: jest.fn(),
  setFilter: jest.fn(),
  showMap: jest.fn(),
  translate: jest.fn()
};

const wrapper = shallow(<BuildingsTable {...props} />);

describe('BuildingsTable', () => {
  it('Should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
