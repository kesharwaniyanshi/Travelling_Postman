
# Travelling Postman



## 📖 Project Overview

The **Travelling Postman** project is an advanced logistics system designed for **India Post**, aimed at revolutionizing mail and package delivery services. By leveraging cutting-edge technologies such as **Next.js**, **React.js**, **Python**, **PostgreSQL**, and **Machine Learning**, this system optimizes routing and improves efficiency across multiple transportation modes.

## URL :https://travelling-postman-gstcr9tnp-rizvi-faiz-syeds-projects.vercel.app

## Demo Video:
![Demo Video](/public/Recording%202024-12-16%20195437%20(1).gif)



### Key Features:
1. **Dynamic Mail Transmission System**: Developed using **Next.js** for a responsive frontend and **PostgreSQL** for robust database management, this system ensures seamless integration of routing operations.
2. **Optimized Routing**: Implements the **A*** algorithm to predict optimal delivery routes, considering:
   - Historical data
   - Seasonal festivals
   - Climatic conditions
   This approach outperforms the traditional **A * algorithm**, enhancing decision-making and reducing delivery time by 30%.
3. **Real-Time Node Safety Assessment**: Integrates self-learning algorithms that analyze real-time data from:
   - Weather updates
   - News reports
   - Social media
   This ensures safe and efficient mail transmission.
4. **Multi-Mode Transportation Support**: Facilitates dynamic route planning across different modes of transportation, enabling better resource utilization.

---

## 🛠 Getting Started

### Step 1: Fork and Clone the Repository

1. **Fork** the repository on GitHub.
2. **Clone** the repository to your local machine:
   ```bash
   git clone <repository-url>
   ```
   Replace `<repository-url>` with the URL of your forked repository.

3. Navigate to the project directory:
   ```bash
   cd travelling-postman
   ```

---

### Step 2: Set Up the Environment File

1. Create a `.env` file in the root directory of the project:
   ```bash
   touch .env
   ```

2. Add the following environment variables to the `.env` file:

   ```env
   DB_NAME=
   JWT_SECRET=
   DATABASE_URL=

   NEXT_PUBLIC_MAPBOX_TOKEN=

   EMAIL_USER=
   EMAIL_PASS=
   ```

---

### Step 3: Install Dependencies

1. Install the required packages:
   ```bash
   npm install
   ```

---

## 🚀 Running the Project

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and visit:
   ```
   http://localhost:3000
   ```

---

## 📊 Technical Highlights

- **Backend**: Powered by **Python** and **PostgreSQL**, ensuring reliable and scalable data handling.
- **Frontend**: Built with **Next.js** and **React.js**, providing a dynamic user experience.
- **Algorithm**: A* algorithm for optimal routing, significantly reducing computation time compared to Dijkstra’s approach.
- **API Integration**: Utilizes **Mapbox API** for geolocation and mapping functionalities.
- **Machine Learning**: Real-time safety assessments using weather, news, and social media data.

---

## 📤 Contributing and Pushing Changes

1. After making changes to the code, stage them:
   ```bash
   git add .
   ```

2. Commit the changes:
   ```bash
   git commit -m "Your commit message here"
   ```

3. Push the changes to your GitHub repository:
   ```bash
   git push origin main
   ```

---

## 🌟 Impact

This project showcases how technology can streamline traditional services like postal delivery. By incorporating advanced algorithms, real-time data analysis, and multi-modal transportation, it significantly enhances delivery efficiency, safety, and user satisfaction.

---

