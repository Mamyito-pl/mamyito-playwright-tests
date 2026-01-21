import { expect } from '@playwright/test';
import MainPage from "../../../page/Main.page.ts";
import CartPage from '../../../page/Cart.page.ts';
import DeliveryPage from '../../../page/Delivery.page.ts';
import PaymentsPage from '../../../page/Payments.page.ts';
import OrderDetailsPage from '../../../page/Profile/OrderDetails.page.ts';
import OrdersPage from '../../../page/Profile/OrdersList.page.ts';
import CommonPage from '../../../page/Common.page.ts';
import SearchbarPage from '../../../page/Searchbar.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../../utils/selectors.json';
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods.ts';
import Przelewy24Page from '../../../page/Przelewy24.page.ts';
import { format, parseISO } from 'date-fns';

test.describe.configure({ mode: 'serial' })

test.describe('Testy szczegółów zamówienia', async () => {

  let cartPage: CartPage;
  let deliveryPage: DeliveryPage;
  let paymentsPage: PaymentsPage;
  let orderDetailsPage: OrderDetailsPage;
  let ordersPage: OrdersPage;
  let commonPage: CommonPage;
  let mainPage: MainPage;
  let searchbarPage : SearchbarPage;
  let przelewy24Page: Przelewy24Page;
  let product: string = 'janex polędwica wołowa';
  let paymentMethod = 'Płatność kartą przy odbiorze';
  
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
    orderDetailsPage = new OrderDetailsPage(page);
    ordersPage = new OrdersPage(page);
    commonPage = new CommonPage(page);
    searchbarPage = new SearchbarPage(page);
    przelewy24Page = new Przelewy24Page(page);
  })
  
  test.afterEach(async ({ clearCartViaAPI, deleteDeliveryAddressViaAPI, detachDeliverySlotViaAPI }) => {
    
    await deleteDeliveryAddressViaAPI('Adres Testowy');
    await detachDeliverySlotViaAPI();
    await clearCartViaAPI();
  }) 

  test('M | Złożone prawidłowo zamówienie powinno wyświetlić się ze wszystkimi wymaganymi polami', { tag: ['@Beta', '@Test', '@Prod'] }, async ({ page, baseURL, cancelOrderViaAPI, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2221');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(150000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct(product);
    await page.waitForTimeout(2000);
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
    await expect(searchbarPage.getSearchbarProductNames.first()).toBeVisible({ timeout: 15000 });

    const productNameElements = await searchbarPage.getSearchbarProductNames.all();
    const maxProducts = Math.min(productNameElements.length, 5);
    const productNames: string[] = [];
    
    for (let i = 0; i < maxProducts; i++) {
      const nameText = await productNameElements[i].textContent();
      if (nameText !== null) {
        await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
        await page.waitForTimeout(4000);
        productNames.push(nameText);
      }
    }

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
    await utility.addTestParam(page);
    await page.waitForTimeout(5000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
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
      await page.getByText(paymentMethod, { exact: true }).click({ force: true });
    } else {
      await page.getByText(paymentMethod, { exact: true }).click({ force: true });
    }
    await cartPage.clickCartExpandCollapseButton();
    const paymentTotalPrice = await cartPage.getTotalSummaryValue.textContent();
    const paymentTotalPriceFormatted = paymentTotalPrice?.slice(10);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();
  
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();
    await expect(page.getByText(paymentTotalPriceFormatted || '')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    const orderNumber = await paymentsPage.getOrderNumber.textContent();
    const deliveryDate = await page.getByText('Termin dostawy').locator('..').locator('div').last().textContent();
    const deliveryHours = await page.getByText('Godziny dostawy').locator('..').locator('div').last().textContent();

    const parsed = deliveryDate ? parseISO(deliveryDate) : null;
    const deliveryDateFormatted = parsed && !isNaN(parsed.getTime())? format(parsed, 'dd.MM.yyyy'): '';
    const deliveryHoursFormatted = deliveryHours?.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, '$1 - $2');

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const todayFormatted = format(new Date(), 'dd.MM.yyyy');

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getPrintOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getOrderNumber).toContainText(orderNumber || '');
    await expect(await orderDetailsPage.getDetailsSectionName('Szczegóły')).toBeVisible();
    await expect(await orderDetailsPage.getDetailsSectionName('Adres dostawy')).toBeVisible();
    await expect(await orderDetailsPage.getDetailsSectionName('Płatność')).toBeVisible();
    await expect(page.getByText('Data zamówienia').locator('..').locator('div').last()).toContainText(todayFormatted);
    await expect(page.getByText('Termin dostawy').locator('..').locator('div').last()).toContainText(deliveryDateFormatted);
    await expect(page.getByText('Godzina dostawy').locator('..').locator('div').last()).toContainText(deliveryHoursFormatted || '');
    await expect(page.getByText('Nazwisko i imię').locator('..').locator('div').last()).toContainText('Kowalski Jan');
    await expect(page.getByText('Numer telefonu').locator('..').locator('div').last()).toContainText('555666777');
    await expect(page.getByText('aleja Jana Pawła II 1/30')).toBeVisible();
    await expect(page.getByText('00-828 Warszawa')).toBeVisible();
    await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText(paymentMethod);
    await expect(page.getByText('Data płatności')).toBeVisible();
    await expect(page.getByText('Kwota').locator('..').locator('div').last()).toContainText(paymentTotalPriceFormatted || '');

    await expect(orderDetailsPage.getProductNames.first()).toBeVisible({ timeout: 15000 });
    const productNameElementsOrderDetails = await orderDetailsPage.getProductNames.all();
    const productNamesOrderDetails: string[] = [];
    
    for (const element of productNameElementsOrderDetails) {
      const nameText = await element.textContent();
      if (nameText !== null) {
        productNamesOrderDetails.push(nameText);
      }
    }

    expect(productNamesOrderDetails.length).toEqual(productNames.length);
    
    await cancelOrderViaAPI(page);

    productNames.forEach((searchName) => {
      expect(productNamesOrderDetails.some(orderDetailName => orderDetailName.includes(searchName))).toBe(true);
    });
  })
  
  test.skip('M | Zamówienie po błędnej płatności powinno wyświetlić się ze wszystkimi wymaganymi polami', { tag: ['@Beta', '@Test'] }, async ({ page, baseURL, cancelOrderViaAPI, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2397');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');
  
    test.setTimeout(345000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct(product);
    await page.waitForTimeout(2000);
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
    await expect(searchbarPage.getSearchbarProductNames.first()).toBeVisible({ timeout: 15000 });

    const productNameElements = await searchbarPage.getSearchbarProductNames.all();
    const maxProducts = Math.min(productNameElements.length, 5);
    const productNames: string[] = [];
    
    for (let i = 0; i < maxProducts; i++) {
      const nameText = await productNameElements[i].textContent();
      if (nameText !== null) {
        await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
        await page.waitForTimeout(4000);
        productNames.push(nameText);
      }
    }

    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000});

    await cartPage.clickCartSummaryButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
    await page.waitForTimeout(2000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByText('Przelew online').click({ force: true });
    await cartPage.clickCartExpandCollapseButton();
    const paymentTotalPrice = await cartPage.getTotalSummaryValue.textContent();
    const paymentTotalPriceFormatted = paymentTotalPrice?.slice(10);
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();
  
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await page.waitForLoadState('load')
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
    await page.waitForTimeout(1000);

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
    
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'), { timeout: 15000 });
    await przelewy24Page.clickBackToShopButton();
    await page.waitForTimeout(2000);

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
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible({ timeout: 5000 });
    await expect(page.getByText(paymentTotalPriceFormatted || '')).toBeVisible();
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible();
    const orderNumber = await paymentsPage.getOrderNumber.textContent();
    const deliveryDate = await page.getByText('Termin dostawy').locator('..').locator('div').last().textContent();
    const deliveryHours = await page.getByText('Godziny dostawy').locator('..').locator('div').last().textContent();

    const parsed = deliveryDate ? parseISO(deliveryDate) : null;
    const deliveryDateFormatted = parsed && !isNaN(parsed.getTime())? format(parsed, 'dd.MM.yyyy'): '';
    const deliveryHoursFormatted = deliveryHours?.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, '$1 - $2');

    await paymentsPage.clickOrderDetailsButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const todayFormatted = format(new Date(), 'dd.MM.yyyy');

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getCancelOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getPrintOrderButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getOrderNumber).toContainText(orderNumber || '');
    await expect(await orderDetailsPage.getDetailsSectionName('Szczegóły')).toBeVisible();
    await expect(await orderDetailsPage.getDetailsSectionName('Adres dostawy')).toBeVisible();
    await expect(await orderDetailsPage.getDetailsSectionName('Płatność')).toBeVisible();
    await expect(page.getByText('Data zamówienia').locator('..').locator('div').last()).toContainText(todayFormatted);
    await expect(page.getByText('Termin dostawy').locator('..').locator('div').last()).toContainText(deliveryDateFormatted);
    await expect(page.getByText('Godzina dostawy').locator('..').locator('div').last()).toContainText(deliveryHoursFormatted || '');
    await expect(page.getByText('Nazwisko i imię').locator('..').locator('div').last()).toContainText('Kowalski Jan');
    await expect(page.getByText('Numer telefonu').locator('..').locator('div').last()).toContainText('555666777');
    await expect(page.getByText('aleja Jana Pawła II 1/30')).toBeVisible();
    await expect(page.getByText('00-828 Warszawa')).toBeVisible();
    await expect(page.getByText('Metoda płatności').locator('..').locator('div').last()).toContainText('Przelewy24');
    await expect(page.getByText('Data płatności')).toBeVisible();
    await expect(page.getByText('Kwota').locator('..').locator('div').last()).toContainText(paymentTotalPriceFormatted || '');

    await expect(orderDetailsPage.getProductNames.first()).toBeVisible({ timeout: 15000 });
    const productNameElementsOrderDetails = await orderDetailsPage.getProductNames.all();
    const productNamesOrderDetails: string[] = [];
    
    for (const element of productNameElementsOrderDetails) {
      const nameText = await element.textContent();
      if (nameText !== null) {
        productNamesOrderDetails.push(nameText);
      }
    }

    expect(productNamesOrderDetails.length).toEqual(productNames.length);
    
    await cancelOrderViaAPI(page);
    productNames.forEach((searchName) => {
      expect(productNamesOrderDetails.some(orderDetailName => orderDetailName.includes(searchName))).toBe(true);
    });
  })

  test('M | Możliwość ponownego zamówienia po złożeniu prawidłowego zamówienia', { tag: ['@Beta', '@Test', '@Prod'] }, async ({ page, addProduct, baseURL, cancelOrderViaAPI, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2398');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

    test.setTimeout(350000);

    await addProduct(product);
    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
    await utility.addTestParam(page);
    await page.waitForTimeout(5000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
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
      await page.getByText(paymentMethod, { exact: true }).click({ force: true });
    } else {
      await page.getByText(paymentMethod, { exact: true }).click({ force: true });
    }
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/podsumowanie'), { timeout: 20000 });
    await expect(page.getByText('Przyjęliśmy Twoje zamówienie')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Twoje zamówienie zostało potwierdzone i zostanie dostarczone w wybranym przez Ciebie terminie.')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Nr zamówienia: ')).toBeVisible();

    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });

    await expect(orderDetailsPage.getProductNames.first()).toBeVisible({ timeout: 15000 });
    const productNameElementsOrderDetails = await orderDetailsPage.getProductNames.all();
    const productNamesOrderDetails: string[] = [];
    
    for (const element of productNameElementsOrderDetails) {
      const nameText = await element.textContent();
      if (nameText !== null) {
        productNamesOrderDetails.push(nameText);
      }
    }
    
    await orderDetailsPage.clickRepeatOrderButton();

    await expect(orderDetailsPage.getRepeatOrderModal).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderModalAddProductsButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderModalCancelButton).toBeVisible({ timeout: 5000 });

    const productNameElementsRepeatOrderModal = await orderDetailsPage.getRepeatOrderModalProductNames.all();
    expect(productNameElementsRepeatOrderModal.length).toBeGreaterThan(0);
    for (let i = 0; i < productNamesOrderDetails.length; i++) {
      const orderDetailName = productNamesOrderDetails[i];
      const modalName = await productNameElementsRepeatOrderModal[i].textContent();
      expect(orderDetailName).toContain(modalName);
    }

    await orderDetailsPage.getRepeatOrderModalAddProductsButton.click();

    await expect(orderDetailsPage.getRepeatOrderModal).not.toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 10000 });

    await page.goBack();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await cancelOrderViaAPI(page);

    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 5000 });
  })

  test('M | Możliwość ponownego zamówienia po złożeniu zamówienia z błędną płatnością', { tag: ['@Beta', '@Test'] }, async ({ page, addProduct, baseURL, cancelOrderViaAPI, addAddressDelivery }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2399');

    test.skip(`${process.env.URL}` == 'https://mamyito.pl', 'Test wymaga złożenia zamówienia');

    test.setTimeout(350000);

    await addProduct(product);
    await searchbarPage.getProductItemCount.first().click();
    await page.waitForTimeout(1000);
    await searchbarPage.getProductItemCount.first().type('1');
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);

    await page.goto('/koszyk', { waitUntil: 'load'});
    await expect(page).toHaveURL(`${baseURL}` + '/koszyk?testy-automatyczne');
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 10000 });
    await cartPage.clickCartSummaryButton();
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/dostawa'), { timeout: 20000 });
    await utility.addTestParam(page);
    await page.waitForTimeout(5000);
    await paymentsPage.closeAddressModal();
    await addAddressDelivery('Adres Testowy');
    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 10000 });
    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await cartPage.clickCartSummaryPaymentButton();
    await deliveryPage.clickConfirmReservationButton(); 
    await expect(deliveryPage.getAddressModal).not.toBeVisible({ timeout: 15000 });
    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/platnosc'), { timeout: 20000 });
    await page.waitForTimeout(2000);
    await paymentsPage.checkStatue();
    await page.waitForTimeout(1000);
    await page.getByText('Przelew online').click({ force: true });
    await cartPage.clickCartPaymentConfirmationButton();
    await cartPage.waitForPaymentConfirmationButton();

    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnRequest/'), { timeout: 15000 });
    await przelewy24Page.clickMainTransferButton();
    await przelewy24Page.clickChosenTransferButton();
    await page.waitForLoadState('load')
    await expect(page).toHaveURL(new RegExp('^https://vsa.przelewy24.pl/pl/payment'), { timeout: 15000 });
    await page.waitForTimeout(1000);

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
    
    await expect(page).toHaveURL(new RegExp('^https://sandbox-go.przelewy24.pl/trnResult/'), { timeout: 15000 });
    await przelewy24Page.clickBackToShopButton();
    await page.waitForTimeout(2000);

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
    await expect(paymentsPage.getOrderDetailsButton).toBeVisible({ timeout: 5000 });
    await paymentsPage.clickOrderDetailsButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    const statusIsVisible = await page.locator('div[data-sentry-element="HeaderOrderDetails"]').evaluate((element) => {
      const textContent = element.textContent || '';
      return textContent.includes('Oczekuje na płatność') || textContent.includes('Nowe');
    });

    expect(statusIsVisible).toBe(true);

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await expect(orderDetailsPage.getRepeatOrderButton).toBeVisible({ timeout: 15000 });

    await expect(orderDetailsPage.getProductNames.first()).toBeVisible({ timeout: 15000 });
    const productNameElementsOrderDetails = await orderDetailsPage.getProductNames.all();
    const productNamesOrderDetails: string[] = [];
    
    for (const element of productNameElementsOrderDetails) {
      const nameText = await element.textContent();
      if (nameText !== null) {
        productNamesOrderDetails.push(nameText);
      }
    }
    
    await orderDetailsPage.clickRepeatOrderButton();

    await expect(orderDetailsPage.getRepeatOrderModal).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderModalAddProductsButton).toBeVisible({ timeout: 5000 });
    await expect(orderDetailsPage.getRepeatOrderModalCancelButton).toBeVisible({ timeout: 5000 });

    const productNameElementsRepeatOrderModal = await orderDetailsPage.getRepeatOrderModalProductNames.all();
    expect(productNameElementsRepeatOrderModal.length).toBeGreaterThan(0);
    for (let i = 0; i < productNamesOrderDetails.length; i++) {
      const orderDetailName = productNamesOrderDetails[i];
      const modalName = await productNameElementsRepeatOrderModal[i].textContent();
      expect(orderDetailName).toContain(modalName);
    }

    await orderDetailsPage.getRepeatOrderModalAddProductsButton.click();

    await expect(orderDetailsPage.getRepeatOrderModal).not.toBeVisible({ timeout: 5000 });

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/koszyk'), { timeout: 10000 });

    await page.goBack();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await cancelOrderViaAPI(page);

    await expect(commonPage.getCartProductsCount).toBeVisible({ timeout: 5000 });
    await expect(commonPage.getCartProductsPrice).toBeVisible({ timeout: 5000 });
  })
        
  test('M | Możliwość powrotu do listy zamówień za pomocą przycisku "Wróć do listy zamówień"', { tag: [ '@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2400');

    await page.goto('/profil/zamowienia', { waitUntil: 'load'});

    await expect(ordersPage.getOrderDetailsButton.nth(0)).toBeVisible({ timeout: 20000 });
    await ordersPage.getOrderDetailsButton.nth(0).click();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });

    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
    await orderDetailsPage.clickBackToOrdersButton();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia'), { timeout: 15000 });
    await expect(ordersPage.getOrdersTitle).toBeVisible({ timeout: 15000 });
  })
           
  test('M | Możliwość przejścia do szczegółów zamówienia z listy zamówień', { tag: ['@ProdSmoke', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Profil');
    await allure.epic('Mobilne');
    await allure.parentSuite('Profil');
    await allure.suite('Testy szczegółów zamówienia');
    await allure.subSuite('');
    await allure.allureId('2401');

    await page.goto('/profil/zamowienia', { waitUntil: 'load'});

    await expect(ordersPage.getOrderDetailsButton.nth(0)).toBeVisible({ timeout: 20000 });
    await ordersPage.getOrderDetailsButton.nth(0).click();

    await expect(page).toHaveURL(new RegExp(`${baseURL}` + '/profil/zamowienia\\?order=.*'), { timeout: 30000 });
    await expect(orderDetailsPage.getBackToOrdersButton).toBeVisible({ timeout: 15000 });
  })
})
