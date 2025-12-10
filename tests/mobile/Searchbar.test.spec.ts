import { expect } from '@playwright/test';
import SearchbarPage from '../../page/Searchbar.page.ts';
import ProductsListPage from '../../page/ProductsList.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe.configure({ mode: 'serial' });

test.describe('Testy wyszukiwarki', async () => {

  let searchbarPage: SearchbarPage;
  let productsListPage: ProductsListPage;
  let notExistingProduct = 'nieistniejacyprodukt';
  let productToSearch = 'manGO';

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithoutParameter(page, '/');

    await page.waitForTimeout(4000);

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    searchbarPage = new SearchbarPage(page);
    productsListPage = new ProductsListPage(page);
  })

  test('M | Możliwość zamknięcia wyszukiwarki przyciskiem "Zamknij"', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1507');

    await searchbarPage.getSearchbarInput.click();
    await page.keyboard.type(notExistingProduct);
    await expect(searchbarPage.getSearchbarCloseButton).toBeVisible({ timeout: 10000 });
    await searchbarPage.getSearchbarCloseButton.click();
    await expect(searchbarPage.getSearchbarCloseButton).not.toBeVisible({ timeout: 10000 });
  })
  
  test('M | Wyszukanie nieistniejącego produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1508');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type(notExistingProduct);
    await expect(page.getByText(`Brak wyników wyszukiwania dla '${notExistingProduct}'`)).toBeVisible();
  })

  test('M | Produkt wpisany dużymi literami powinien się prawidłowo wyszukać', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1509');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(2, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
  
  test('M | Produkt wpisany małymi literami powinien się prawidłowo wyszukać', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1510');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(2, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
    
  test('M | Produkt wpisany małymi i dużymi literami powinien się prawidłowo wyszukać', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1511');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(2, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain(productToSearch.toLocaleLowerCase());
    }
  })
  
  test('M | Możliwość wyczyszczenia wyszukiwarki', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1512');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarInput).toHaveValue(productToSearch);
    await expect(searchbarPage.getSearchbarClearButton).toBeVisible();
    const firstSearchedProduct = await searchbarPage.getSearchbarProductTiles.first().locator('h3').textContent();
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });
    expect(firstSearchedProduct?.toLowerCase()).toContain(productToSearch.toLowerCase());

    await searchbarPage.getSearchbarClearButton.click();
    await expect(searchbarPage.getSearchbarInput).not.toHaveValue(productToSearch);
    await expect(searchbarPage.getSearchbarClearButton).not.toBeVisible();
    await expect(searchbarPage.getSearchbarProductTiles.first()).not.toBeVisible({ timeout: 10000 })
  })
  
  test('M | Produkt wyszukiwany ze spacjami na początku prawidłowo się wyszukuje', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1513');

    const productToSearch = '   mango';

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(productToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(2, resultsCount); i++) {
      const productName = await searchResults.nth(i).locator('h3').textContent();
      expect(productName?.toLowerCase()).toContain('mango');
    }
  })
  
  test('M | Możliwość wyszukania produktów po nazwie marki', { tag: ['@Prod'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1514');

    const brandToSearch = 'zieleniak';

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(brandToSearch);
    await expect(searchbarPage.getSearchbarProductTiles.first()).toBeVisible({ timeout: 10000 });

    const searchResults = searchbarPage.getSearchbarProductTiles;
    const resultsCount = await searchResults.count();

    for (let i = 0; i < Math.min(2, resultsCount); i++) {
      const brandName = await searchResults.nth(i).locator('h4').textContent();
      expect(brandName?.toLowerCase()).toContain(brandToSearch);
    }
  })
    
  test.skip('M | Możliwość przewijania slidera nasze promocje', { tag: ['@Prod'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1515');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);

    await page.keyboard.type(notExistingProduct);

    await expect(searchbarPage.getOurDiscountsSection).toBeVisible({ timeout: 15000 });

    const firstItemInSlider = searchbarPage.getOurDiscountsSection.locator('div').locator('div').locator('div').locator('div').locator('div').first()

    await searchbarPage.getSliderLeftButton.isDisabled();
    await searchbarPage.getSliderRightButton.click();
    await expect(firstItemInSlider).not.toBeInViewport();
    await searchbarPage.getSliderLeftButton.isEnabled();
    await searchbarPage.getSliderLeftButton.click();
    await expect(firstItemInSlider).toBeInViewport();
    await searchbarPage.getSliderLeftButton.isDisabled();
  })

  test('M | Możliwość przejścia do naszych promocji poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL}) => {

    await allure.tags('Mobilne', 'Wyszukiwarka');
    await allure.epic('Mobilne');
    await allure.parentSuite('Wyszukiwarka');
    await allure.suite('Testy wyszukiwarki');
    await allure.subSuite('');
    await allure.allureId('1516');

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await page.keyboard.type(notExistingProduct);
    await expect(searchbarPage.getOurDiscountsSection).toBeVisible({ timeout: 15000 });
    await searchbarPage.getSectionShowAllLink.click();
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Promocje')).toBeVisible({ timeout: 15000 });
  })
})

