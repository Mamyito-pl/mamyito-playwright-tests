# Local Setup Instructions

Follow the steps below to prepare the project and run Playwright tests locally.

### Open terminal

### Install project dependencies

   `npm install`

   `npx playwright install`

### Set environment variables:

   `$env:EMAIL="your.email@email.com"`

   `$env:PASSWORD="yourpassword"`

   `$env:URL="yourapiurl"`
   
   `$env:APIURL="yoururl"`

### Run smoke tests for chromium web

   `npx playwright test --max-failures=0 --project="chromium" --grep "@Smoke"`

### Run smoke tests for chromium mobile

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --grep "@Smoke"`

### Run regression tests for chromium web on BETA

   `npx playwright test --max-failures=0 --project="chromium" --retries=2 --grep "@Beta"`

### Run regression tests for chromium mobile on BETA

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --retries=2 --grep "@Beta"`

### Run regression tests for chromium web on PROD

   `npx playwright test --max-failures=0 --project="chromium" --retries=2 --grep "@Prod"`

### Run regression tests for chromium mobile on PROD

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --retries=2 --grep "@Prod"`