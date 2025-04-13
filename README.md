# 📚 MyShop - E-Commerce Microservices Application

![.NET](https://img.shields.io/badge/.NET-8.0-blue?style=for-the-badge&logo=dotnet)
![Angular](https://img.shields.io/badge/Angular-17-red?style=for-the-badge&logo=angular)
![SQL Server](https://img.shields.io/badge/SQL%20Server-2022-orange?style=for-the-badge&logo=microsoftsqlserver)
![Docker](https://img.shields.io/badge/Docker-Container-blue?style=for-the-badge&logo=docker)

## 📌 Project Overview
**MyShop** is a microservices-based e-commerce web application built with:
- **Backend**: ASP.NET Core 8 (Microservices architecture)
- **Frontend**: Angular 17
- **Database**: Microsoft SQL Server 2022
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
- Start the admin-service (ASP.NET Core)
- Start the api-gateway (YARP)
- Start the Angular Frontend
- Start SQL Server with persistent data

### ⏳ Wait until all containers are running, then open in Browser:
```bash
🌐 Frontend: http://localhost:4200
🔐 Admin API Login: http://localhost:5000/api/admin/login

```

## 🛠 Development Mode (Without Docker)

If you prefer running services manually without Docker:

### ✅ Run the Backend (admin-service)
1. Open Visual Studio
2. Select `AdminService.sln`
3. Press `F5` or run:
```sh
cd backend/myshop/admin-service
dotnet run

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
 │   ├── 📂 admin-service (ASP.NET Core Microservice)
 │   ├── 📂 api-gateway (YARP Reverse Proxy)
 │   └── 📂 Database (SQL Server)
 ├── 📂 frontend (Angular UI)
 ├── 📄 docker-compose.yml (Container setup)
 ├── 📄 README.md

```

## API Endpoints (admin-service)

| **Endpoint**           | **Description**           | **Method** |
|------------------------|---------------------------|------------|
| `/api/admin/login`     | Login as admin with JWT   | `POST`     |
| `/api/admin/register`  | Register a new admin user | `POST`     |
| `/api/admin/roles`     | Fetch available roles     | `GET`      |


## 🔧 Technologies Used

- ASP.NET Core 8 – Backend REST API
- Angular 17 – Modular and responsive frontend
- Chart.js – Interactive and animated dashboard charts
- Microsoft SQL Server 2022 – Relational database
- YARP Reverse Proxy – Modern API Gateway
- JWT Authentication – Token-based secured APIs
- Bootstrap 5.3 – Clean responsive UI design
- Docker & Docker Compose – Full containerization

## 🤝 Contributing

I welcome contributions! You can:
- ⭐ Star this repository
- 📥 Open an issue
- 🛠 Submit a pull request
- 💬 Suggest improvements or new features

## 🛡 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

For any inquiries, reach out to: 

📧 Email: mbazie89@gmail.com
🚀 LinkedIn: https://www.linkedin.com/in/mbaziekone2251
