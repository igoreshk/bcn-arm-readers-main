import { linkBuilder } from 'src/utils/UrlBuilders/linkBuilder';
import axios from 'axios';

const LevelImageService = {};

LevelImageService.getLevelImageLink = (levelId) => {
  return linkBuilder().level(levelId).image().and().build();
};
LevelImageService.uploadLevelImage = (levelId, file) => {
  const formData = new FormData();
  formData.set('image', file);
  return axios({
    headers: {
      'content-type': 'multipart/form-data'
    },
    method: 'post',
    url: linkBuilder().level(levelId).image().and().build(),
    data: formData
  }).then((response) => response.data);
};

export { LevelImageService };
