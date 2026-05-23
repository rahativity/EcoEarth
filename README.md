<div align="center">

# 🌍 EcoEarth

### Environmental Pollution Analysis Dashboard

A full-stack web application for monitoring and analyzing air, water, soil, and sound pollution data across 30+ cities worldwide.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.5-6DB33F?style=for-the-badge&logo=spring-boot)](https://spring.io/projects/spring-boot)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk)](https://www.java.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite)](https://www.sqlite.org/)

</div>

---

## 📖 About

**EcoEarth** is an environmental intelligence dashboard that provides real-time insights into pollution levels across cities around the world. It aggregates and visualizes data across four critical environmental dimensions:

- 💨 **Air Quality** — AQI levels, particulate matter, and air health ratings
- 💧 **Water Health** — Contamination percentages and water safety indicators
- 🌱 **Soil Vitality** — Soil degradation scores and land health metrics
- 🔊 **Sound Pollution** — Urban noise levels measured in decibels (dB)
- 📊 **City Comparison** — Side-by-side comparison of pollution data across cities

The dashboard surfaces critical zones (most polluted cities) and safe havens (cleanest cities) with animated, real-time counting stats — giving users an immediate sense of global environmental health.

---

## ✨ Features

- 🌐 **Global Pollution Overview** — Tracks 30+ cities with live summary statistics
- 📈 **Interactive Charts** — Visualizations powered by Recharts
- 🎨 **Animated UI** — Smooth page transitions and micro-animations via Framer Motion
- 🌙 **Dark / Light Mode** — Full theme support
- 🌏 **Bilingual Support** — English & Bengali (বাংলা) language toggle
- 📱 **Fully Responsive** — Works across desktop, tablet, and mobile
- ⚡ **Fast REST API** — Spring Boot backend with SQLite persistence

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe JavaScript |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion](https://www.framer-motion.com/) | Animations & transitions |
| [Recharts](https://recharts.org/) | Data visualization charts |
| [Lucide React](https://lucide.dev/) | Icon library |
| [Axios](https://axios-http.com/) | HTTP client for API calls |

### Backend
| Technology | Purpose |
|---|---|
| [Spring Boot 3.2.5](https://spring.io/projects/spring-boot) | Java REST API framework |
| [Java 17](https://www.java.com/) | Core backend language |
| [Spring Data JPA](https://spring.io/projects/spring-data-jpa) | Database ORM |
| [SQLite](https://www.sqlite.org/) | Lightweight embedded database |
| [Hibernate](https://hibernate.org/) | ORM with SQLite dialect |
| [Lombok](https://projectlombok.org/) | Boilerplate code reduction |
| [Maven](https://maven.apache.org/) | Build and dependency management |

---

## 📁 Project Structure

```
EcoEarth/
├── frontend/                  # Next.js application
│   ├── src/
│   │   ├── app/               # App Router pages
│   │   │   ├── page.tsx       # Dashboard (home)
│   │   │   ├── air/           # Air quality module
│   │   │   ├── water/         # Water health module
│   │   │   ├── soil/          # Soil vitality module
│   │   │   ├── sound/         # Sound pollution module
│   │   │   └── comparison/    # City comparison module
│   │   ├── components/        # Reusable UI components
│   │   ├── lib/               # API client & custom hooks
│   │   └── messages/          # i18n translations (en, bn)
│   └── package.json
│
├── backend/                   # Spring Boot application
│   ├── src/main/java/com/pollution/analyzer/
│   │   ├── controller/        # REST API endpoints
│   │   ├── service/           # Business logic
│   │   ├── model/             # JPA entities
│   │   ├── repository/        # Data access layer
│   │   ├── dto/               # Data Transfer Objects
│   │   ├── config/            # CORS & data seeder config
│   │   └── exception/         # Global exception handling
│   ├── pollution.db           # SQLite database
│   └── pom.xml
│
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or later)
- [Java 17](https://adoptium.net/) (JDK)
- [Maven](https://maven.apache.org/download.cgi) (or use the included `mvnw` wrapper)
- [Git](https://git-scm.com/)

---

### 1. Clone the Repository

```bash
git clone https://github.com/rahativity/EcoEarth.git
cd EcoEarth
```

---

### 2. Run the Backend

```bash
# Navigate to the backend directory
cd backend

# Run using the Maven wrapper (no Maven installation required)
./mvnw spring-boot:run

# On Windows, use:
mvnw.cmd spring-boot:run
```

The backend API will start on **http://localhost:8080**

> The SQLite database (`pollution.db`) is included and pre-seeded with city data, so no additional database setup is needed.

---

### 3. Run the Frontend

Open a **new terminal** and run:

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at **http://localhost:3000**

---

### 4. Configure the API URL (if needed)

The frontend connects to the backend at `http://localhost:8080` by default. If you change the backend port, update the API base URL in:

```
frontend/.env.local
```

---

## 🌐 API Endpoints

The backend exposes the following REST endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/pollution/summary` | Global dashboard summary |
| `GET` | `/api/pollution/air` | Air quality data for all cities |
| `GET` | `/api/pollution/water` | Water contamination data |
| `GET` | `/api/pollution/soil` | Soil degradation data |
| `GET` | `/api/pollution/sound` | Sound/noise pollution data |
| `GET` | `/api/cities` | List of all tracked cities |
| `GET` | `/api/pollution/comparison` | Cross-city comparison data |

---

## 📸 Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/` | Global stats, rankings & module overview |
| Air Quality | `/air` | AQI levels & air health by city |
| Water Health | `/water` | Water contamination rates by city |
| Soil Vitality | `/soil` | Soil degradation scores by city |
| Sound Pollution | `/sound` | Urban noise levels by city |
| Comparison | `/comparison` | Side-by-side city comparison |

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with 💚 for a cleaner planet
</div>
