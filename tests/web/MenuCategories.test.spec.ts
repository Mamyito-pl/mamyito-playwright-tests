import { expect } from '@playwright/test';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import ProductsListPage from '../../page/ProductsList.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe('Testy menu kategorii', async () => {

  let menuCategoriesPage: MenuCategoriesPage;
  let productsListPage: ProductsListPage;

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load' });

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    menuCategoriesPage = new MenuCategoriesPage(page);
    productsListPage = new ProductsListPage(page);
  })

  test('W | Menu kategorii otwiera się z obecnymi kategoriami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1024');

    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await utility.clickCategoriesButtonUntilVisible(page);

    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await page.locator('[data-cy="category-menu-item-level-1"]').count();

    expect(categoriesCount).toBeGreaterThan(17);
  })

  test('W | Możliwość zamknięcia menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1025');

    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await utility.clickCategoriesButtonUntilVisible(page);

    await page.waitForTimeout(1000);
    
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await page.locator('[data-cy="category-menu-item-level-1"]').count();

    expect(categoriesCount).toBeGreaterThan(17);

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.waitForSelector('div[data-sentry-element="WebContent"] div[data-sentry-element="ListWrapper"]', { timeout: 5000, state: 'hidden' });

    await expect(menuCategoriesPage.getMenuCategories).not.toBeVisible();
  })

  test('W | Menu przykładowej kategorii otwiera się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1028');

    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await utility.clickCategoriesButtonUntilVisible(page);

    await page.waitForTimeout(1000);

    await menuCategoriesPage.getMenuCategoriesWrapper.getByText('Warzywa i owoce').hover();

    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryTitleWeb).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryTitleWeb).toHaveText('Warzywa i owoce');
  })

  test('W | Możliwość przejścia do kategorii produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1026');

    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await utility.clickCategoriesButtonUntilVisible(page);

    await page.waitForTimeout(1000);

    await menuCategoriesPage.getMenuCategoriesWrapper.getByText('Warzywa i owoce').click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce', { timeout: 10000 });
    await productsListPage.getProductCategoryTitle('Warzywa i owoce').isVisible();
  })

  test('W | Możliwość przejścia do podkategorii produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Menu kategorii');
    await allure.epic('Webowe');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1027');

    await page.waitForLoadState('load');

    await page.waitForTimeout(2000);

    await utility.clickCategoriesButtonUntilVisible(page);

    await page.waitForTimeout(1000);

    await menuCategoriesPage.getMenuCategoriesWrapper.getByText('Warzywa i owoce').hover();
    await menuCategoriesPage.getMenuCategoriesWrapper.getByText('Grzyby').click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce/grzyby', { timeout: 10000 });
    await productsListPage.getProductCategoryTitle('Grzyby').isVisible();
  })
})

