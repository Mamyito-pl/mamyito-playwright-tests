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

  test('M | Lista produktów otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1626');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Mleko i napoje mleczne', { timeout: 20000 });
    await expect(productsListPage.getProductCategoryTitle('Mleko i napoje mleczne')).toBeVisible();
    await expect(productsListPage.getFiltersButton).toBeVisible();
    await expect(productsListPage.getSortButton).toBeVisible();
  })

  test('M | Możliwość przejścia do innej kategorii poprzez breadcrumb', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1627');

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(2000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await productsListPage.getBreadcrumbs.getByText('Nabiał').click({ force: true, delay: 300 });
    await expect(page).toHaveURL('/nabial', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Nabiał')).toBeVisible({ timeout: 15000 });
    await expect(productsListPage.getBreadcrumbs).toBeVisible();
    await expect(productsListPage.getBreadcrumbs).toContainText('Nabiał');
  })

  test('M | Po zescrollowaniu w dół następne produkty są załadowywane', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1628');

    await utility.gotoWithoutParameter(page, '/nabial');

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

    const productsBeforeScroll = await productsListPage.getProductTiles.count();
    expect(productsBeforeScroll).toEqual(60);

    await page.getByText('Opis kategorii').waitFor();
    await page.getByText('Opis kategorii').scrollIntoViewIfNeeded();
    await page.waitForTimeout(10000);

    const productsCount = await productsListPage.getProductTiles.count();
    expect(productsCount).toBeGreaterThan(60);
  })
  
  test('M | Możliwość sortowania po najtańszych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1629');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPrices.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    expect(sortedPrices).toEqual(expectedSortedPrices);
  })
  
  test('M | Możliwość sortowania po najdroższych produktach', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1630');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

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

  test('M | Możliwość sortowania po najtańszych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1631');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

    await expect(productsListPage.getSortButton).toBeVisible();
    await productsListPage.getSortButton.click();
    await productsListPage.getSortSelect('Najtańsze za kg/litr');

    await expect(commonPage.getLoader.first()).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getLoader.first()).not.toBeVisible({ timeout: 55000 });

    const allSortedPrices = await productsListPage.getProductPricesPerGrammar.allTextContents();

    const sortedPrices = allSortedPrices.map(price => parseFloat(price.replace(/[^0-9,.-]/g, '').replace(',', '.')))

    const expectedSortedPrices = [...sortedPrices].sort((a, b) => a - b);

    const pricesCount = sortedPrices.length;

    expect(sortedPrices).toEqual(expectedSortedPrices);

    expect(pricesCount).toBeGreaterThan(1);
  })

  test.skip('M | Możliwość sortowania po najdroższych produktach za kg/l', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1632');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

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

  test('M | Możliwość sortowania od A do Z', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1633');

    test.setTimeout(80000);

    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

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
  
  test('M | Możliwość sortowania od Z do A', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1634');

    test.setTimeout(80000);
    
    await utility.gotoWithoutParameter(page, '/nabial/mleko-i-napoje-mleczne');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

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
  
  test('M | Możliwość filtrowania po typie produktu', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('1635');

    test.setTimeout(120000);
    
    await utility.gotoWithoutParameter(page, '/nabial');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

    await productsListPage.getFiltersButton.click();
    await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);
    await productsListPage.getFilterSelectCheckbox('Typ produktu','High protein');
    await utility.tryClickApplyButton(page, productsListPage);
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

  test('M | Po wybraniu filtrów pojawia się counter z prawidłową liczbą włączonych filtrów', { tag: ['@Prod', '@Beta'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Lista produktów');
    await allure.epic('Mobilne');
    await allure.parentSuite('Lista produktów');
    await allure.suite('Testy listy produktów');
    await allure.subSuite('');
    await allure.allureId('3362');

    test.setTimeout(120000);
    
    await utility.gotoWithoutParameter(page, '/nabial');

    await page.waitForTimeout(1000);

    await expect(productsListPage.getBreadcrumbs).toBeVisible();

    await productsListPage.getFiltersButton.click();
    await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);
    await productsListPage.getFilterSelectCheckbox('Typ produktu','Bez cukru');
    await utility.tryClickApplyButton(page, productsListPage);
    await page.waitForTimeout(7000);

    await productsListPage.getFiltersButton.click();
    await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
    await productsListPage.getFilterSelectExact('Cena','poniżej 10zł');
    await utility.tryClickApplyButton(page, productsListPage);
    await page.waitForTimeout(7000);
    
    await productsListPage.getFiltersButton.click();
    await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
    await productsListPage.getFilterSelect('Producent','MLEKOVITA');
    await utility.tryClickApplyButton(page, productsListPage);
    await page.waitForTimeout(7000);

    await expect(productsListPage.getFiltersCounter).toBeVisible();
    await expect(productsListPage.getFiltersCounter).toHaveText('3');
  })
  
  test.describe('Filtrowanie po cenie', { tag: ['@Prod', '@Beta'] }, async () => {
    test('M | Możliwość filtrowania po cenie poniżej 10 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1636');

      test.setTimeout(120000);

      await utility.gotoWithoutParameter(page, '/nabial');

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelectExact('Cena','poniżej 10zł');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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

    test('M | Możliwość filtrowania po cenie od 10 zł do 20 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1637');

      test.setTimeout(120000);

      await utility.gotoWithoutParameter(page, '/nabial');

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelectExact('Cena','od 10zł do 20zł');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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

    test('M | Możliwość filtrowania po cenie od 20 zł 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1638');

      test.setTimeout(120000);

      await utility.gotoWithoutParameter(page, '/nabial');

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelectExact('Cena','od 20zł do 50zł');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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
    
    test('M | Możliwość filtrowania po cenie powyżej 50 zł', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1639');

      test.setTimeout(120000);

      await utility.gotoWithoutParameter(page, '/nabial');  

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelectExact('Cena','powyżej 50zł');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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

    test('M | Możliwość filtrowania po cenie niestandardowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1640');

      test.setTimeout(120000);

      await utility.gotoWithoutParameter(page, '/nabial');  

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterCustomPriceFromSet('Cena', '2');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);
      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterCustomPriceToSet('Cena', '4');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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
        
    test('M | Możliwość filtrowania po nazwie producenta', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1641');  

      test.setTimeout(130000);

      await utility.gotoWithoutParameter(page, '/nabial');  

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelect('Producent','MLEKOVITA');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);
      
      const allProductBrands = await productsListPage.getProductBrand.allTextContents();
  
      for (const productBrandName of allProductBrands) {
        expect(productBrandName).toContain('MLEKOVITA');
      }
  
      const productsCount = allProductBrands.length;
  
      expect(productsCount).toBeGreaterThanOrEqual(1);
    })

    test('M | Możliwość wyczyszczenia filtrowania', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Lista produktów');
      await allure.epic('Mobilne');
      await allure.parentSuite('Lista produktów');
      await allure.suite('Testy listy produktów');
      await allure.subSuite('');
      await allure.allureId('1642');  

      test.setTimeout(200000);

      await utility.gotoWithoutParameter(page, '/bio-wege-i-bezglutenowe/bio'); 

      await page.waitForTimeout(4000);

      await expect(productsListPage.getBreadcrumbs).toBeVisible();

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterCustomPriceToSet('Cena', '9');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);
      
      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelectExact('Typ produktu','Bio');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await productsListPage.getFilterSelect('Producent','ALCE NERO');
      await utility.tryClickApplyButton(page, productsListPage);
      await page.waitForTimeout(7000);

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

      await productsListPage.getFiltersButton.click();
      await expect(productsListPage.getSettingsDrawer).toBeVisible({ timeout: 10000 });
      await expect(productsListPage.getClearFiltersButton).toBeVisible();
      await productsListPage.getClearFiltersButton.click({ force: true });
      await page.waitForTimeout(7000);

      const allProductNamesAfterClearFilter = await productsListPage.getProductName.allTextContents();
 
      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();

      const productsCountAfterClearFilter = allProductNamesAfterClearFilter.length;

      expect(productsCountAfterClearFilter).toBeGreaterThanOrEqual(50);

      await expect(productsListPage.getClearFiltersButton).not.toBeVisible();
    })
  })
})
