import { Builder } from './Builder';

class LevelUrlBuilder extends Builder {
  constructor(parentBuilder, levelId) {
    super();
    this.parent = parentBuilder;
    this.id = levelId;
    this.endpoint = 'levels';
    this.img = false;
  }

  and() {
    return this.parent;
  }

  image() {
    this.img = true;
    return this;
  }

  build() {
    let result = '';
    if (this.endpoint) {
      result += this.endpoint;
    }
    if (this.id) {
      result += `/${this.id}`;
    }
    if (this.img) {
      result += '/image';
    }
    return result;
  }
}

export { LevelUrlBuilder };
