# Node Inventory Using Clean Architecture

This project demonstrates a simple login system implemented using the principles of Clean Architecture. It aims to separate concerns across different layers, making the system more maintainable, testable, and scalable.

## Table of Contents

- [Introduction](#introduction)
- [Architecture Overview](#architecture-overview)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Introduction

The login project provides a template for implementing a user authentication system using the Clean Architecture approach. The main goals are to:

- Keep the business logic independent of frameworks and UI.
- Enable easier testing of the core application logic.
- Allow independent development of UI and business logic.

## Architecture Overview

Clean Architecture divides the project into several layers:

1. **Entities**: Business objects that encapsulate critical business rules.
2. **Use Cases**: Application-specific business rules.
3. **Interface Adapters**: Converters and adapters to enable communication between the use cases and external agencies like UI and databases.
4. **Frameworks and Drivers**: External agents like databases, UI, web frameworks, etc.

### Layers and Their Responsibilities

- **Entities**: Represent the core business logic and rules.
- **Use Cases**: Coordinate the flow of data to and from entities.
- **Interface Adapters**: Transform data from the format most convenient for use cases and entities to the format most convenient for frameworks and drivers.
- **Frameworks and Drivers**: Interact with external systems like databases and web servers.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Project Structure


```
node-app/
├── src/
│ ├── config/
│ ├── data/
│ │ └── datasources/
│ ├── domain/
│ │ ├── entities/
│ │ ├── errors/
│ │ └── repositories/
│ ├── infrastructure/
│ │ └── datasource/
│ ├── presentation/
│ │ └── auth/
│ │ ├── router.ts
│ │ └── server.ts
│ ├── use-cases/
│ ├── app.ts
├── .env.template
├── .gitignore
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
```

### Installation

#### Prerequisites

- Node.js (v12.x or higher)
- pnpm (v6.x or higher)

If you don't have `pnpm` installed globally, you can install it using `npm`:

```bash
npm install -g pnpm
```

# dev
1. Clone the repository.
2. Configure the enviroment variables.
3. execute the command 
```bash
pnpm i
```
4. Up the database with the command 
```bash
docker compose up -d
```

## Technologies Used

TypeScript: Programming language
Node.js: JavaScript runtime
Express: Web framework for Node.js
Jest: Testing framework
pnpm: Package manager
TypeORM: ORM for TypeScript and JavaScript
Contributing
We welcome contributions to improve this project. Please fork the repository and create a pull request with your changes.

## Steps to Contribute
Fork the repository.
Create a feature branch (git checkout -b feature/your-feature).
Commit your changes (git commit -m 'Add some feature').
Push to the branch (git push origin feature/your-feature).
Open a pull request.

## License
This project is licensed under the MIT License.
