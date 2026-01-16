# Service Tracker - React Frontend

This is the React frontend for the service tracker. It uses generated TypeScript types and React Query hooks from the OpenAPI spec to ensure type safety across the stack.

## Tech Stack
 - Language: TypeScript
 - Framework: React 19
 - Build Tool: Vite
 - Routing: TanStack Router
 - Data Fetching: TanStack Query
 - UI Library: Material UI (MUI)
 - Codegen: Orval (OpenAPI to TypeScript/React Query hooks)
 - WebSocket: Used to receive updates from the server after images have been downloaded and stored locally

## Local Development

### Prerequisites
To run this project locally, you need to install:

 - Node.js (20+): The JavaScript runtime. [Install Node.js](https://nodejs.org/)

### API Generation (Orval)
When you modify the OpenAPI specification (openapi.yaml), regenerate the types and React Query hooks:

```
npm run api:generate
```

### Run the Application

```
npm run dev
```
