![Uploading Screenshot 2026-10-15 131407.png…]()
<img width="590" height="296" alt="Screenshot 2026-10-15 131340" src="https://github.com/user-attachments/assets/50c61bc4-2c35-4c4d-8f35-422f2442b4ab" />
# 📈 PSX Insight

**A Full-Stack Pakistan Stock Exchange Research & Portfolio Management Platform**

PSX Insight is a web-based platform designed to help investors explore the Pakistan Stock Exchange (PSX), monitor market movements, manage stock portfolios, analyze company fundamentals, and explore AI-powered financial insights—all in one place.

The project combines an interactive React dashboard with a Node.js backend to provide a centralized experience for stock research and portfolio management.

## ✨ Features

### 📊 Portfolio Management
- Add, edit, and delete stock holdings.
- Track stock quantities, average purchase costs, purchase dates, and notes.
- Monitor portfolio value and unrealized profit or loss.
- View portfolio performance and sector allocation.

### 🔍 Stock Screener
- Search companies by symbol, company name, or sector.
- Filter and sort stocks using available market metrics.
- Explore company valuations, including P/E ratios and stock prices.

### 🏢 Company Profiles
- Explore individual company information and financial fundamentals.
- View market capitalization, EPS, dividend yield, and 52-week price ranges.
- Analyze stock price movements using interactive candlestick charts.
- Switch between supported chart timeframes.

### 📈 Market Overview
- Monitor major market indices, including KSE-100 and KSE-30.
- Explore market summaries, gainers, and losers.
- View available mutual fund and market-tracking information.

### 🤖 AI-Powered Stock Analysis
- Generate AI-assisted company summaries.
- Explore projected price scenarios.
- Review potential risks using available company fundamentals.
- Run analysis with a local open-weight model through Ollama, or configure OpenAI or Anthropic.

*AI-generated analysis is informational and should not be treated as guaranteed predictions or personalized financial advice.*

### 💰 Dividend Tracking
- Review dividend records.
- Track dividend-related information for portfolio holdings.
- Estimate projected dividend income using available data.

### 🔐 Authentication
- User registration and login.
- Token-based authentication.
- Protected dashboard and portfolio access.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Frontend UI |
| Vite | Development server and build tooling |
| React Router | Client-side navigation |
| Recharts | Data visualization |
| Lightweight Charts | Interactive financial charts |
| Node.js | Backend runtime |
| Express.js | REST API |
| Prisma | Database ORM |
| PostgreSQL | Relational database |
| JWT | Authentication |
| Ollama (local open-weight model) / OpenAI / Anthropic | AI-powered analysis, depending on configuration |

## 🏗️ Architecture

PSX Insight follows a client-server architecture.

- **Frontend:** React application for the dashboard, stock screener, portfolio, and company profiles.
- **Backend:** Express API for authentication, company data, portfolio operations, dividends, and analysis.
- **Database:** PostgreSQL accessed through Prisma.
- **AI integration:** Configurable Ollama, OpenAI, or Anthropic provider for supported stock-analysis features. Ollama can run a model locally without sending prompts to a hosted AI API.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js (a version compatible with the project's dependencies)
- npm
- PostgreSQL
- Git

For local AI analysis, install [Ollama](https://ollama.com/) and download a compatible model, for example `qwen2.5:7b`. OpenAI or Anthropic credentials are only needed if you choose one of those hosted providers.

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/psx-insight.git
cd psx-insight
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

Open another terminal, navigate to the repository root, and run:

```bash
cd server
npm install
```

### 4. Configure environment variables

Create the environment files required by the frontend and backend.

For example, your backend configuration may include:

```env
PORT=5000
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/psx_insight"
JWT_SECRET="replace-with-a-secure-secret"
```

Add any additional AI-provider and market-data API keys required by your implementation.

To use the local Ollama provider, start Ollama, pull a model, then set these backend variables:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=qwen2.5:7b
```

Download the example model with `ollama pull qwen2.5:7b`. To use a hosted provider instead, set `AI_PROVIDER=openai` with `OPENAI_API_KEY`, or `AI_PROVIDER=anthropic` with `ANTHROPIC_API_KEY`. If `AI_PROVIDER` is omitted, the server selects OpenAI when its key is configured, otherwise Anthropic when its key is configured.

If the frontend uses a configured backend URL, set its corresponding Vite environment variable, following the name expected by your source code.

**Important:** These are example settings, not a guarantee of the exact variable names required by your current implementation. Check the server code, Prisma schema, and existing environment configuration before running the application.

Never commit real passwords, API keys, database credentials, or JWT secrets to GitHub.

### 5. Set up the database

From the backend directory, run the appropriate Prisma commands based on the project's schema and migration files.

For a project with existing migrations:

```bash
npx prisma generate
npx prisma migrate deploy
```

For a local development database where migrations have not yet been created, follow the project's existing Prisma setup rather than running production migration commands blindly.

### 6. Start the application

Start the backend using the script defined in `server/package.json`. For example:

```bash
npm run dev
```

Start the frontend in a separate terminal:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite in your terminal.

*The exact scripts, ports, environment variable names, and database setup depend on your repository configuration.*

## 📁 Project Structure

The application is organized into separate frontend and backend directories.

```text
psx-insight/
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── App.jsx
│   ├── package.json
│   └── README.md
├── server/
│   ├── src/
│   │   ├── routes/
│   │   └── index.js
│   └── package.json
└── README.md
```

This is a simplified representation. The actual repository may contain additional directories, components, configuration files, and Prisma resources.

## 🔒 Security Notes

- Keep API keys and secrets in environment variables.
- Never commit `.env` files containing credentials.
- Configure `.gitignore` to exclude local secrets, dependencies, and generated files.
- Use a strong JWT secret in production.
- Validate and authorize protected API requests on the server.
- Review third-party market-data sources and AI-provider usage policies before deployment.

## ⚠️ Disclaimer

PSX Insight is a software development and financial research project. Its information and AI-generated analysis are provided for educational and informational purposes only.

Stock prices, projections, market data, and dividend estimates may be delayed, incomplete, or inaccurate depending on the underlying data sources. This project does not guarantee investment returns and should not be considered financial advice.

Always verify financial information using reliable sources and conduct independent research before making investment decisions.

## 👨‍💻 Author

**Muhammad Zubair**

- GitHub: [@zubairdev01](https://github.com/zubairdev01)
- LinkedIn: [zubairdev01](https://linkedin.com/in/zubairdev01)

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to make the project available for reuse or contributions under specific terms.

The project can use open-weight models locally through Ollama; this is an optional AI provider, not a claim that every model or dependency has the same license. Check the license and terms for the specific model and third-party services you use. The project repository itself currently has no license specified.

---

*Built to explore the intersection of web development, financial data, and AI-assisted stock research.*
