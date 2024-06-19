## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
  - [Starting the Server](#starting-the-server)
  - [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

# Prerequisites

- Nestjs
- Nodejs
- TypeScript
- Prisma
- PostgreSQL database

# Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/IgnatiusFrancis/BackendAss.git

   # Install dependencies:
   npm install
   ```

# Configuration

Create a .env.development or production file in the root directory and configure the following environment variables:

```env
DATABASE_URL=""
NODE_ENV=""
BASEURL="random string"
PORT=""
JWT_SECRET=""
JWT_EXPIRATION=""
```

# Usage

## Starting the Server

To start the API server, run the following command:

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

The API will be accessible at  [API](https://test-ktsa.onrender.com/api/v1) 


Feel free to explore the API and refer to the [API Documentation](https://documenter.getpostman.com/view/19595090/2sA3XTefWd) for detailed information on each endpoint and their functionalities.