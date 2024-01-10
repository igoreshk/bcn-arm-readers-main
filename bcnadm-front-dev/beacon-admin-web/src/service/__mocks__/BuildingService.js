const BuildingService = {};

const resolvedBuilding = {
  coordinate: {
    latitude: 59.88861821937497,
    longitude: 30.327624999540518
  },
  height: 50,
  width: 29.4
};
const imageLink = '/api/v1/buildings/TESTbuildingId/levels/TESTlevelId/image';

BuildingService.findOne = () => resolvedBuilding;

BuildingService.getLevelImageLink = () => imageLink;

export { BuildingService };
