import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

const BuildingService = {};

BuildingService.findOne = (id) => axios.get(linkBuilder().building(id).and().build()).then((response) => response.data);

BuildingService.findAll = () => axios.get(linkBuilder().building().and().build()).then((response) => response.data);

BuildingService.findBuildingLevels = (buildingId) =>
  axios.get(linkBuilder().building(buildingId).and().level().and().build()).then((response) => response.data);

BuildingService.saveBuilding = (building) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: building.building.entityId ? 'put' : 'post',
    url: linkBuilder().building().and().build(),
    data: building.building
  }).then((response) => response.data);

BuildingService.delete = (id) => axios.delete(linkBuilder().building(id).and().build());

BuildingService.saveLevel = (level) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: level.entityId ? 'put' : 'post',
    url: linkBuilder().level().and().build(),
    data: level
  }).then((response) => response.data);

BuildingService.deleteLevel = (buildingId, levelId) =>
  axios({
    headers: {
      'Accept': 'application/json'
    },
    method: 'delete',
    url: linkBuilder().level(levelId).and().build()
  });

export { BuildingService };
