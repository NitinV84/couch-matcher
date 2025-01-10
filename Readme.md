# Couch Matcher

Couch Matcher is built using Django Rest Framework (DRF) for the backend, React for the frontend, and SQLite as the database.

## Prerequisites

- [Docker](https://www.docker.com/) (v20.10 or later)
- [Docker Compose](https://docs.docker.com/compose/) (v1.29 or later)


## Getting Started
## Installation Steps

### Clone the Repository

```bash
git clone https://github.com/NitinV84/couch-matcher.git
cd couch-matcher
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
SECRET_KEY=your_secret_key
DEBUG=your_debug_status
ALLOWED_HOSTS=your_host
```

### Build and Start the Application

Run the following commands to build and start the services:

```bash
docker compose up --build
```


### Access the Application

- Couch Matcher application: [http://localhost:5173](http://localhost:5173)


## Stopping the Application

To stop the application and remove containers, networks, and volumes, run:

```bash
docker-compose down
```
