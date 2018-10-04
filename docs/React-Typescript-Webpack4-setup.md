npm install react
npm install react-dom
npm install @types/react
npm install @types/react-dom

npm install --save-dev webpack
npm install --save-dev webpack-cli
npm install --save-dev typescript
npm install --save-dev awesome-typescript-loader
npm install --save-dev ts-loader

"express": "^4.16.2",
    "nedb": "^1.8.0",
    "react": "^16.2.0",
    "react-dom": "^16.2.0",
    "react-router-dom": "^4.2.2"

```
// package.json

{
    "name": "react-typescript",
    "version": "1.0.0",
    "description": "This is a react boilerplate project using   TypeScript and webpack",
    "main": "App.tsx",
    "repository": "https://github.com/justinpathrose/react-typescript.git",
    "author": "justinpathrose",
    "license": "MIT",
    "scripts": {
        "start": "./node_modules/.bin/webpack-dev-server --progress",
        "build": "webpack"
    },
    "devDependencies": {
        "@types/react": "^15.0.24",
        "@types/react-dom": "^15.5.0",
        "ts-loader": "^2.0.3",
        "typescript": "^2.2.2",
        "webpack": "^2.3.2",
        "webpack-dev-server": "^2.4.2"
    },
    "dependencies": {
        "react": "^15.4.2",
        "react-dom": "^15.4.2"
    }
}
```

```
// my package.json

{
	"name": "view-js-example-2",
	"version": "1.0.0",
	"description": "View.js Examples",
	"license": "MIT",
	"dependencies": {
		"express": "^4.16.3",
		"nedb": "^1.8.0",
		"react": "^16.5.2",
		"react-dom": "^16.5.2",
		"react-router": "^4.3.1",
		"react-router-dom": "^4.3.1"
	},
	"devDependencies": {
		"copy-webpack-plugin": "^4.5.2",
		"css-loader": "^1.0.0",
		"extract-text-webpack-plugin": "^4.0.0-beta.0",
		"file-loader": "^2.0.0",
		"html-webpack-plugin": "^3.2.0",
		"node-sass": "^4.9.3",
		"sass-loader": "^7.1.0",
		"ts-loader": "^5.2.1",
		"typescript": "^3.1.1",
		"webpack": "^4.20.2",
		"webpack-cli": "^3.1.2",
		"@types/react": "^16.4.14",
		"@types/react-dom": "^16.0.8"
	},
	"scripts": {
		"serve": "webpack-dev-server --devtool eval --progress --colors --open --hot",
		"dev": "webpack --mode development",
		"dev:w": "webpack --mode development -w",
		"build": "webpack --mode production",
		"tools": "copy .\\server.js .\\dist",
		"fonts": "xcopy .\\src\\assets\\fonts .\\dist\\assets\\fonts /E",
		"images": "xcopy .\\src\\assets\\images .\\dist\\assets\\images /E",
		"assets": "npm run tools && npm run fonts && npm run images",
		"copy": "npm run assets"
	}
}
```

### Create webpack.config.js

```
// REF : https://medium.com/@justin.pathrose/configure-react-project-using-typescript-and-webpack-f69faee3e915

var path = require("path");

var config = {
/* The entry point of the application. Webpack uses this information to create the dependency tree which is used to bundle the scripts.*/
entry: ["./app/App.tsx"],

/* This information is used to give the name of the bundled file and the location of the bundled file. */
output: {
   path: path.resolve(__dirname, "build"),
   publicPath: "/build/",
   filename: "bundle.js"
},

/* The extensions which will be imported or required in the application scripts. */
resolve: {
    extensions: [".ts", ".tsx", ".js"]
},

module: {

/* Define the loaders to be used. Regex will test the type of files on which the loader is to be applied. The excluded files are also mentioned. Loaders are used mainly to preprocess/transpile the file when imported or required in the scripts before bundling. */

loaders: [{
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/
  }]
}};

module.exports = config;
```
