# Velocity Enterprise - NBN Business Portal

This is an enterprise-grade digital portal for Velocity Enterprise, a Business ISP. It allows customers to check NBN serviceability, view tailored business plans, and sign up online with integrated Stripe payments.

## Features

- **NBN Serviceability Check**: Real-time address validation using NBN Co data (via RapidAPI).
- **Dynamic Business Plans**: Managed via `plans.json`, matching Superloop's latest business offerings.
- **Multi-step Sign-up Flow**: Professional UI covering Location -> Plan -> Business Details -> Review.
- **Stripe Integration**: Secure subscription handling via Stripe Checkout.
- **Order Persistence**: SQLite database for tracking pending and completed orders.
- **Design System**: High-contrast, corporate aesthetic built with Tailwind CSS.

## Getting Started

### Prerequisites

- Node.js (v18+)
- Stripe Account (for API keys)
- RapidAPI Account (for NBN serviceability API)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd velocity-enterprise-portal
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure environment variables**:
    Create a `.env` file in the root directory:
    ```env
    PORT=3000
    STRIPE_SECRET_KEY=sk_test_...
    RAPIDAPI_KEY=your_rapidapi_key_here
    ```

4.  **Start the server**:
    ```bash
    npm start
    ```
    The portal will be available at `http://localhost:3000`.

## Project Structure

- `src/app.js`: Express application configuration.
- `src/server.js`: Entry point for the server.
- `src/routes/api.js`: API endpoints for plans, serviceability, and payments.
- `src/controllers/`: Logic for handling API requests.
- `src/services/`: External integrations (Stripe, NBN API, SQLite).
- `src/public/`: Static frontend assets (HTML, CSS, Client-side JS).
- `plans.json`: Source of truth for NBN plan details and pricing.
- `legacy_pages/`: Original design assets and templates.

## API Endpoints

- `GET /api/plans`: Returns all available NBN business plans.
- `POST /api/check-address`: Validates NBN serviceability for a given address.
- `POST /api/create-checkout-session`: Initiates a Stripe Checkout session for a chosen plan.

## Deployment

The application is ready for deployment on platforms like Heroku, DigitalOcean, or AWS. Ensure that the SQLite database file path is correctly handled in persistent environments or migrate to a managed database like PostgreSQL.

---
© 2024 Velocity Enterprise. High-performance fiber infrastructure.
