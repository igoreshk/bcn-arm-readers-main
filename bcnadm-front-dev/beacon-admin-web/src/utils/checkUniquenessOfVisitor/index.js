export const isVisitorNameUnique = (visitorsList, name, id) => {
  const visitorWithSameName = visitorsList.find((visitor) => visitor.name === name);
  const doesSameNameExist = visitorWithSameName && (id === 'new' || visitorWithSameName.entityId !== id);
  if (doesSameNameExist) {
    return false;
  }
  return true;
};

export const isDeviceIdUnique = (visitorsList, deviceId, id) => {
  const visitorWithSameDaviceId = visitorsList.find((visitor) => visitor.deviceId === deviceId);
  const doesSameDeviceIdExist = visitorWithSameDaviceId && (id === 'new' || visitorWithSameDaviceId.entityId !== id);
  if (doesSameDeviceIdExist) {
    return false;
  }
  return true;
};
