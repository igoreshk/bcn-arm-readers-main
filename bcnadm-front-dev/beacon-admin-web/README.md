# How to run the project

### 1. Install NodeJS and NPM

Download from https://nodejs.org/en/download or use NVM https://github.com/nvm-sh/nvm

Required node version = ^12, ^14, npm = ^6 (any newer version may not work)

### 2. Set up frontend

1.  Open IDE (VSCode, WebStorm, Intellij IDEA CE or any other IDE, your choice)
2.  The VPN must be connected
3.  Clone the project from GIT
4.  Open folder "beacon-admin-web" in the terminal (integrated terminal). It could be done by the going to the repository root and run "cd beacon-admin-web" OR right-click on beacon-admin-web on the left column in the project tree and choose "Open in terminal".
5.  Run "npm install" or "npm i".
6.  if you see following message in the end you can safely ignore it:
    found 212 vulnerabilities (99 low, 93 moderate, 20 high)

### 3. Run frontend

In the terminal, in the same folder "beacon-admin-web" run "npm start"
The project will be opened in browser.

### 4. Verify that it works

If the project does not open or you need to check whether the backend part works you could use http://bcn-dev.lab.epam.com/buildings

Try to add building...

**_If you need more information about the project, you can find it in the folder [docs](.\docs)_**

---

## Not for frontend students.

To use local backend you need to open [.env](.env) file and change:

```
API_URL=http://localhost:10020
NODE_ENV = bcn
```

and [webpack.config.js](./webpack.config.js) file changes:

```js
changeOrigin: false;
```
