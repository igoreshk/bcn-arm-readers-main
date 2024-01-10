import * as actions from 'src/actions/getUserSettingsAction/index';
import * as example from 'test/__test__/actions';

describe('saveUserSettings', () => {
  it('should create an action without settings payload', () => {
    expect(actions.saveUserSettings(example.userSettings.payload.settings)).toEqual(example.userSettings);
  });
});
