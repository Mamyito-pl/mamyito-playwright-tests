import { Frame, Page } from "@playwright/test";

export async function addGlobalStyles(page) {
  const cssRules = `
  div[data-sentry-element='PromptContainer'] { display: none !important; }
  #onetrust-consent-sdk { display: none !important; }
  #edrone--main--push--container { display: none !important; }
  #edrone--main--popup--container { display: none !important; }
  div[data-sentry-component="ExternalWidget"] { display: none !important; }
  #cookiescript_injected_wrapper { display: none !important; }
  div[class="snrs-modal-wrapper snrs-modal-show"] { display: none !important; }
  #mmy-top-banner { display: none !important; }
  `;

  try {
    await page.waitForSelector('body', { visible: true });
    await page.addStyleTag({ content: cssRules });
  } catch {
  }
};

export const isMobile = (viewportWidth: number): boolean => {
    return viewportWidth <= 400;
};

export async function retryUntil200(fn, maxRetries = 10, delay = 1000) {
  let lastResponse;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fn();
      if (response.status && response.status() === 200) {
        return response;
      }
      lastResponse = response;
    } catch (e) {
    }
    await new Promise(res => setTimeout(res, delay));
  }
  throw new Error(`Nie uzyskano statusu 200 po ${maxRetries} próbach`);
};

export async function tryClickApplyButton(page: any, productsListPage: any, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await productsListPage.clickApplyButton();
    await page.waitForTimeout(10000);
    await page.reload();
    
    const isDropdownVisible = await page.locator('.MuiPaper-root').isVisible();
    if (!isDropdownVisible) break;
    
    if (attempt === maxAttempts) {
      console.log(`Nie udało się zamknąć dropdownu po ${maxAttempts} próbach`);
    }
  }
};

export async function gotoWithRetry(page, url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!page || page.isClosed()) {
        throw new Error('Strona została zamknięta');
      }
      
      await page.goto(url, { 
        waitUntil: 'load'
      });
      return;
    } catch (error) {
      console.log(`Próba ${attempt}/${maxRetries} nieudana: ${error.message}`);
      
      if (attempt === maxRetries) {
        throw new Error(`Nie udało się załadować strony po ${maxRetries} próbach: ${error.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

export async function gotoWithoutParameter(page: Page, url: string) {
  const originalGoto = Object.getPrototypeOf(page).goto;
  await originalGoto.call(page, url);
}

export async function clickCategoriesButtonUntilVisible(page: Page, categoriesButtonSelector?: string, categoryMenuSelector: string = '[data-cy="category-menu-column-1"]', maxAttempts: number = 5) {
  const viewport = page.viewportSize();
  if (!viewport) throw new Error('Viewport is null');
  const mobile = isMobile(viewport.width);
  
  const buttonSelector = categoriesButtonSelector || (mobile ? 
    'div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledTabletContent"] svg[class*="tabler-icon tabler-icon-menu-2"]' : 
    'div[data-sentry-element="WebContent"] div[data-sentry-element="StyledWebContent"]');
    
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    await page.click(buttonSelector);
    
    try {
      await page.waitForSelector(categoryMenuSelector, { state: 'visible', timeout: 3000 });
      return;
    } catch (error) {
      console.log(`Próba ${attempt}/${maxAttempts}: Menu kategorii nie jest widoczne`);
      
      if (attempt === maxAttempts) {
        throw new Error(`Menu kategorii nie stało się widoczne po ${maxAttempts} próbach`);
      }
      
      await page.waitForTimeout(1000);
    }
  }
}

export async function addTestParam(page: Page, param = 'testy-automatyczne') {
  const currentUrl = page.url();
  if (!currentUrl.includes(param)) {
    const separator = currentUrl.includes('?') ? '&' : '?';
    const newUrl = `${currentUrl}${separator}${param}`;
    await page.goto(newUrl, { waitUntil: 'domcontentloaded' });
  }
}

export async function scrollIntoViewWithRetry(
  page: Page, 
  selector: string, 
  options: {
    retries?: number;
    timeout?: number;
    waitBetweenRetries?: number;
    logErrors?: boolean;
  } = {}
) {
  const {
    retries = 3,
    timeout = 5000,
    waitBetweenRetries = 1000,
    logErrors = true
  } = options;

  for (let i = 0; i < retries; i++) {
    try {
      const locator = page.getByText(selector);
      await locator.waitFor({ timeout });
      await locator.scrollIntoViewIfNeeded();
      return; // Sukces - wyjdź z funkcji
    } catch (error) {
      if (logErrors) {
        console.log(`Próba ${i + 1}/${retries} scrollowania do "${selector}" nie powiodła się:`, error.message);
      }
      
      if (i === retries - 1) {
        throw new Error(`Nie udało się przescrollować do elementu "${selector}" po ${retries} próbach. Ostatni błąd: ${error.message}`);
      }
      
      await page.waitForTimeout(waitBetweenRetries);
    }
  }
}