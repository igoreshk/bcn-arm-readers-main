import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

const BuildingImageService = {};

BuildingImageService.getBuildingImageLink = (buildingId) => {
  return linkBuilder().building(buildingId).image().and().build();
};

BuildingImageService.uploadBuildingImage = (buildingId, file) => {
  const formData = new FormData();
  formData.set('image', file);

  return axios({
    headers: {
      'content-type': 'multipart/form-data'
    },
    method: 'post',
    url: linkBuilder().building(buildingId).image().and().build(),
    data: formData
  }).then((response) => response.data);
};

export { BuildingImageService };
