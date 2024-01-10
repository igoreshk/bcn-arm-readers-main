import axios from 'axios';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const MonitoringService = {};

/**
 * Request for getting visitor history by visitor id is performed
 * passing response's data forward as resolve function parameter
 * @return {Promise}
 */

MonitoringService.getVisitorHistory = (visitorId, startTime, endTime) =>
  axios
    .get(linkBuilder().monitor().and().visitor(visitorId).and().build(), { params: { start: startTime, end: endTime } })
    .then((response) => response.data);

MonitoringService.getLastMarkers = (visitorGroupId, levelId) =>
  axios.get(linkBuilder().monitor(visitorGroupId).and().level(levelId).and().build()).then((response) => response.data);

MonitoringService.getHistoryByArea = (areaId, startTime, endTime) =>
  axios
    .get(linkBuilder().monitor().and().visitor().and().area(areaId).and().build(), {
      params: { start: startTime, end: endTime }
    })
    .then((response) => response.data);

export { MonitoringService };
