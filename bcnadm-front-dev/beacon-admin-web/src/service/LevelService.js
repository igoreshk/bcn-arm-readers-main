import axios from 'axios/index';
import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';

const LevelService = {};

LevelService.getLevel = (levelId) =>
  axios.get(linkBuilder().level(levelId).and().build()).then((response) => response.data);

LevelService.saveLevel = (level) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'post',
    url: linkBuilder().level().and().build(),
    data: level
  });

LevelService.getMap = (buildingId, levelId) =>
  axios.get(linkBuilder().level(levelId).image().and().build()).then((response) => response.data);

LevelService.findAllByBuildingId = (buildingId) =>
  axios.get(linkBuilder().building(buildingId).and().level().and().build()).then((response) => response.data);

export { LevelService };
