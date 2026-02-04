import { expect } from '@playwright/test';
import OrdersPage from '../../../page/Profile/OrdersList.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';

test.setTimeout(60000);

test.describe('Testy listy zamówień', async () => {
  let ordersPage: OrdersPage;
  
  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
    
    ordersPage = new OrdersPage(page);
  })
  
  test.skip('W | Strona zamówień wyświetla się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {
    
    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy listy zamówień');
    await allure.subSuite('');
    await allure.allureId('1936');

    // Unskip if campaign will be off

    let orderTotal: string | undefined;

    page.on('response', async response => {
      const url = response.url();
      if (url.includes(`${process.env.APIURL}/api/sale-orders`) && response.ok()) {
        const responseData = await response.json();
        orderTotal = responseData.meta.total.toString();
      }
    });

    await page.goto('/profil/zamowienia', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/profil/zamowienia?testy-automatyczne');
    await expect(ordersPage.getOrdersTitle).toBeVisible({ timeout: 15000 });
    await expect(ordersPage.getOrdersTotal).toContainText(orderTotal || '');
    await expect(ordersPage.getOrderDetailsButton.first()).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Nr zamówienia').first()).toBeVisible();
    await expect(page.getByText('Data zamówienia').first()).toBeVisible();
    await expect(page.getByText('Suma').first()).toBeVisible();
    await expect(page.getByText('Status').first()).toBeVisible();
  })
})
