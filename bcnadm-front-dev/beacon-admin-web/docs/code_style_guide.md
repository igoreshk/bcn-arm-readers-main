# Code style

We use `ESLint` and `Prettier` in our project. We already have files with their configurations and rules, they will install with the project, so no need to configure them.

You can use ready-made extensions for VScode or install them directly to your IDE. After installation, make sure that they are installed in your IDE and that the rules adopted in the project and locally in your IDE do not contradict each other.

## How to use ESLint and Prettier

To run a ESlint check type in the console:

```
eslint <file|dir|glob>
```

`<file|dir|glob>` can be file or folder/file name, if name is not unique in project

for example:

```
eslint PlaceDataProvider.js
```

or

```
eslint PlaceDialog\index.js
```

Prettier is forking with ESLint, so no need to run it separately.

---

But its better to configure ESlint and Prettier to work automatically. You can right-click, locate in the file you want to check, and select `Format Document with` and choose ESlint. Or configure it on working automatically while saving changes.

---

To work with JSON files, such as `labelTranslations`, we use JSON Language Features as default.
Sometimes Prettier wants to do this work for us, so be carefull
