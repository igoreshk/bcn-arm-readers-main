import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const PingService = {};

/**
 * Request for checking user authentication
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
PingService.ping = () => axios.get(linkBuilder().ping().and().build());
// .then((response) => response.data);

export default PingService;
