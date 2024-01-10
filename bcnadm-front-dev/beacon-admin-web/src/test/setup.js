/**
 * Temporary hack to suppress error {@link https://github.com/facebookincubator/create-react-app/issues/3199}
 */
import './shimSetup';

import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });
require('dotenv').config();
