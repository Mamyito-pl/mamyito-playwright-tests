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

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    menuCategoriesPage = new MenuCategoriesPage(page);
    productsListPage = new ProductsListPage(page);

    await page.waitForTimeout(1000);
  })

  test('M | Menu kategorii otwiera się z obecnymi kategoriami', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1018');

    await menuCategoriesPage.clickMenuCategoriesButton();
    await expect(menuCategoriesPage.getMenuCategoriesTitle).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await menuCategoriesPage.getMenuCategories.count();

    expect(categoriesCount).toBeGreaterThanOrEqual(17);
  })

  test('M | Możliwość zamknięcia menu', { tag: ['@Prod', '@Beta', '@Test'] }, async () => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1019');

    await menuCategoriesPage.clickMenuCategoriesButton();
    await expect(menuCategoriesPage.getMenuCategoriesTitle).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).toBeVisible();

    const categoriesCount = await menuCategoriesPage.getMenuCategories.count();

    expect(categoriesCount).toBeGreaterThanOrEqual(17);

    await menuCategoriesPage.clickMenuCategoriesCloseIconButton();

    await expect(menuCategoriesPage.getMenuCategoriesTitle).not.toBeVisible();
    await expect(menuCategoriesPage.getMenuCategories.locator('..')).not.toBeVisible();

    const categoriesCountAfterClose = await menuCategoriesPage.getMenuCategories.count();

    expect(categoriesCountAfterClose).toEqual(0);
  })

  test('M | Menu przykładowej kategorii otwiera się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1020');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.locator('div[data-sentry-element="Column"]').getByText('Warzywa i owoce').click();

    await expect(menuCategoriesPage.getMenuCategoriesBackButton).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategoriesCloseIconButton).toBeVisible();
    await expect(await menuCategoriesPage.getMenuCategoriesSubCategoryTitleMobile('Warzywa i owoce')).toBeVisible();
    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryAllCategoryButton).toBeVisible();
  })

  test('M | Możliwość powrotu do głównego menu kategorii', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1021');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.locator('div[data-sentry-element="Column"]').getByText('Warzywa i owoce').click();

    await expect(menuCategoriesPage.getMenuCategoriesBackButton).toBeVisible();
    
    await menuCategoriesPage.getMenuCategoriesBackButton.click();

    await expect(menuCategoriesPage.getMenuCategoriesBackButton).not.toBeVisible();
    await expect(menuCategoriesPage.getMenuCategoriesTitle).toBeVisible();
  })

  test('M | Możliwość przejścia do kategorii produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1022');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.locator('div[data-sentry-element="Column"]').getByText('Warzywa i owoce').click();

    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryAllCategoryButton).toBeVisible();

    await menuCategoriesPage.getMenuCategoriesSubCategoryAllCategoryButton.click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce', { timeout: 10000 });
    await productsListPage.getProductCategoryTitle('Warzywa i owoce').isVisible();
  })

  test('M | Możliwość przejścia do podkategorii produktów', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Menu kategorii');
    await allure.epic('Mobilne');
    await allure.parentSuite('Menu kategorii');
    await allure.suite('Testy menu kategorii');
    await allure.subSuite('');
    await allure.allureId('1023');

    await menuCategoriesPage.clickMenuCategoriesButton();

    await page.locator('div[data-sentry-element="Column"]').getByText('Warzywa i owoce').click();
    await page.locator('div[data-sentry-element="Column"]').getByText('Grzyby').click();

    await expect(menuCategoriesPage.getMenuCategoriesSubCategoryAllCategoryButton).toBeVisible();

    await menuCategoriesPage.getMenuCategoriesSubCategoryAllCategoryButton.click();

    await expect(page).toHaveURL(`${baseURL}` + '/warzywa-i-owoce/grzyby', { timeout: 10000 });
    await productsListPage.getProductCategoryTitle('Grzyby').isVisible();
  })
})

