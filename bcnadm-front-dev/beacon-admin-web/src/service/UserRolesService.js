import axios from 'axios';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const UserRolesService = {};

/**
 * Request for getting array of user roles is performed passing response's
 * data forward as resolve function parameter
 * @return {Promise}
 */
UserRolesService.findAll = () =>
  axios.get(linkBuilder().user().and().role().and().build()).then((response) => response.data);

export { UserRolesService };
