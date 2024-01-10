import { BuildingService } from 'src/service/BuildingService';
import { BuildingImageService } from 'src/service/BuildingImageService';
import { LevelImageService } from 'src/service/LevelImageService';

/**
 * First processing the images (setting '' if there's no image,
 * converting it to the desired format then setting necessary information with further saving
 * It's based on Promises in order to complete all the operations
 * before refreshing buildings list.
 * The complexity of this method is conditioned by necessity of
 * strict order of operations
 * @param buildingEntity
 * @return {Promise<any>}
 */
export function submitBuilding(buildingEntity) {
  let building = buildingEntity;
  building = createModel(building);
  return new Promise((resolve, reject) => {
    saveBuilding(building)
      .then((savedBuilding) => {
        building.building = savedBuilding;
        saveLevels(building)
          .then((savedLevels) => {
            resolve({
              building: savedBuilding,
              levels: savedLevels
            });
          })
          .catch((error) => reject(error));
      })
      .catch(() => reject(Error()));
  });
}

function createModel(building) {
  return {
    building: {
      entityId: building.entityId,
      name: building.name,
      address: building.address,
      latitude: building.latitude,
      longitude: building.longitude,
      mapImage: building.mapImage,
      fileId: building.fileId,
      phoneNumber: building.phoneNumber,
      workingHours: building.workingHours,
      customFields: building.customFields,
      height: building.height,
      width: building.width
    },
    levels: building.levels
  };
}

// return building with saved levels and levels files
function saveLevels(building) {
  return new Promise((resolve, reject) => {
    const promises = [];
    building.levels.forEach((level) => {
      level.buildingId = building.building.entityId;
      promises.push(saveLevel(level));
    });

    return Promise.all(promises)
      .then((data) => resolve(data))
      .catch((error) => reject(error));
  });
}

function saveBuildingImageIfPresent(buildingId, image) {
  return new Promise((resolve, reject) => {
    if (image) {
      BuildingImageService.uploadBuildingImage(buildingId, image)
        .then((file) => resolve(file.entityId))
        .catch((error) => reject(error));
    } else {
      resolve();
    }
  });
}

function saveLevelImageIfPresent(levelId, image) {
  return new Promise((resolve, reject) => {
    if (image) {
      LevelImageService.uploadLevelImage(levelId, image)
        .then((file) => resolve(file.entityId))
        .catch((error) => reject(error));
    } else {
      resolve();
    }
  });
}

function saveLevel(level) {
  return new Promise((resolve, reject) => {
    BuildingService.saveLevel(level)
      .then((savedLevel) => {
        level.entityId = savedLevel.entityId;
        saveLevelImageIfPresent(level.entityId, level.image)
          .then((savedFileId) => {
            level.fileId = savedFileId;
            resolve(savedLevel);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}

function saveBuilding(building) {
  return new Promise((resolve, reject) => {
    BuildingService.saveBuilding(building)
      .then((savedBuilding) => {
        building.building.entityId = savedBuilding.entityId;
        saveBuildingImageIfPresent(building.building.entityId, building.building.mapImage)
          .then((savedFileId) => {
            if (savedFileId) {
              building.building.fileId = savedFileId;
            }
            resolve(savedBuilding);
          })
          .catch((error) => reject(error));
      })
      .catch((error) => reject(error));
  });
}
