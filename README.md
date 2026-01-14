# 🏎️ Service Tracker

Exploring Golang by building Service Tracker—a simple Go + React app to manage vehicle maintenance history and costs. Yes, I realized a few days in how misleading the name sounds for a dev project! 🤷‍♂️

## Environment Setup
Create a `.env` file in the root directory with your API keys:

```
SERPER_API_KEY=your-serper-api-key
```

Get your Serper API key from [serper.dev](https://serper.dev). See `.env.example` for a template.

## Using Docker
The easiest way to get started. This handles the Database and the Go server together. From the root directory:

```
make docker-up
```

## Local Development
The project is structured as a monorepo. To learn more about the specific setup, API contracts, or frontend configuration for each part, please refer to their respective documentation:

[Server README.MD](server/README.md)

[Client README.MD](client/README.md)


## A long way to *Go*
- search
- finish rest of the vehicles endpoints
- maintenance records endpoints
- authentication

