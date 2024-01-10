import { setLoggedOut } from 'src/actions/toggleLogin';
import LogoutService from 'src/service/LogoutService';

export function doLogout() {
  return async (dispatch) => {
    try {
      await dispatch(setLoggedOut());
      window.location.href = LogoutService.logoutUrl();
    } catch (error) {
      console.error(error);
    }
  };
}
