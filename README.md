# Service tracker

Service Tracker is a vehicle service record tracking application designed to help users manage and maintain detailed records of their vehicle's service history. 

The app allows users to log, organize, and access information about routine maintenance, repairs, and inspections. 

With a focus on simplicity and efficiency, Service Tracker ensures that users can keep their vehicles in optimal condition by staying on top of service schedules and tracking costs over time.


## Go

Start the server:

```go run cmd/server/main.go```

Generate types from the openapi spec:

```oapi-codegen --config server.cfg.yaml openapi.yaml```

Ensure .mod file references are accurate

```go mod tidy```

Clean cache

```go clean -cache```

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).
