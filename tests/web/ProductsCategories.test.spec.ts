import { expect } from '@playwright/test';
import ProductsCategoriesPage from "../../page/ProductsCategories.page";
import ProductsListPage from "../../page/ProductsList.page.ts";
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe('Testy kategorii produktów', async () => {

  let productsCategoriesPage: ProductsCategoriesPage;
  let productsListPage: ProductsListPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/kategorie');

    await utility.addGlobalStyles(page);

    const warzywaOwoceLink = page.locator('a[href="/warzywa-i-owoce"]:nth-of-type(2)');
    await expect(warzywaOwoceLink).toBeVisible({ timeout: 20000 });

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    productsCategoriesPage = new ProductsCategoriesPage(page);
    productsListPage = new ProductsListPage(page);
  })

  test('W | Strona kategorii produktów wyświetla się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('823');

    await expect(productsCategoriesPage.getProductsCategoriesTitle).toBeVisible();
    const tilesCount = await productsCategoriesPage.getProductsCategoriesTiles.count();

    expect(tilesCount).toBeGreaterThan(16);
  })

  test('W | Możliwość przejścia do wybranej kategorii produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('824');

    await page.waitForTimeout(2000);

    const warzywaOwoceLink = page.locator('a[href="/warzywa-i-owoce"]').last();

    expect(warzywaOwoceLink).toContainText('Zobacz wszystkie');

    await warzywaOwoceLink.click({ force: true, delay: 300 });

    await expect(page).toHaveURL('/warzywa-i-owoce', { timeout: 10000 });

    await expect(productsListPage.getProductCategoryTitle('Warzywa i owoce')).toBeVisible({ timeout: 20000 });
  })

  test('W | Możliwość przejścia do wybranej podkategorii danej kategorii', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Kategorie produktów');
    await allure.epic('Webowe');
    await allure.parentSuite('Kategorie produktów');
    await allure.suite('Testy kategorii produktów');
    await allure.subSuite('');
    await allure.allureId('825');

    await page.waitForTimeout(2000);

    const warzywaOwoceSubCategoryLink = page.locator('a[href="/warzywa-i-owoce/owoce"] h3');

    expect(warzywaOwoceSubCategoryLink).toContainText('Owoce');

    await warzywaOwoceSubCategoryLink.click({ force: true, delay: 300 });

    await expect(page).toHaveURL('/warzywa-i-owoce/owoce', { timeout: 10000 });

    await expect(productsListPage.getProductCategoryTitle('Owoce')).toBeVisible({ timeout: 20000 });
  })
})

