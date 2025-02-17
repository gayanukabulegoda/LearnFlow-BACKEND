<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/gayanukabulegoda/LearnFlow-BACKEND">
    <!-- You can add a project-specific logo here if you wish -->
    <img src="/src/assets/learnFlowIcon.png" alt="LearnFlow Logo" width="110" height="110">
  </a>

<h2 align="center">LearnFlow BACKEND</h2>

  <p align="center">
    Welcome to the <strong>LearnFlow</strong> backend repository! This Node.js/Express.js API (with TypeScript, Prisma, and MySQL) powers a dynamic learning platform. It handles user authentication, AI-driven resource recommendations, and progress tracking for self-learners.
    <br />
    <a href="https://github.com/gayanukabulegoda/LearnFlow-BACKEND/tree/main/src"><strong>Explore the project »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/gayanukabulegoda/LearnFlow-BACKEND/issues/new?labels=bug">Report Bug</a>
    ·
    <a href="https://github.com/gayanukabulegoda/LearnFlow-BACKEND/issues/new?labels=enhancement">Request Feature</a>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <ul>
      <li><a href="#core-features">Core Features</a></li>
      <li><a href="#built-with">Built With</a></li>
    </ul>
    <li><a href="#getting-started">Getting Started</a></li>
    <ul>
      <li><a href="#prerequisites">Prerequisites</a></li>
      <li><a href="#installation-and-setup">Installation and Setup</a></li>
      <li><a href="#usage">Usage</a></li>
    </ul>
    <li><a href="#api-documentation">API Documentation</a></li>
    <li><a href="#frontend-repository">Frontend Repository</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

---

<!-- ABOUT THE PROJECT -->
## About The Project

**LearnFlow** is a smart, adaptive platform that helps users set and track their personal learning goals, such as “Learn Python” or “Master React.” By leveraging basic AI/NLP techniques, it recommends relevant free online resources (articles, videos, courses) to support each user’s unique learning path. Users can log their progress, maintain streaks, and receive weekly learning recommendations to stay motivated.

### Core Features

1. **Goal Setting and Management**  
   Users can create learning goals and break them down into smaller, manageable tasks.

2. **AI-Driven Resource Recommendations**  
   The system uses libraries like `compromise` and `natural` to analyze goals and suggest relevant resources from public APIs (Wikipedia, MDN).

3. **Progress Tracking**  
   Users can Track their progress, update streaks, and visualize learning progress.

4. **User Authentication & Authorization**  
   Secure login and API access control via JSON Web Tokens (JWT).

5. **RESTful Endpoints**  
   Organized routes for goals, resources, analytics, and user management.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

### Built With

This backend is powered by a modern, scalable stack ensuring robust performance and maintainability:

[![Node.js][node-shield]][node-url]
[![Express.js][express-shield]][express-url]
[![TypeScript][typescript-shield]][typescript-url]
[![Prisma][prisma-shield]][prisma-url]
[![MySQL][mysql-shield]][mysql-url]
[![JWT][jwt-shield]][jwt-url]
[![Postman][postman-shield]][postman-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<!-- GETTING STARTED -->
## Getting Started

This section will guide you through setting up the **LearnFlow BACKEND** on your local machine.

### Prerequisites

1. **Node.js** (v22+ recommended)  
   [Download & Install Node.js](https://nodejs.org/en/download/)
2. **MySQL** (or a compatible SQL database)  
   [Download & Install MySQL](https://dev.mysql.com/downloads/)
3. **npm or yarn** (npm comes bundled with Node.js)  
   [Install Yarn if you prefer Yarn](https://classic.yarnpkg.com/lang/en/docs/install/)
4. **Postman** (optional for API testing)  
   [Download Postman](https://www.postman.com/downloads/)

### Installation and Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/gayanukabulegoda/LearnFlow-BACKEND.git
   ```
   Navigate into the project directory:
   ```bash
   cd LearnFlow-BACKEND
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   or
   ```bash
   yarn install
   ```

3. **Configure Environment Variables**  
   Create a `.env` file in the root directory and set the following variables (example):
   ```bash
   DATABASE_URL="mysql://<username>:<password>@localhost:3306/learnflow_db"
   JWT_SECRET="your_jwt_secret_key"
   JWT_EXPIRES_IN="in_days, hours, minutes or seconds (e.g., 7d)"
   PORT=5000
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   CURRENT_API_VERSION=v1
   ```
   Adjust the values according to your local or production environment.

4. **Database Setup with Prisma**  
   Initialize or migrate your database schema:
   ```bash
   npx prisma migrate dev
   ```
   This command will create or update your database schema according to the Prisma schema definition in `prisma/schema.prisma`.

### Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The server should now be running at [http://localhost:5000](http://localhost:5000).

2. **Production build and run**
   ```bash
   npm run build
   npm start
   ```
   or
   ```bash
   yarn build
   yarn start
   ```
   This will compile TypeScript to JavaScript and run the production build.

3. **Testing** (optional)  
   If you have unit or integration tests, you can run:
   ```bash
   npm run test
   ```
   or
   ```bash
   yarn test
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## API Documentation

Comprehensive API documentation (including endpoints, request/response examples, and environment setups) can be found in the [Postman Collection](https://documenter.getpostman.com/view/36681432/2sAYXFhxL8).

- Make sure the server is running locally (or remotely) before sending requests to the provided endpoints.
- The Postman documentation also includes sample payloads and environment variables for quicker testing.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Frontend Repository

The frontend for this project is built with React. Visit the **LearnFlow FRONTEND** repository for more details:
- [LearnFlow FRONTEND](https://github.com/gayanukabulegoda/LearnFlow-FRONTEND.git)

---

## License

Distributed under the **MIT License**. See [`LICENSE`](https://github.com/gayanukabulegoda/LearnFlow-BACKEND/blob/main/LICENSE) for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<div align="center">

  <p>
    &copy; 2025 <a href="https://grbulegoda.me/" target="_blank">Gayanuka Bulegoda</a>
  </p>

</div>


<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[node-shield]: https://img.shields.io/badge/Node.js-black?style=for-the-badge&logo=node.js&logoColor=green
[node-url]: https://nodejs.org/
[express-shield]: https://img.shields.io/badge/Express.js-black?style=for-the-badge&logo=express&logoColor=white
[express-url]: https://expressjs.com/
[typescript-shield]: https://img.shields.io/badge/TypeScript-black?style=for-the-badge&logo=typescript&logoColor=3178C6
[typescript-url]: https://www.typescriptlang.org/
[prisma-shield]: https://img.shields.io/badge/Prisma-black?style=for-the-badge&logo=prisma&logoColor=white
[prisma-url]: https://www.prisma.io/
[mysql-shield]: https://img.shields.io/badge/MySQL-black?style=for-the-badge&logo=mysql&logoColor=white
[mysql-url]: https://www.mysql.com/
[jwt-shield]: https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white
[jwt-url]: https://jwt.io/
[postman-shield]: https://img.shields.io/badge/Postman-black?style=for-the-badge&logo=Postman&logoColor=FF7139
[postman-url]: https://www.postman.com/