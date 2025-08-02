<div align="center">

  <br />
  <br />

  <h1 align="center">Amer Center Compensation Portal</h1>

  <p align="center">
    A sleek, real-time, full-stack solution for streamlined compensation and ticket management.
    <br />
    <a href="#-the-mission"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#-quick-start">View Demo</a>
    ·
    <a href="https://github.com/mo-omen/amer-compensation/issues">Report Bug</a>
    ·
    <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#-the-mission">The Mission</a>
      <ul>
        <li><a href="#-built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#-quick-start">Quick Start</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#-meet-the-team">Meet the Team</a></li>
    <li><a href="#-license">License</a></li>
  </ol>
</details>

---

### 🎯 The Mission

In a fast-paced service center, clarity and efficiency are paramount. The **Amer Center Portal** was built to eliminate ambiguity and streamline the process of handling compensation requests. It replaces manual tracking with a dynamic, real-time system, ensuring every team member—from the front desk to the back office—is perfectly in sync.

This application provides a persistent, secure, and intuitive environment to manage the entire lifecycle of a request, from creation to final resolution.

---

### ✨ Core Features

* **🔐 Role-Based Dashboards:** Secure, tailored interfaces for **Admin**, **Reception**, and **Counter** staff.
* **⚡ Real-Time Sync:** Powered by a Node.js backend, all data updates instantly across every user's screen. No refreshes needed.
* **🗄️ Persistent Storage:** Your data is safe. A server-side JSON database ensures information survives server restarts and shutdowns.
* **📊 Daily Reporting & Export:** Admins can generate daily transaction logs and export them to **CSV** for easy analysis.
* **👤 Full User Management:** Admins have complete control to create, edit, and delete user accounts.
* **📜 Complete Ticket History:** Every action is logged with a user and timestamp, providing a clear audit trail for each request.

---

### 🚀 Built With

This project leverages a modern, lightweight, and reliable tech stack.

* ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
* ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
* ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ⚙️ Quick Start

Get the server up and running on your local machine in just a few minutes.

### Prerequisites

You must have **Node.js** and **npm** installed on your system.
* [Download Node.js](https://nodejs.org/) (npm is included)

### Installation

1.  **Clone the repository** (or create the directory structure manually)
    ```sh
    git clone https://github.com/mo-omen/amer-portal.git
    cd amer-portal
    ```

2.  **Install NPM packages**
    This command installs the required dependencies (Express & CORS).
    ```sh
    npm install
    ```

3.  **Launch the Server**
    This will start the application on `http://localhost:2525`.
    ```sh
    npm start
    ```

4.  **Access the Portal**
    Open your browser and navigate to `http://localhost:2525`.

> **Production Note:** For a live environment, use a process manager like **PM2** to ensure the server runs continuously. Refer to the **Deployment Guide** for detailed instructions.

---

## 👤 Meet the Team

The system is pre-loaded with sample users to demonstrate the role-based functionality.

| Role      | Email                 | Password      | Primary Mission                                       |
| :-------- | :-------------------- | :------------ | :---------------------------------------------------- |
| 👑 **Admin** | `admin@amer.com`      | `password123` | Oversee the entire system, manage users, and view logs. |
| 🛎️ **Reception** | `reception@amer.com`  | `password123` | Triage incoming requests and coordinate with counters.  |
| 👨‍💻 **Counter** | `counter@amer.com`    | `password123` | Create and manage compensation requests from the front line. |

---

## ⚠️ Disclaimer

This project is a conceptual demonstration and a proof-of-concept. It is not officially affiliated with, associated with, authorized, endorsed by, or in any way connected with the official Amer centers or the General Directorate of Residency and Foreigners Affairs (GDRFA) in Dubai or any of its subsidiaries or its affiliates. All names, marks, emblems, and images are registered trademarks of their respective owners.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` file for more information.
