# Local Setup Instructions

Follow the steps below to prepare the project and run Playwright tests locally.

### Open terminal

### Install project dependencies

   `npm install`

   `npm init playwright@latest`

### Set environment variables:

   `$env:EMAIL="your.email@email.com"`

   `$env:PASSWORD="yourpassword"`

   `$env:URL="yourapiurl"`

   `$env:APIURL="yoururl"`


### Run smoke tests for chromium web

   `npx playwright test --max-failures=0 --project="chromium" --retries=2 --grep "@Smoke"`

### Run smoke tests for chromium mobile

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --retries=2 --grep "@Smoke"`

### Run regression tests for chromium web on BETA

   Na becie muszą się znajdować dwa kody rabatowe. Procentowy i kwotowy na 10% i 10zł. Z nazwami (pole Kod rabatowy) kolejno KP10 i KK10.

   `npx playwright test --max-failures=0 --project="chromium" --retries=2 --grep "@Beta"`

### Run regression tests for chromium mobile on BETA

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --retries=2 --grep "@Beta"`

### Run regression tests for chromium web on PROD

   `npx playwright test --max-failures=0 --project="chromium" --retries=2 --grep "@Prod"`

### Run regression tests for chromium mobile on PROD

   `npx playwright test --max-failures=0 --project="Mobile Chrome" --retries=2 --grep "@Prod"`
