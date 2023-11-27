# vue-project

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## How to host integrate inside your application

### Dependancies (Import bootstrap and JQuery if not imported already)
```html
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
```

### Latest build
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/access-ci-org/Operations_WebApp_InfrastructureNewsViews/dist/assets/index.css">
<div id="Operations_WebApp_InfrastructureNewsViews"></div>
<script src="https://cdn.jsdelivr.net/gh/access-ci-org/Operations_WebApp_InfrastructureNewsViews/dist/assets/index.js"></script>
```

### Specific version
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/access-ci-org/Operations_WebApp_InfrastructureNewsViews@0.0.20/dist/assets/index.css">
<div id="Operations_WebApp_InfrastructureNewsViews"></div>
<script src="https://cdn.jsdelivr.net/gh/access-ci-org/Operations_WebApp_InfrastructureNewsViews@0.0.20/dist/assets/index.js"></script>
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Release

This is to be executed based on the number of changes the particular release carries. 
The execution of the command will build the project assets, commit, tag and push to the github. And then github publishes the assets to github.io.

[https://access-ci-org.github.io/step-2023-shared-webapps-library/dist/#/](https://access-ci-org.github.io/step-2023-shared-webapps-library/dist/#/)

```sh
npm run patch
```
or 
```sh
npm run minor
```
or
```sh
npm run major
```
