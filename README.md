# Delivery App using React/React-native
===========================================================================================
## [Documents](docs/README.md)
## [Tutorials](docs/TUTORIAL.md)

## Requirements
------------
- Node.js

Usage
-----
### Setup
- Install the dependencies: *npm install*
- Go to mobile/ReactNotes then run *npm install* again to setup development environment for mobile
- You may run script from server/data/db/schema.js or import scripts/tkframework.sql using phpmyadmin
- Run *echo "sdk.dir=$ANDROID_HOME" > android/local.properties* to setup android environment

### Development
- Run Webpack development server: *npm start*
- Run Server development server: *npm run server*
- Point your browser to the server (e.g. http://localhost:7000) and begin development at ./src
- There are also browser extensions, such as [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi) and [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=ja), which can significantly boost React app development

### Production
- Create minified bundle: *npm run bundle*
- Serve ./public with your production server of choice
- Run *sshpass -p "password" npm run deploy* to deploy on server
- Run *sshpass -p "password" npm run server-deploy* to deploy server code
- Run *sshpass -p "password" npm run client-deploy* to deploy website code
- Run *npm run build:ios* to bundle react-native code in **ReactNotes** folder
- Run *PORT=80 DB_PASS=123456 forever -w start index.js* to keep server running and restarting on changes
- Run *node-inspector & npm run server* if node does not support --inspect

### [Setup server](docs/SERVER.md)
