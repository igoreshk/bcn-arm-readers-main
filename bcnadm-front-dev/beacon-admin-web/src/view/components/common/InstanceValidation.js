export function isNewInstance(instance) {
  const { id, entityId } = instance;
  return id === 0 || id === '' || id === null || entityId === null;
}
