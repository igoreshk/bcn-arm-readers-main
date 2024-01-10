import React from 'react';
import { shallow } from 'enzyme';
import WithSearch, { WithSearchContext } from './index';

const props = {
  keys: ['key_1', 'key_2', 'key_3'],
  source: [
    {
      key_1: 'key_1',
      key_2: 'key_2',
      key_3: 'key_3'
    },
    {
      key_1: 'key_2',
      key_2: 'key_3',
      key_3: 'key_4'
    }
  ]
};

class ConsumerComponent extends React.Component {
  render() {
    return (
      <WithSearchContext.Consumer>
        {({ filter, setFilter }) => (
          <div>
            <div>Hello World</div>
            <input type="text" onChange={setFilter} value={filter} />
          </div>
        )}
      </WithSearchContext.Consumer>
    );
  }
}
const WrappedComponent = WithSearch(ConsumerComponent);
const wrapper = shallow(<WrappedComponent {...props} />);
const applyFilter = jest.spyOn(WrappedComponent.prototype, 'applyFilter');
const mockEvent = { target: { value: 'key_1' } };

describe('WithSearch', () => {
  it('Should check that props are passed properly', () => expect(wrapper.instance().props).toEqual(props));

  it('Should apply filter value to data array', () => {
    wrapper.instance().setFilter(mockEvent);
    expect(wrapper.instance().state.data[0]).toEqual(props.source[0]);
    expect(wrapper.instance().state.data).toHaveLength(1);
    expect(applyFilter).toHaveBeenCalled();
  });

  it('Should match snapshot', () => expect(wrapper).toMatchSnapshot());
});
