import axios from 'axios';
import { linkBuilder } from 'utils/UrlBuilders/linkBuilder';

const OnMapsDrawingService = {};
const pathLink = linkBuilder().area().and().build();

OnMapsDrawingService.getAllShapesFromDataBase = async (dataSetter) => {
  await axios({
    method: 'get',
    url: pathLink
  })
    .then((response) => {
      dataSetter(response);
    })
    .catch((e) => console.error(e));
};

OnMapsDrawingService.sendShapesToDataBase = async (dataToSend) => {
  await axios({
    method: 'get',
    url: pathLink
  })
    .then((response) => {
      const shapeToDelete = response.data.find((shapes) => shapes.name === dataToSend.name);
      if (!shapeToDelete) {
        axios({
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          method: 'post',
          url: pathLink,
          data: {
            name: dataToSend.name,
            coordinates: dataToSend.coordinates,
            levelId: dataToSend.levelId,
            description: 'coordinates of the shape'
          }
        });
        dataToSend.errorHandler({ ...dataToSend.status, sent: true });
      } else {
        dataToSend.errorHandler({ ...dataToSend.status, error: true });
      }
    })
    .then((response) => response)
    .catch((e) => console.error(e));
};

OnMapsDrawingService.deleteShapeFromDataBase = async (name) => {
  await axios({
    method: 'get',
    url: pathLink
  })
    .then((response) => {
      const shapeToDelete = response.data.find((shapes) => shapes.name === name);
      axios({
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        method: 'delete',
        url: `${pathLink}/${shapeToDelete.entityId}`
      });
    })
    .catch((error) => console.error(error));
};

export { OnMapsDrawingService };
