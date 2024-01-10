# File structure

We the have the following frontend files structure:

In the /beacon-admin-web/src/js you could find the main part of application:

/[actions](..\src\js\actions) - The actions folder contains [Redux action creators](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#action-creators) and all action types as constants in `actionTypes.js` files.

/[config](..\src\js\config) - Files in the config folder are responsible for application initialization and control localization. File `Application.js` loads settings of the current user and controls change of active language.

/[reducers](..\src\js\reducers) - All reducers are stored in the reducers folder. [Reducers](https://redux.js.org/tutorials/fundamentals/part-3-state-actions-reducers) specify how the application's state changes in response to [actions](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow) sent to the store.

/[service](..\src\js\service) - The service folder contains services. Services are just plain objects with methods that do [axios](https://github.com/axios/axios) requests.

/[thunk](..\src\js\thunk) - The Thunk folder contains asynchronous actions. Asynchronous action is another type of redux action it works on middleware mechanism and uses the [redux-thunk library](https://github.com/reduxjs/redux-thunk).

/[transformers](..\src\js\transformers) - Every transformer is a singleton and most of them extends the abstract class AbstractTransformer. A transformer is injected into a React component to transform data into a format that can be passed to providers.

/[utils](..\src\js\utils) - This folder different helping functions like a function that transform the first letter to uppercase or functions that we use for sort data. Also, it contains URL builders that we use to build unique URLs depending on passed data.

/[view](..\src\js\view) - components that works with main application render.

### Folders and files naming logic

Components or helper functions which contains css styles or tests files are located in the folder named after the component name, name of component file is index.js.

Components or helper functions without separate css styles or tests files are located in the folder named by application part, name of component file is a component name.
