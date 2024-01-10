import { Builder } from '../Builder';
import { BuildingUrlBuilder } from '../BuildingUrlBuilder';
import { LevelUrlBuilder } from '../LevelUrlBuilder';
import { VertexUrlBuilder } from '../VertexUrlBuilder';
import { BeaconUrlBuilder } from '../BeaconUrlBuilder';
import { ByLevelUrlBuilder } from '../ByLevelUrlBuilder';
import { EdgeUrlBuilder } from '../EdgeUrlBuilder';
import { AreaUrlBuilder } from '../AreaUrlBuilder';
import { ScaleUrlBuilder } from '../ScaleUrlBuilder';
import { FrontendUrlBuilder } from '../FrontendUrlBuilder';
import { ScaleVertexUrlBuilder } from '../ScaleVertexUrlBuilder';
import { FilesUrlBuilder } from '../FilesUrlBuilder';
import { UserUrlBuilder } from '../UserUrlBuilder';
import { VisitorUrlBuilder } from '../VisitorUrlBuilder';
import { WatcherUrlBuilder } from '../WatcherUrlBuilder';
import { ReaderUrlBuilder } from '../ReaderUrlBuilder';
import { RoleUrlBuilder } from '../RoleUrlBuilder';
import { LoginUrlBuilder } from '../LoginUrlBuilder';
import { PingUrlBuilder } from '../PingUrlBuilder';
import { LogoutUrlBuilder } from '../LogoutUrlBuilder';
import { MonitorUrlBuilder } from '../MonitorUrlBuilder';
import { ReadersUrlBuilder } from '../ReadersUrlBuilder';

class UrlBuilder extends Builder {
  constructor(endpoint) {
    super();
    this.endpoint = endpoint;
    this.parts = [];
  }

  building(value) {
    const partBuilder = new BuildingUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  frontend(value) {
    const partBuilder = new FrontendUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  files(value) {
    const partBuilder = new FilesUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  level(value) {
    const partBuilder = new LevelUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  byLevel(value) {
    const partBuilder = new ByLevelUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  vertex(value) {
    const partBuilder = new VertexUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  beacon(value) {
    const partBuilder = new BeaconUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  reader(value) {
    const partBuilder = new ReaderUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  edge(value) {
    const partBuilder = new EdgeUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  area(value) {
    const partBuilder = new AreaUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  scale(value) {
    const partBuilder = new ScaleUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  scaleVertex(value) {
    const partBuilder = new ScaleVertexUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  user(value) {
    const partBuilder = new UserUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  visitor(value) {
    const partBuilder = new VisitorUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  visitorGroup(value) {
    const partBuilder = new WatcherUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  role() {
    const partBuilder = new RoleUrlBuilder(this);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  login() {
    const partBuilder = new LoginUrlBuilder(this);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  logout() {
    const partBuilder = new LogoutUrlBuilder(this);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  ping() {
    const partBuilder = new PingUrlBuilder(this);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  monitor(value) {
    const partBuilder = new MonitorUrlBuilder(this, value);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  readers() {
    const partBuilder = new ReadersUrlBuilder(this);
    this.parts.push(partBuilder);
    return partBuilder;
  }

  build(useSlash = false) {
    const partial = this.parts.map((p) => p.build());

    let result = process.env.API_PREFIX;
    if (this.endpoint) {
      result += this.endpoint;
    } else {
      result += '/';
    }
    result += partial.join('/');
    if (useSlash) {
      result += '/';
    }
    return result;
  }
}

export { UrlBuilder };
