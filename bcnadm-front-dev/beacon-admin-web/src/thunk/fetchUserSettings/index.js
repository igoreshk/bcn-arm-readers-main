import { saveUserSettings } from 'src/actions/getUserSettingsAction';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

export function fetchUserSettings() {
  return async (dispatch) => {
    try {
      const success = await axios.get(linkBuilder().user().current().and().build());
      dispatch(saveUserSettings(success.data));
      return success;
    } catch (error) {
      console.error(error);
      return error;
    }
  };
}
