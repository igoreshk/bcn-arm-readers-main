const BeaconService = {};

const resolvedBeacons = [];

BeaconService.findByLevel = () => new Promise((resolve) => resolve(resolvedBeacons));

export { BeaconService };
