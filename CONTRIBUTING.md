# Contributing to BeProductiveBackend

Welcome ! We're thrilled that you're considering contributing.

## Environment Setup

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (preferred version: 18.14.0)
- [npm](https://www.npmjs.com/)
- [Docker](https://docs.docker.com/get-docker/) (optional, for Docker-based development)

### Clone the Repository

```bash
git clone https://github.com/yourusername/BeProductiveBackend.git
cd BeProductiveBackend
```

### Install Dependencies

```npm install```

### Environment Variables

Production Environment (.env)

For running the application in production mode, create a .env file in the project root with the following content:

```
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
SECRET_KEY=
GMAIL_ID=
GMAIL_PASS=
```

Development Environment (.env.dev)

For running the development server, create a .env.dev file with similar content as .env:

```
ATLAS_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
SECRET_KEY=
GMAIL_ID=
GMAIL_PASS=
```

Testing Environment (.env.test)

Create a .env.test file for using a local database for testing:

```
ATLAS_URI=mongodb://localhost:27017/test-database
SECRET_KEY=
GMAIL_ID=
GMAIL_PASS=
```

### Scripts

Start the Application in Production Mode:

```bash
npm start
```

Start the Development Server:

```bash
npm run dev
```

Run Tests:

```bash
npm run test
```

### Docker Development

If you prefer using Docker for development, follow these steps:
Create a .env file in the project root with the same content as .env.dev.
Run the following Docker command:
            
```bash
 docker-compose -f docker-compose-development.yaml up
 ```

## Issue Reporting

If you find a bug or have a suggestion for improvement, please open an issue on the [issue tracker](https://github.com/thakkarnetram/BeProductiveBackend/issues).

### JOIN THE COMMUNITY 
<h3><a href="https://join.slack.com/t/be-productive-world/shared_invite/zt-22xf2o5va-vZl19htTM3rR1ioEJzl2Cg">Slack Community </a></h3>