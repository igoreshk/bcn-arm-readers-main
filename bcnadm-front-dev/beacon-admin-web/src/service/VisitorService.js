import axios from 'axios';

import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import imgs from 'src/view/images';

export const VisitorService = {};

type Visitor = {
  entityId: string,
  firstName: string,
  lastName: string,
  mac: string,
  major: number,
  middleName: string,
  minor: number
};

/**
 * Request for getting specific visitor using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
VisitorService.findOne = (visitorId): Promise<Visitor> =>
  axios.get(linkBuilder().visitor(visitorId).and().build()).then((response) => response.data);
/**
 * Request for deleting specific visitor using id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
VisitorService.remove = (visitorId): Promise<Boolean> =>
  axios.delete(linkBuilder().visitor(visitorId).and().build()).then((response) => response.data);

/**
 * Request for getting array of visitors is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */
VisitorService.findAll = async (): Promise<Array<Visitor>> => {
  const visitors = await axios.get(linkBuilder().visitor().and().build()).then((response) => response.data);

  return visitors.map((visitor) => {
    visitor.image = imgs.visitor;
    return visitor;
  });
};

/**
 * Depending on type of operation (visitor saving/edition, determined by presence of id)
 * put or post request is performed, returning Promise that allows caller to wait
 * for request completion
 * @return {Promise}
 */
VisitorService.saveVisitor = (visitor): Promise<Visitor> =>
  axios({
    headers: {
      Accept: 'application/json'
    },
    method: visitor.entityId ? 'put' : 'post',
    url: linkBuilder().visitor().and().build(),
    data: visitor
  }).then((response) => response.data);

export default VisitorService;
