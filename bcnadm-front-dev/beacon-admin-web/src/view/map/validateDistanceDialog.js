// distance must be between 0 and 10000 meters
const maxDistance = 10000;
export const validateDistance = (distance) => distance > 0 && distance <= maxDistance;
