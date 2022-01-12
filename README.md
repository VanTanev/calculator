# Calculator

## Installation

```
yarn install
```

## Running a local dev server

This is a monorepo with Lerna and Turborepo.

It has an optimized `dev` script at the root that will build all packages and then start `react-scripts start` for the webapp and `nodaemon` server process for the backend.

```
yarn dev
```

## Running all tests

Similarly, there is a root `test` command that runs tests for all packages.

```
yarn test
```

## Project organization

The project is written as a monorepo. There are 3 modules:

-   [@calculator/common](./packages/common) - contains code shared between webapp and server
-   [@calculator/server](./packages/server) - An express.js / TypeScript backend application with a single endpoint: `POST /calculate`
-   [@calculator/webapp](./packages/webapp) - A React.js / TypeScript application

## Loom introduction

<a href="https://www.loom.com/share/d3ecaf3b8d7a4f7dbadc01bf318bb6af">
    <p>Calculator intro - Watch Video</p>
    <img style="max-width:300px;" src="https://cdn.loom.com/sessions/thumbnails/d3ecaf3b8d7a4f7dbadc01bf318bb6af-with-play.gif">
</a>
