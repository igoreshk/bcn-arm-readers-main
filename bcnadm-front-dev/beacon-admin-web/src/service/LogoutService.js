import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const LogoutService = {};

/**
 * Request for getting login view
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
LogoutService.logout = () => axios.get(linkBuilder().logout().and().build()).then((response) => response.data);

LogoutService.logoutUrl = () => linkBuilder().logout().and().build();

export default LogoutService;
