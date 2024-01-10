import { Builder } from './Builder';

class BeaconUrlBuilder extends Builder {
  constructor(parentBuilder, beaconId) {
    super();
    this.parent = parentBuilder;
    this.id = beaconId;
    this.endpoint = 'beacons';
  }

  and() {
    return this.parent;
  }

  build() {
    let result = '';
    if (this.endpoint) {
      result += this.endpoint;
    }
    if (this.id) {
      result += `/${this.id}`;
    }
    return result;
  }
}

export { BeaconUrlBuilder };
