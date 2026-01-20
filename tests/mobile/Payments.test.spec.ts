import { expect } from '@playwright/test';
import MainPage from "../../page/Main.page.ts";
import CartPage from '../../page/Cart.page.ts';
import DeliveryPage from '../../page/Delivery.page.ts';
import PaymentsPage from '../../page/Payments.page.ts';
import Przelewy24Page from '../../page/Przelewy24.page.ts';
import OrderDetailsPage from '../../page/Profile/OrderDetails.page.ts';
import CommonPage from '../../page/Common.page.ts';
import SearchbarPage from '../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy płatności', async () => {

  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let paymentsPage: PaymentsPage;
  let przelewy24Page: Przelewy24Page;
  let orderDetailsPage: OrderDetailsPage;
  let commonPage: CommonPage;
  let mainPage: MainPage;
  let searchbarPage : SearchbarPage;
  let product = 'janex polędwica wołowa';

  test.beforeEach(async ({ page }) => {

    await page.goto('/', { waitUntil: 'load'})

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    mainPage = new MainPage(page);
    cartPage = new CartPage(page);
    deliveryPage = new DeliveryPage(page);
    paymentsPage = new PaymentsPage(page);
    przelewy24Page = new Przelewy24Page(page);
    orderDetailsPage = new OrderDetailsPage(page);
    commonPage = new CommonPage(page)
    searchbarPage = new SearchbarPage(page);
  })
  
  test.afterEach(async ({ clearCartViaAPI, deleteDeliveryAddressViaAPI, detachDeliverySlotViaAPI }) => {

    await deleteDeliveryAddressViaAPI('Adres Testowy');
    await detachDeliverySlotViaAPI();
    await clearCartViaAPI();
  })

  test('M | Przejście do sklepu podczas przetwarzania płatności', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('480');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await page.waitForTimeout(1000);
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByText('Płatność kartą przy odbiorze').click({ force: true });
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();

    await paymentsPage.clickBackHomeButton();

    await expect(page).toHaveURL(`${baseURL}`, { timeout: 15000 });
    await expect(mainPage.getBannersSection).toBeVisible({ timeout: 15000 });

    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeHidden({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeHidden({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeHidden();
    await expect(paymentsPage.getOrderDetailsButton).toBeHidden();
    await expect(paymentsPage.getRepeatOrderButton).toBeHidden();
    await expect(paymentsPage.getBackHomeButton).toBeHidden();
  })

  test('M | Okno ponownego zamówienia otwiera się ze wszystkimi potrzebnymi polami', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('481');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await page.waitForTimeout(1000);
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByText('Płatność kartą przy odbiorze').click({ force: true });
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await paymentsPage.clickRepeatOrderButton();

    await expect(page.getByText('Ponów zamówienie')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('Ponowienie zamówienia spowoduje dodanie poniższych produktów do Twojego koszyka.')).toBeVisible({ timeout: 5000 });
    await expect(page.getByText('1 produkt')).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getModalCloseIcon).toBeVisible({ timeout: 5000 });
    await expect(paymentsPage.getAddProductsButtonRepeatOrderWindow).toBeVisible({ timeout: 5000 });
    await expect(paymentsPage.getCancelButtonRepeatOrderWindow).toBeVisible({ timeout: 5000 });
  })
  
  test('M | Przejście do szczegółów zamówienia podczas przetwarzania płatności', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('482');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(130000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await page.waitForTimeout(1000);
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByText('Płatność kartą przy odbiorze').click({ force: true });
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/'));
    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible({ timeout: 5000 });
  })

  test.skip('M | Możliwość zapłaty za zamówienie z poziomu listy zamówień', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

    // UNSKIP AFTER FIX KAN-2189

    await allure.tags('Mobilne', 'Płatności');
    await allure.epic('Mobilne');
    await allure.parentSuite('Płatności');
    await allure.suite('Testy płatności');
    await allure.subSuite('');
    await allure.allureId('483');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(180000);

    await addProduct(product);

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await page.waitForTimeout(1000);
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await page.waitForLoadState('load');
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByLabel('Przelew online').check();
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
    const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
    const maxTries = 5;
    let urlChanged = false;

    for (let i = 0; i < maxTries; i++) {
      await przelewy24Page.clickErrorPayButton();
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      if (expectedUrlPattern.test(currentUrl)) {
        urlChanged = true;
        break;
      }
    }

    expect(urlChanged).toBe(true);
    await przelewy24Page.clickBackToShopButton();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
    await expect(orderDetailsPage.getPayButton).toBeVisible();
    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible();
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible();
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible();

    await orderDetailsPage.clickPayButton();

    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
    for (let i = 0; i < maxTries; i++) {
      await przelewy24Page.clickPayButton();
      await page.waitForTimeout(1000);

      const currentUrl = page.url();
      if (expectedUrlPattern.test(currentUrl)) {
        urlChanged = true;
        break;
      }
    }
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
    await expect(paymentsPage.getBackHomeButton).toBeVisible();
  })
  
  test.describe('Płatność BLIK', async () => {
      
    test('M | Zapłata prawidłowym kodem BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('788');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
    
      test.setTimeout(300000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
      await cartPage.clickCartDrawerToCartButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(2000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('777111');
      await cartPage.clickCartPaymentConfirmationButton();
    
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 145000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    })

    test('M | Zapłata nieprawidłowym kodem BLIK powinna utworzyć zamówienie', { tag: ['@ProdSmoke'] }, async ({ page, addProductsByValue, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('1693');

      test.setTimeout(230000);

      await addProductsByValue(180);
      await commonPage.getCartButton.click();

      await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
      await cartPage.clickCartDrawerToCartButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(2000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('123123');
      await cartPage.clickCartPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await paymentsPage.clickOrderDetailsButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

      const statusBeforeCancelIsVisible = await page.locator('div[data-sentry-element="HeaderOrderDetails"]').evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Oczekuje na płatność') || textContent.includes('Nowe');
      });
      
      expect(statusBeforeCancelIsVisible).toBe(true);
      await orderDetailsPage.clickCancelOrderButton();

      await expect(orderDetailsPage.getCancelOrderModal).toBeVisible({ timeout: 10000 });
      await (expect(orderDetailsPage.getCancelOrderModal.getByText('Anulowanie zamówienia'))).toBeVisible();
      await expect(orderDetailsPage.getCancelConfirmationButton).toBeVisible();
      
      let tries = 0;
      while (tries < 3) {
        if (!(await orderDetailsPage.getCancelOrderModal.isVisible({ timeout: 3000 }))) {
          break;
        }
        await orderDetailsPage.getCancelConfirmationButton.click({ force: true, delay: 300 });
        await page.waitForTimeout(7000);
        tries++;
      }

      await page.waitForTimeout(2000);

      const statusAfterCancelIsVisible = await page.locator('#ordersHeadline').locator('..').last().first().evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Anulowane');
      });

      expect(statusAfterCancelIsVisible).toBe(true);
    })

    test('M | Zapłata nieprawidłowym kodem BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('485');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(300000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('123123');
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
    })
    
    test('M | Zapłata pustym kodem BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, addAddressDelivery }) => {
    
      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('484');

      test.setTimeout(145000);
      
      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await cartPage.getCartPaymentConfirmationDisabledButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
    })
    
    test('M | Zapłata za krótkim kodem BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('487');

      test.setTimeout(115000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('123');
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentConfirmationDisabledButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
    })
        
    test('M | Zapłata za długim kodem BLIK', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('488');

      test.setTimeout(115000);
  
      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('12345678');
      await paymentsPage.checkStatue();
      await cartPage.getCartPaymentConfirmationDisabledButton.isDisabled();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
      await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
      await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
      await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
    })
                    
    test('M | Zapłata kodem BLIK z nieprawidłowymi znakami', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('489');

      test.setTimeout(215000);

      const symbols: string[] = ["~", "`", "!", "@", "#", "$", "%", "^", "&", "*", "(", ")", "-", "+", "=", "{", "[", "}", "]", "|", "\'", ":", ";", "'", '"', "<", ",", ">", ".", "/", "?"];

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('12345');

      for (const symbol of symbols) {
        await page.keyboard.press(symbol);
        await page.waitForTimeout(1000);
        await paymentsPage.getStatueCheckbox.scrollIntoViewIfNeeded();
        await paymentsPage.checkStatue();
        expect(await paymentsPage.getStatueCheckbox.isChecked()).toBeTruthy();
        expect(await cartPage.getCartPaymentConfirmationDisabledButton.isDisabled()).toBeTruthy();
        await expect(paymentsPage.getBlikTextboxPlaceholder).toBeVisible();
        await expect(paymentsPage.getBlikTextboxPlaceholder).toHaveText('Wpisz 6-cio cyfrowy kod BLIK');
        await expect(paymentsPage.getBlikTextboxHelperText).toBeVisible();
        await expect(paymentsPage.getBlikTextboxHelperText).toHaveText('Podany kod jest nieprawidłowy. Kod BLIK musi zawierać 6 cyfr');
        await page.locator(selectors.PaymentsPage.common.blikPaymentInput).click();
        await page.keyboard.press('Backspace');
      }
    })
                        
    test('M | Ponowna zapłata po nieudanej płatności BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('490');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(500000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForLoadState('load');
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('123456');
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });

      await paymentsPage.clickRepeatPaymentButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainBlikButton();
      await przelewy24Page.clickChosenBlikButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      
      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible();
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
                            
    test('M | Zapłata przy odbiorze po nieudanej płatności BLIK', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność BLIK');
      await allure.allureId('491');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(320000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Kod BLIK', { exact: true }).click({ force: true });
      await paymentsPage.enterBlikCode('123123');
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });
    
      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });

      await paymentsPage.clickPaymentOnDeliveryButton();

      await expect(commonPage.getMessage).toBeVisible({ timeout: 3000 });
      await expect(commonPage.getMessage).toHaveText('Metoda płatności została zmieniona', { timeout: 3000 });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeHidden({ timeout: 5000 });

      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
  })

  test.describe('Płatności przelewem online', async () => {
  
    test('M | Zapłata przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('492');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(145000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Przelew online', { exact: true }).click({ force: true });
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      
      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    }) 
        
    test('M | Błędna płatność przelewem online', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('493');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(355000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Przelew online', { exact: true }).click({ force: true });
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      await przelewy24Page.clickErrorPayButton();
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });

      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getBackHomeButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    }) 
                            
    test('M | Ponowna zapłata po nieudanej płatności przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('494');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(335000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Przelew online', { exact: true }).click({ force: true });
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickErrorPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
      
      await paymentsPage.getOrderDetailsButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      
      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.getRepeatOrderButton.scrollIntoViewIfNeeded();
      await paymentsPage.clickRepeatPaymentButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
                                
    test('M | Zapłata przy odbiorze po nieudanej płatności przelewem online', { tag: ['@Smoke'] }, async ({ page, addProduct, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('495');
  
      test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

      test.setTimeout(335000);

      await addProduct(product);

      await searchbarPage.getProductItemCount.first().click();
      await page.waitForTimeout(1000);
      await searchbarPage.getProductItemCount.first().type('1');
      await commonPage.getCartButton.click();
      await page.waitForTimeout(1000);

      await page.goto('/koszyk', { waitUntil: 'load'});
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(1000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Przelew online', { exact: true }).click({ force: true });
      await cartPage.clickCartPaymentConfirmationButton();
      await cartPage.waitForPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'));
      await przelewy24Page.clickMainTransferButton();
      await przelewy24Page.clickChosenTransferButton();
      await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'));

      const expectedUrlPattern = /^https:\/\/sandbox-go\.przelewy24\.pl\/trnResult\//;
      const maxTries = 5;
      let urlChanged = false;
  
      for (let i = 0; i < maxTries; i++) {
        await przelewy24Page.clickErrorPayButton();
        await page.waitForTimeout(1000);
  
        const currentUrl = page.url();
        if (expectedUrlPattern.test(currentUrl)) {
          urlChanged = true;
          break;
        }
      }
  
      expect(urlChanged).toBe(true);
      await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'));
      await przelewy24Page.clickBackToShopButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przetwarzanie płatności....')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();

      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeVisible({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeVisible({ timeout: 5000 });
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();

      await paymentsPage.clickPaymentOnDeliveryButton();

      await expect(commonPage.getMessage).toBeVisible({ timeout: 3000 });
      await expect(commonPage.getMessage).toHaveText('Metoda płatności została zmieniona', { timeout: 3000 });

      await expect(page.getByText('Wystąpił błąd płatności')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Sprawdź swój adres email, aby zobaczyć co poszło nie tak')).toBeHidden({ timeout: 5000 });
      await expect(page.getByText('Co chcesz zrobić?')).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getPaymentOnDeliveryButton).toBeHidden({ timeout: 5000 });
      await expect(paymentsPage.getRepeatPaymentButton).toBeHidden({ timeout: 5000 });
      
      await page.waitForSelector('text="Przetwarzanie płatności...."', { timeout: 145000, state: 'hidden' });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
      await expect(paymentsPage.getRepeatOrderButton).toBeVisible();
      await expect(paymentsPage.getBackHomeButton).toBeVisible();
    })
            
    test('M | Próba płatności przelewem online powinna utworzyć zamówienie', { tag: ['@ProdSmoke'] }, async ({ page, addProductsByValue, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Płatność przelewem online');
      await allure.allureId('1694');

      test.setTimeout(250000);

      await addProductsByValue(180);
      await commonPage.getCartButton.click();

      await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
      await cartPage.clickCartDrawerToCartButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(2000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      await page.getByText('Przelew online', { exact: true }).click({ force: true });
      await paymentsPage.checkStatue();
      await cartPage.clickCartPaymentConfirmationButton();

      if (`${process.env.URL}` == 'https://mamyito.pl') {
        await expect(page).toHaveURL(new RegExp('^https://go.przelewy24.pl/trnRequest/'), { timeout: 20000 });
      } else {
        await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 20000 });
      };

      await page.goto('profil/zamowienia', { waitUntil: 'load'});
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?testy-automatyczne'), { timeout: 20000 });
    
      const lastOrderDetailsButton = page.locator('#profile_order_details_button');
      await lastOrderDetailsButton.first().click();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

      const statusBeforeCancelIsVisible = await page.locator('div[data-sentry-element="HeaderOrderDetails"]').evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Oczekuje na płatność') || textContent.includes('Nowe');
      });

      expect(statusBeforeCancelIsVisible).toBe(true);
      await orderDetailsPage.clickCancelOrderButton();

      await expect(orderDetailsPage.getCancelOrderModal).toBeVisible({ timeout: 10000 });
      await (expect(orderDetailsPage.getCancelOrderModal.getByText('Anulowanie zamówienia'))).toBeVisible();
      await expect(orderDetailsPage.getCancelConfirmationButton).toBeVisible();
      
      let tries = 0;
      while (tries < 3) {
        if (!(await orderDetailsPage.getCancelOrderModal.isVisible({ timeout: 3000 }))) {
          break;
        }
        await orderDetailsPage.getCancelConfirmationButton.click({ force: true, delay: 300 });
        await page.waitForTimeout(7000);
        tries++;
      }

      await page.waitForTimeout(2000);

      const statusAfterCancelIsVisible = await page.locator('#ordersHeadline').locator('..').last().first().evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Anulowane');
      });

      expect(statusAfterCancelIsVisible).toBe(true);
    })
  })
  
  test.describe('Zapłata kartą przy odbiorze', async () => {
  
    test('M | Zapłata kartą przy odbiorze', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addProductsByValue, baseURL, addAddressDelivery }) => {

      await allure.tags('Mobilne', 'Płatności');
      await allure.epic('Mobilne');
      await allure.parentSuite('Płatności');
      await allure.suite('Testy płatności');
      await allure.subSuite('Zapłata kartą przy odbiorze');
      await allure.allureId('688');

      test.setTimeout(200000);

      await addProductsByValue(180);
      await commonPage.getCartButton.click();

      await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
      await cartPage.clickCartDrawerToCartButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
      await cartPage.clickCartSummaryButton();
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.closeAddressModal();
      await addAddressDelivery('Adres Testowy');
      await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
      await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
      await page.waitForTimeout(1000);
      await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
      await page.waitForTimeout(2000);
      await cartPage.clickCartSummaryPaymentButton();
      await deliveryPage.clickConfirmReservationButton(); 
      await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
      await utility.addTestParam(page);
      await page.waitForTimeout(2000);
      await paymentsPage.checkStatue();
      await page.waitForTimeout(1000);
      if (await commonPage.getLoader.isVisible({ timeout: 5000 })) {
        await expect(commonPage.getLoader).toBeHidden({ timeout: 10000 });
        await page.getByText('Płatność kartą przy odbiorze', { exact: true }).click({ force: true });
      } else {
        await page.getByText('Płatność kartą przy odbiorze', { exact: true }).click({ force: true });
      }
      await cartPage.clickCartPaymentConfirmationButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
      await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
      await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
      
      await paymentsPage.clickOrderDetailsButton();

      await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

      const statusBeforeCancelIsVisible = await page.locator('div[data-sentry-element="HeaderOrderDetails"]').evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Przyjęte do realizacji');
      });
      
      expect(statusBeforeCancelIsVisible).toBe(true);
      await orderDetailsPage.clickCancelOrderButton();

      await expect(orderDetailsPage.getCancelOrderModal).toBeVisible({ timeout: 10000 });
      await (expect(orderDetailsPage.getCancelOrderModal.getByText('Anulowanie zamówienia'))).toBeVisible();
      await expect(orderDetailsPage.getCancelConfirmationButton).toBeVisible();
      
      let tries = 0;
      while (tries < 3) {
        if (!(await orderDetailsPage.getCancelOrderModal.isVisible({ timeout: 3000 }))) {
          break;
        }
        await orderDetailsPage.getCancelConfirmationButton.click({ force: true, delay: 300 });
        await page.waitForTimeout(7000);
        tries++;
      }

      await page.waitForTimeout(2000);

      const statusAfterCancelIsVisible = await page.locator('#ordersHeadline').locator('..').last().first().evaluate((element) => {
        const textContent = element.textContent || '';
        return textContent.includes('Anulowane');
      });

      expect(statusAfterCancelIsVisible).toBe(true);
    })
  })
})
