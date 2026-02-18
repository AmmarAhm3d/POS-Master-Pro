# POS Master Pro - Frontend

The modern user interface for the POS Master Pro system. Built with **React** and **Tailwind CSS**.

## 🛠️ Tech Stack

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **State Management:** React Hooks
- **HTTP Client:** Fetch API
- **Icons:** FontAwesome

## 📂 Project Structure

- **components:** Reusable UI components (Buttons, Cards, Modals).
- **pages:** Main application views (Dashboard, Products, Sales History).
- **hooks:** Custom React hooks for logic reuse.
- **api.js:** Centralized API service for backend communication.

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Setup

1.  **Install Dependencies:**

    ```bash
    npm install
    ```

2.  **Configure API URL:**
    - Ensure `api.js` points to your running API instance (default is usually `https://localhost:7022`).

3.  **Run Development Server:**

    ```bash
    npm run dev
    ```

4.  **Open in Browser:**
    - The application will be available at `http://localhost:3000` (or similar port provided by Vite).
