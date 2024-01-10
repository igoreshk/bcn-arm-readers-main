import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const LoginService = {};

/**
 * Request for getting login view
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
LoginService.login = () => axios.get(linkBuilder().login().and().build()).then((response) => response.data);

LoginService.loginUrl = () => linkBuilder().login().and().build();

export default LoginService;
