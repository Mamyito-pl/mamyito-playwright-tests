import { expect } from '@playwright/test';
import { test } from '../../fixtures/fixtures.ts';
import ProductsListPage from '../../page/ProductsList.page';
import * as allure from "allure-js-commons";
import * as utility from '../../utils/utility-methods';
import CommonPage from '../../page/Common.page';

test.describe.configure({ mode: 'serial' });

test.describe('Testy listy produktów', async () => {

  test.setTimeout(80000);

  let productsListPage: ProductsListPage;
  let commonPage: CommonPage;

  test.beforeEach(async ({ page }) => {

    productsListPage = new ProductsListPage(page);
    commonPage = new CommonPage(page);

    await utility.gotoWithoutParameter(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test('W | Lista produktów otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1643');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('load');

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Mleko i napoje mleczne', { timeout: 20000 });
    await expect(productsListPage.getBigBanner).toBeVisible();
    await expect(productsListPage.getCategoryTags).toBeVisible();
    await expect(productsListPage.getProductCategoryTitle('Mleko i napoje mleczne')).toBeVisible();
    await expect(productsListPage.getHorizontalMenu).toBeVisible();
    await expect(productsListPage.getVerticalMenuButton).toBeVisible();
    await expect(productsListPage.getHorizontalMenuButton).toBeVisible();
    await expect(productsListPage.getProductTypeFilter).toBeVisible();
    await expect(productsListPage.getPriceFilter).toBeVisible();
    await expect(productsListPage.getManufacturerFilter).toBeVisible();
    await expect(productsListPage.getAvailableInDeliveryFilter).toBeVisible();
    await expect(productsListPage.getSortButton).toBeVisible();
  })

  test('W | Możliwość przejścia do innej kategorii poprzez breadcrumb', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1644');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await productsListPage.getBreadcrumbs.getByText('Nabiał').click();
    await expect(page).toHaveURL('/nabial', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Nabiał')).toBeVisible({ timeout: 15000 });
    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Nabiał');
  })

  test('W | Możliwość przejścia do innej kategorii poprzez category tag', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('3657');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    const categoryTag = productsListPage.getCategoryTag.first().getByText('Strefa Niskich Cen');
    
    await expect(categoryTag).toBeVisible({ timeout: 20000 });

    await expect(productsListPage.getCategoryTag.first()).not.toHaveCSS('background-color', 'rgb(254, 244, 235)');

    await categoryTag.click();
    await expect(page).toHaveURL('/strefa-mamity', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Strefa Niskich Cen')).toBeVisible({ timeout: 15000 });
    await expect(productsListPage.getCategoryTag.first()).toHaveCSS('background-color', 'rgb(254, 244, 235)');
  })

  test('W | Zmiana widoku menu na pionowy i poziomy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1660');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('networkidle');

    await page.waitForTimeout(3000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });

    await expect(productsListPage.getHorizontalMenu).toBeVisible();
    await expect(productsListPage.getVerticalMenu).not.toBeVisible();

    await expect(productsListPage.getVerticalMenuButton).toBeVisible();
    await expect(productsListPage.getHorizontalMenuButton).toBeVisible();

    await productsListPage.getVerticalMenuButton.click({ force: true, delay: 300 });
    await expect(productsListPage.getVerticalMenu).toBeVisible();
    await expect(productsListPage.getHorizontalMenu).not.toBeVisible();

    await productsListPage.getHorizontalMenuButton.click({ force: true, delay: 300 });
    await expect(productsListPage.getHorizontalMenu).toBeVisible();
    await expect(productsListPage.getVerticalMenu).not.toBeVisible();
  })

  test('W | Po zescrollowaniu w dół następne produkty są załadowywane', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1645');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('load');

    await expect(productsListPage.getHorizontalMenu).toBeVisible({ timeout: 15000 });

    const productsBeforeScroll = await productsListPage.getProductTiles.count();
    expect(productsBeforeScroll).toEqual(60);

    await page.mouse.wheel(0, 2000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(700);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(1000);

    await page.waitForTimeout(10000);

    const productsCount = await productsListPage.getProductTiles.count();
    expect(productsCount).toBeGreaterThan(60);
  })
  
  test('W | Możliwość sortowania po najtańszych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1646');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })
  
  test('W | Możliwość sortowania po najdroższych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1647');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najdroższe');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })  

  test('W | Możliwość sortowania po najtańszych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1648');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze za kg/litr');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPricesPerGrammar.allTextContents();
    console.log('raw prices', allSortedPrices)

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))
    console.log('cleaned raw prices', sortedPrices)

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);
    console.log('cleaned sorted prices', expectedSortedPrices)

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test.skip('W | Możliwość sortowania po najdroższych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1649');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najdroższe za kg/litr');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => b - a);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  
  test('W | Możliwość sortowania od A do Z', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1650');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('od A do Z');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });
    
    const allProductNames = await productsListPage.getProductName.allTextContents();
    
    const cleanedProductNames = allProductNames.map(name =>
        name.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim()
    );

    const isSingleLetter = (word: any) => /^[a-zA-Z]$/.test(word);

    const findWordsStartingWith = (str: any, letter: any) => 
        str.split(' ').filter((word: any) => 
            word.toLowerCase().startsWith(letter.toLowerCase()) && 
            word.length > 1
        );

    const extractNumber = (word: any) => {
        const match = word.match(/(\d+(?:,\d+)?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    };

    const compareNumbers = (wordA: any, wordB: any) => {
        const numA = extractNumber(wordA);
        const numB = extractNumber(wordB);
        
        if (numA === null || numB === null) return null;
        if (Math.abs(numA - numB) < 0.0001) return wordA.length - wordB.length;
        return numA - numB;
    };

    const normalizePolishCharacters = (str: any) => {
        const polishAccentMap = {
            'a': ['a', 'ą', 'Ą'],
            'c': ['c', 'ć', 'Ć'],
            'e': ['e', 'ę', 'Ę'],
            'l': ['l', 'ł', 'Ł'],
            'n': ['n', 'ń', 'Ń'],
            'o': ['o', 'ó', 'Ó'],
            's': ['s', 'ś', 'Ś'],
            'z': ['z', 'ź', 'ż', 'Ż', 'Ź'],
        };
        return str.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (match: any) => {
            for (const key in polishAccentMap) {
                if (polishAccentMap[key].includes(match)) return key;
            }
            return match;
        }).toLowerCase();
    };

    const compareStrings = (a: any, b: any) => {
        const normalizedA = normalizePolishCharacters(a);
        const normalizedB = normalizePolishCharacters(b);
        const wordsA = normalizedA.split(' ');
        const wordsB = normalizedB.split(' ');

        const minLength = Math.min(wordsA.length, wordsB.length);
        for (let i = 0; i < minLength; i++) {
            const wordA = wordsA[i];
            const wordB = wordsB[i];

            if (wordA !== wordB) {
                const numberComparison = compareNumbers(wordA, wordB);
                if (numberComparison !== null) {
                    if (numberComparison === 0) continue;
                    return numberComparison;
                }

                const aIsSingle = isSingleLetter(wordA);
                const bIsSingle = isSingleLetter(wordB);

                if (aIsSingle && !bIsSingle) {
                    if (findWordsStartingWith(b, wordA).length > 0) return 1;
                }
                if (!aIsSingle && bIsSingle) {
                    if (findWordsStartingWith(a, wordB).length > 0) return -1;
                }

                return wordA.localeCompare(wordB);
            }
        }

        return wordsA.length - wordsB.length;
    };

    const expectedSortedNames = [...cleanedProductNames].sort(compareStrings);

    const productsCount = cleanedProductNames.length;
    
    expect(cleanedProductNames).toEqual(expectedSortedNames);

    expect(productsCount).toBeGreaterThan(1);
  })

  test('W | Możliwość sortowania od Z do A', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1651');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });
    
    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('od Z do A');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });
    
    const allProductNames = await productsListPage.getProductName.allTextContents();
    
    const cleanedProductNames = allProductNames.map(name =>
        name.replace(/\s+/g, ' ').replace(/\s+%/, '%').trim()
    );

    const isSingleLetter = (word: any) => /^[a-zA-Z]$/.test(word);

    const findWordsStartingWith = (str: any, letter: any) => 
        str.split(' ').filter((word: any) => 
            word.toLowerCase().startsWith(letter.toLowerCase()) && 
            word.length > 1
        );

    const extractNumber = (word: any) => {
        const match = word.match(/(\d+(?:,\d+)?)/);
        return match ? parseFloat(match[1].replace(',', '.')) : null;
    };

    const compareNumbers = (wordA: any, wordB: any) => {
        const numA = extractNumber(wordA);
        const numB = extractNumber(wordB);
        
        if (numA === null || numB === null) return null;
        if (Math.abs(numA - numB) < 0.0001) return wordB.length - wordA.length;
        return numB - numA;
    };

    const normalizePolishCharacters = (str: any) => {
        const polishAccentMap = {
            'a': ['a', 'ą', 'Ą'],
            'c': ['c', 'ć', 'Ć'],
            'e': ['e', 'ę', 'Ę'],
            'l': ['l', 'ł', 'Ł'],
            'n': ['n', 'ń', 'Ń'],
            'o': ['o', 'ó', 'Ó'],
            's': ['s', 'ś', 'Ś'],
            'z': ['z', 'ź', 'ż', 'Ż', 'Ź'],
        };
        return str.replace(/[ąĄćĆęĘłŁńŃóÓśŚźŹżŻ]/g, (match: any) => {
            for (const key in polishAccentMap) {
                if (polishAccentMap[key].includes(match)) return key;
            }
            return match;
        }).toLowerCase();
    };

    const compareStrings = (a: any, b: any) => {
        const normalizedA = normalizePolishCharacters(a);
        const normalizedB = normalizePolishCharacters(b);
        const wordsA = normalizedA.split(' ');
        const wordsB = normalizedB.split(' ');

        const minLength = Math.min(wordsA.length, wordsB.length);
        for (let i = 0; i < minLength; i++) {
            const wordA = wordsA[i];
            const wordB = wordsB[i];

            if (wordA !== wordB) {
                const numberComparison = compareNumbers(wordA, wordB);
                if (numberComparison !== null) {
                    if (numberComparison === 0) continue;
                    return numberComparison;
                }

                const aIsSingle = isSingleLetter(wordA);
                const bIsSingle = isSingleLetter(wordB);

                if (aIsSingle && !bIsSingle) {
                    if (findWordsStartingWith(b, wordA).length > 0) return -1;
                }
                if (!aIsSingle && bIsSingle) {
                    if (findWordsStartingWith(a, wordB).length > 0) return 1;
                }

                return wordB.localeCompare(wordA);
            }
        }

        return wordsB.length - wordsA.length;
    };

    const expectedSortedNames = [...cleanedProductNames].sort(compareStrings);

    const productsCount = cleanedProductNames.length;
    
    expect(cleanedProductNames).toEqual(expectedSortedNames);

    expect(productsCount).toBeGreaterThan(1);
  })

  test('W | Możliwość filtrowania po typie produktu', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Web', 'Lista produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1652');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial');
    await page.waitForLoadState('domcontentloaded');

    await page.waitForTimeout(1000);

    const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
    await expect(breadcrumb).toBeVisible({ timeout: 20000 });
    
    expect((await productsListPage.getFilter('Typ produktu')).isVisible({ timeout: 10000 }));
    await page.waitForTimeout(1000);
    await productsListPage.getFilterSelectCheckbox('Typ produktu','High protein');
    await page.waitForTimeout(7000);
    
    const allProductCards = await page.$$('[data-sentry-component="ProductCard"]');

    for (const card of allProductCards) {
      const badges = await card.$$('img[alt="app-badges"]');
      
      if (badges.length >= 1) {
        let foundLaktozyBadge = false;
        for (const badge of badges) {
          const src = await badge.getAttribute('src');
          if (src && src.toLowerCase().includes('protein')) {
            foundLaktozyBadge = true;
            break;
          }
        }
        expect(foundLaktozyBadge).toBeTruthy();
      }
    }

    const productsCount = allProductCards.length;
    expect(productsCount).toBeGreaterThanOrEqual(1);
  })
    
  test.describe('Filtrowanie po cenie', { tag: ['@Prod', '@Beta'] }, async () => {
    test('W | Możliwość filtrowania po cenie poniżej 10 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1653');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await productsListPage.getFilterSelectExact('Cena','poniżej 10zł');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      for (const productPrice of allProductCleanedPrices) {
        expect(productPrice).toBeLessThanOrEqual(10)
      }

      const pricesCount = allProductCleanedPrices.length;

      expect(pricesCount).toBeGreaterThan(1);
    })       

    test('W | Możliwość filtrowania po cenie od 10 zł do 20 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1654');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await productsListPage.getFilterSelectExact('Cena','od 10zł do 20zł');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(10);
          expect(productPrice).toBeLessThanOrEqual(20);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })     

    test('W | Możliwość filtrowania po cenie od 20 zł 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1655');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await productsListPage.getFilterSelectExact('Cena','od 20zł do 50zł');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(20);
          expect(productPrice).toBeLessThanOrEqual(50);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })  
    
    test('W | Możliwość filtrowania po cenie powyżej 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1656');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await productsListPage.getFilterSelectExact('Cena','powyżej 50zł');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(50);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })

    test.skip('W | Możliwość filtrowania po cenie niestandardowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1657');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await productsListPage.getFilterCustomPriceFromSet('Cena', '2');
      await page.waitForTimeout(10000);
      await productsListPage.getFilterCustomPriceToSet('Cena', '4');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('ceny produktow raw', allProductPrices)

      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      console.log('ceny produktow po czyszczeniu', allProductCleanedPrices)

      const pricesCount = allProductCleanedPrices.length;

      if (allProductCleanedPrices.length > 0) {
        for (const productPrice of allProductCleanedPrices) {
          expect(productPrice).toBeGreaterThanOrEqual(2);
          expect(productPrice).toBeLessThanOrEqual(4);
          expect(pricesCount).toBeGreaterThanOrEqual(1);
        }
      } else {
          await expect(productsListPage.getNoProductsResult).toBeVisible();
      }
    })
    
    test('W | Możliwość filtrowania po nazwie producenta', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1658');

      test.setTimeout(80000);

      await utility.gotoWithoutParameter(page, '/nabial');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await page.waitForTimeout(2000);
      await productsListPage.getFilterSelect('Producent','MLEKOVITA');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });
      
      const allProductBrands = await productsListPage.getProductBrand.allTextContents();
  
      for (const productBrandName of allProductBrands) {
        expect(productBrandName).toContain('MLEKOVITA');
      }
  
      const productsCount = allProductBrands.length;
  
      expect(productsCount).toBeGreaterThanOrEqual(1);
    })
        
    test('W | Możliwość wyczyszczenia filtrowania', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Web', 'Lista produktów');
      await allure.epic('Webowe');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1659');

      test.setTimeout(150000);

      await utility.gotoWithoutParameter(page, '/bio-wege-i-bezglutenowe/bio');
      await page.waitForLoadState('load');

      await page.waitForTimeout(3000);

      const breadcrumb = page.locator('a[data-cy="category-tag"]').first().getByText('Strefa Niskich Cen');
      await expect(breadcrumb).toBeVisible({ timeout: 20000 });

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      await page.waitForTimeout(2000);

      await productsListPage.getFilterCustomPriceToSet('Cena', '9');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });
      
      await productsListPage.getFilterSelectExact('Typ produktu','Bio');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      await productsListPage.getFilterSelect('Producent','ALCE NERO');
      await page.waitForTimeout(10000);
      await commonPage.getLoader.first().waitFor({ state: 'hidden' });

      const allProductNames = await productsListPage.getProductName.allTextContents();
      const allProductPrices = await productsListPage.getProductPrices.allTextContents();
      console.log('all products prices raw', allProductPrices)
      const allProductCleanedPrices = allProductPrices.map(price => parseFloat(price.replace(/[^\d,.-]/g, '').replace(',', '.')));
      const allProductBrands = await productsListPage.getProductBrand.allTextContents();
  
      for (let i = 0; i < allProductNames.length; i++) {
        expect(allProductNames[i].toLocaleLowerCase()).toContain('bio');
        console.log('allProductNames[i]', allProductNames)
        expect(allProductCleanedPrices[i]).toBeGreaterThan(0);
        console.log('allProductCleanedPrices[i]', allProductCleanedPrices)
        expect(allProductCleanedPrices[i]).toBeLessThanOrEqual(9);
        console.log('allProductCleanedPrices[i]', allProductCleanedPrices[i])
        expect(allProductBrands[i]).toContain('ALCE NERO');
        console.log('allProductBrands[i]', allProductBrands)
      }
  
      const productsCount = allProductBrands.length;
  
      expect(productsCount).toBeGreaterThanOrEqual(1);
      expect(productsCount).toBeLessThan(10);

      await expect(productsListPage.getClearFiltersButton).toBeVisible();
      await productsListPage.getClearFiltersButton.click({ force: true });
      await page.waitForTimeout(10000);

      const allProductNamesAfterClearFilter = await productsListPage.getProductName.allTextContents();
 
      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      const productsCountAfterClearFilter = allProductNamesAfterClearFilter.length;

      expect(productsCountAfterClearFilter).toBeGreaterThanOrEqual(50);

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();
    })
  })
})