# 📚 MyShop - E-Commerce Microservices Application

![.NET](https://img.shields.io/badge/.NET-8.0-blue?style=for-the-badge&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2019-orange?style=for-the-badge&logo=microsoftsqlserver)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker)

## 📌 Project Overview
**MyShop** is a microservices-based e-commerce web application built with:
- **Backend**: ASP.NET Core 8 (Microservices architecture)
- **Frontend**: Angular 17
- **Database**: Microsoft SQL Server
- **API Gateway**: YARP Reverse Proxy
- **Containerization**: Docker & Docker Compose

## 🚀 Getting Started

### 📥 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (LTS version)
- [Angular CLI](https://angular.io/cli)
- [Docker & Docker Compose](https://www.docker.com/)
- [Visual Studio](https://visualstudio.microsoft.com/) (for .NET Backend)
- [SQL Server Management Studio (SSMS)](https://docs.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (Optional)

---

## ⚙️ **Installation & Setup**

### 🔹 Clone the Repository
```sh
git clone https://github.com/Mbazie-Kone/MyShop.git
cd MyShop

```
### 🔹 Start the Application (Dockerized)
To run all services (backend, frontend, database, and API Gateway) inside Docker containers, execute:
```sh
docker-compose up --build

```
This will:
- tart the User-Service (ASP.NET Core)
- tart the API Gateway (YARP)
- Start the Angular Frontend
- Start SQL Server with persistent data

### ⏳ Wait until all containers are running, then open:
```bash
Frontend: http://localhost:4200
Backend API: http://localhost:5000/api/users
API Gateway: http://localhost:5001/users

```

## 🛠 Development Mode (Without Docker)

If you prefer running services manually without Docker:

### ✅ Run the Backend (User-Service)
1. Open Visual Studio
2. Select UserService.sln
3. Press F5 or run:
```sh
docker run

```

### ✅ Run the Frontend (Angular)
1. Open a terminal inside the frontend folder:
```sh
cd frontend
npm install
ng serve

```

2. Open the browser and go to:
http://localhost:4200

## 🏗 Microservices Architecture

#### 📌 The project follows a microservices-based architecture:
```scss
📦 MyShop
 ├── 📂 backend
 │   ├── 📂 UserService (ASP.NET Core Microservice)
 │   ├── 📂 ApiGateway (YARP Reverse Proxy)
 │   └── 📂 Database (SQL Server)
 ├── 📂 frontend (Angular UI)
 ├── 📄 docker-compose.yml (Container setup)
 ├── 📄 README.md

```

## 🔗 API Endpoints

| **Endpoint**           | **Description**         | **Method** |
|------------------------|-------------------------|------------|
| `/api/users`           | Get all users           | `GET`      |
| `/api/users/{id}`      | Get user by ID          | `GET`      |
| `/api/users/login`     | User authentication     | `POST`     |
| `/api/users/register`  | Register a new user     | `POST`     |


## 🔥 Built With
- ASP.NET Core 8 - Backend API
- Angular 17 - Frontend UI
- Microsoft SQL Server - Database
- YARP Reverse Proxy - API Gateway
- Docker & Docker Compose - Containerization

## 🤝 Contributing

Contributions are welcome! Feel free to:
- ⭐ Star this repository
- 📥 Open an issue
- 🛠 Submit a pull request

## 🛡 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any inquiries, reach out to: 📧 Email: mbazie89@gmail.com
🚀 LinkedIn: 