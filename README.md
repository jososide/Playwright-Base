# Playwright E2E: Data-Driven + POM (TypeScript)

## Objective
A scalable, data-driven Playwright suite using Page Object Model (POM).  
All scenarios are driven from a single JSON file to minimize duplication and ease future growth.

- **Tech**: Playwright Test + TypeScript
- **Pattern**: POM + data-driven (JSON)
- **Stability strategy**: *card-first* → assert its *column* → assert *tags* (avoids brittle scoping)

---

## App & Credentials
- URL: https://animated-gingersnap-8cf7f2.netlify.app/
- Email: `admin`
- Password: `password123`

> For demo simplicity, credentials are in the test. In production, use env vars.

---

## Install & Run

```bash
npm ci            # or: npm i
npx playwright install
npm run test      # headless run
npm run test:headed
npm run debug     # launches PW inspector
npm run report    # open HTML report

