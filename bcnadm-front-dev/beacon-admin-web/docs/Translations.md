# Localization in Front-end

For localization we use [react-localize-redux](https://github.com/ryandrewjohnson/react-localize-redux) package.

Available locales stored in constant localeValues, placed in `localeConsts.js`

Tree-like translations structure stored in file `labelsTranslations.json`. See following:

```js
{ "loginpage":
{ "enter": [ "ENTER", "ВОЙТИ" ],
"username": [ "Username", "Имя пользователя" ],
"password": [ "Password", "Пароль" ],
"emptyWarning": [ "*This field shouldn't be empty", "*Это поле не должно быть пустым" ]
}
}
```

**Order of locales in labelsTranslations must be the same as order in languages const!**

Locale provider inserts function translate in context of it's children, so any component can use it. To reduce using context we use `withLocalize` HOC, which receive translate function from context and inserts it as prop to wrapped component.

## Usage

To enable localization at component those steps should be done:

1.  Wrap target component with withLocalize HOC, ex: export default `withLocalize(someComponent)`;
2.  Get translate function from props. Ex: const {translate} = this.props;
3.  Call function with consnant name. Ex: translate("loginpage.username"). This function will return string with label in current locale.

**_Example_**

```js
import { withLocalize } from 'react-localize-redux'; // import library
.
.
.
someFunction () => {
const {translation} = this.props // Get translate function from props
//some code here
() => translate('map.newPlace', { value: level.number }) //translate result
}
.
.
.
export default withLocalize(connect(mapStateToProps, mapDispatchToProps)(someComponent)); // connect with redux store
```
