import * as actions from 'src/actions/setReaderNamesAction/index';
import * as example from 'test/__test__/actions';

describe('setReaderNames', () => {
  it('should create action', () => {
    expect(actions.setReaderNames(example.readerNames.payload.readersInfo)).toEqual(example.readerNames);
  });
});
