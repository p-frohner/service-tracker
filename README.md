# Service tracker

Service Tracker is a vehicle service record tracking application designed to help users manage and maintain detailed records of their vehicle's service history. 

The app allows users to log, organize, and access information about routine maintenance, repairs, and inspections. 

With a focus on simplicity and efficiency, Service Tracker ensures that users can keep their vehicles in optimal condition by staying on top of service schedules and tracking costs over time.


## Commands

Start the server:

```go run cmd/server/main.go```

Generate types from the openapi spec:

```oapi-codegen --config server.cfg.yaml openapi.yaml```