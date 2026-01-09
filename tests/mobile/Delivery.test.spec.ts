import { expect } from '@playwright/test';
import CommonPage from "../../page/Common.page.ts";
import DeliveryPage from '../../page/Delivery.page.ts';
import PaymentsPage from '../../page/Payments.page.ts';
import * as allure from "allure-js-commons";
import * as selectors from '../../utils/selectors.json';
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy dostawy', async () => {

  let commonPage: CommonPage;
  let deliveryPage : DeliveryPage;
  let paymentsPage : PaymentsPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithRetry(page, '/');

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    commonPage = new CommonPage(page);
    deliveryPage = new DeliveryPage(page);
    paymentsPage = new PaymentsPage(page);
  })

  test.afterEach(async ({ deleteDeliveryAddressViaAPI, deleteInvoiceAddressViaAPI }) => {

    await deleteDeliveryAddressViaAPI('Adres Testowy');
    await deleteDeliveryAddressViaAPI('Adres Fixturowy');
    await deleteDeliveryAddressViaAPI('Adres Edytowany');

    await deleteInvoiceAddressViaAPI('Testowa nazwa podmiotu')
    await deleteInvoiceAddressViaAPI('Fixturowy adres podmiotu')
    await deleteInvoiceAddressViaAPI('Edytowana nazwa podmiotu')
    await deleteInvoiceAddressViaAPI('Faktura imienna')
    await deleteInvoiceAddressViaAPI('Testowa nazwa faktury imiennej')
    await deleteInvoiceAddressViaAPI('Edytowana Faktura imienna')
  })
  
  test('M | Okno dostawy otwiera się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Dostawa');
    await allure.epic('Mobilne');
    await allure.parentSuite('Dostawa');
    await allure.suite('Testy dostawy');
    await allure.subSuite('');
    await allure.allureId('646');

    await page.goto('/dostawa', { waitUntil: 'domcontentloaded' });

    await expect(deliveryPage.getDeliveryAddressTitle).toBeVisible();
    await expect(deliveryPage.getAddNewAddressButton).toBeVisible();
    await expect(deliveryPage.getDeliveryDateTitle).toBeVisible();
  })

  test('M | Możliwość wyboru terminu dostawy', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addAddressDeliveryViaAPI, detachDeliverySlotViaAPI }) => {

    await allure.tags('Mobilne', 'Dostawa');
    await allure.epic('Mobilne');
    await allure.parentSuite('Dostawa');
    await allure.suite('Testy dostawy');
    await allure.subSuite('');
    await allure.allureId('647');

    test.setTimeout(150000);

    await addAddressDeliveryViaAPI('Adres Testowy');

    await page.goto('/dostawa', { waitUntil: 'load' });

    await page.waitForTimeout(2000);

    await page.waitForSelector('text=Adres Testowy', { state: 'visible' });
    await page.getByText('Adres Testowy').click({ force: true, delay: 300 });

    await page.waitForSelector(selectors.DeliveryPage.common.deliverySlot, { timeout: 15000, state: 'visible' });

    await deliveryPage.getDeliverySlotButton.first().evaluate((el) => el.scrollIntoView({ behavior: 'auto', block: 'center' }));
    await page.waitForTimeout(1000);
    await deliveryPage.getDeliverySlotButton.first().click({ force: true, delay: 300 });
    await expect(deliveryPage.getDeliverySlotButton.first()).toContainText('Wybrany', { timeout: 3000 });
    
    await page.evaluate(async () => {
      window.scrollBy(0, 1000)
      await new Promise(r => setTimeout(r, 700));
    })

    await deliveryPage.getDeliverySlotButton.last().click();
    await expect(deliveryPage.getDeliverySlotButton.first()).toContainText('Dostępny', { timeout: 3000 });
    await expect(deliveryPage.getDeliverySlotButton.last()).toContainText('Wybrany', { timeout: 3000 });

    await detachDeliverySlotViaAPI();
  })

  test.describe('Adres dostawy', async () => {
    
    test('M | Możliwość dodania adresu dostawy', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('648');

      test.setTimeout(100000);
      
      await page.goto('/dostawa', { waitUntil: 'load' });

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Dodaj nowy adres');

      await expect(deliveryPage.getAddressModalAddressName).toBeVisible();
      await deliveryPage.getAddressModalAddressName.fill('Adres Testowy');

      await expect(deliveryPage.getAddressModalUserName).toBeVisible();
      await deliveryPage.getAddressModalUserName.fill('Jan');

      await expect(deliveryPage.getAddressModalUserSurname).toBeVisible();
      await deliveryPage.getAddressModalUserSurname.fill('Kowalski')

      await expect(deliveryPage.getAddressModalUserPhoneNumber).toBeVisible();
      await deliveryPage.getAddressModalUserPhoneNumber.fill('555666777');

      await expect(deliveryPage.getAddressModalUserPostalCode).toBeVisible();
      await deliveryPage.getAddressModalUserPostalCode.fill('00-133');

      await expect(deliveryPage.getAddressModalUserCity).toBeVisible();
      await deliveryPage.getAddressModalUserCity.fill('Warszawa');

      await expect(deliveryPage.getAddressModalUserStreet).toBeVisible();
      await deliveryPage.getAddressModalUserStreet.fill('aleja Jana Pawła II');

      await expect(deliveryPage.getAddressModalUserHouseNumber).toBeVisible();
      await deliveryPage.getAddressModalUserHouseNumber.fill('20');

      await expect(deliveryPage.getAddressModalUserStaircase).toBeVisible();
      await deliveryPage.getAddressModalUserStaircase.fill('1');

      await expect(deliveryPage.getAddressModalUserFlatNumber).toBeVisible();
      await deliveryPage.getAddressModalUserFlatNumber.fill('30');

      await expect(deliveryPage.getAddressModalUserFloor).toBeVisible();
      await deliveryPage.getAddressModalUserFloor.fill('2');
                                                                                        
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toBeVisible();
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText("Dane zostały zapisane", { timeout: 15000 });

      await page.waitForSelector('text=Adres Testowy', { state: 'visible' });
    })

    test('M | Możliwość wyboru adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addAddressDeliveryViaAPI }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('649');

      test.setTimeout(100000);

      await addAddressDeliveryViaAPI('Adres Testowy');
      await addAddressDeliveryViaAPI('Adres Fixturowy');

      const targetAddress = page.getByText('Adres Testowy').locator('..').locator('..').locator('..');
      
      await page.goto('/dostawa', { waitUntil: 'load' });

      await page.waitForTimeout(2000);

      await page.waitForSelector('text=Adres Testowy', { state: 'visible' });
      await page.waitForSelector('text=Adres Fixturowy', { state: 'visible' });

      await page.getByText('Adres Testowy').click({ force: true, delay: 300 });

      await expect(targetAddress).toHaveCSS('border-bottom-color', 'rgb(78, 180, 40)', { timeout: 10000 });

      await page.evaluate(async () => {
        window.scrollBy(0, 100)
        await new Promise(r => setTimeout(r, 700));
      })

      await page.getByText('Adres Fixturowy').click({ force: true, delay: 300 });

      await expect(targetAddress).not.toHaveCSS('border-bottom-color', 'rgb(78, 180, 40)', { timeout: 10000 });
    })

    test('M | Możliwość edycji adresu dostawy', { tag: ['@ProdSmoke', '@Smoke'] }, async ({ page, addAddressDeliveryViaAPI }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('650');

      test.setTimeout(100000);

      await addAddressDeliveryViaAPI('Adres Fixturowy');

      await page.goto('/dostawa', { waitUntil: 'load' });

      await page.waitForTimeout(2000);

      await page.getByText('Adres Fixturowy').click({ force: true, delay: 300 });

      await deliveryPage.clickEditAddressButton('Adres Fixturowy');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj adres');

      await expect(deliveryPage.getAddressModalAddressName).toHaveValue('Adres Fixturowy')
      await deliveryPage.getAddressModalAddressName.fill('Adres Edytowany');

      await expect(deliveryPage.getAddressModalUserName).toHaveValue('Jan');
      await deliveryPage.getAddressModalUserName.fill('Jan1');

      await expect(deliveryPage.getAddressModalUserSurname).toHaveValue('Kowalski');
      await deliveryPage.getAddressModalUserSurname.fill('Kowalski1');

      await expect(deliveryPage.getAddressModalUserPhoneNumber).toHaveValue('555666777');
      await deliveryPage.getAddressModalUserPhoneNumber.fill('777666555');

      await expect(deliveryPage.getAddressModalUserPostalCode).toHaveValue('00-828');
      await deliveryPage.getAddressModalUserPostalCode.fill('05-506');

      await expect(deliveryPage.getAddressModalUserCity).toHaveValue('Warszawa');
      await deliveryPage.getAddressModalUserCity.fill('Lesznowola');

      await expect(deliveryPage.getAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
      await deliveryPage.getAddressModalUserStreet.fill('Oficerska');

      await expect(deliveryPage.getAddressModalUserHouseNumber).toHaveValue('1');
      await deliveryPage.getAddressModalUserHouseNumber.fill('4');

      await expect(deliveryPage.getAddressModalUserStaircase).toHaveValue('1');
      await deliveryPage.getAddressModalUserStaircase.fill('2');

      await expect(deliveryPage.getAddressModalUserFlatNumber).toHaveValue('30');
      await deliveryPage.getAddressModalUserFlatNumber.fill('3');

      await expect(deliveryPage.getAddressModalUserFloor).toHaveValue('2');
      await deliveryPage.getAddressModalUserFloor.fill('77');
                                                                                    
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toHaveValue('Testowa notatka');
      await deliveryPage.getAddressModalUserDeliveryNotes.fill('Edytowana testowa notatka');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został zaktualizowany.', { timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await deliveryPage.clickEditAddressButton('Adres Edytowany');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj adres');
      await expect(deliveryPage.getAddressModalAddressName).toHaveValue('Adres Edytowany')
      await expect(deliveryPage.getAddressModalUserName).toHaveValue('Jan1');
      await expect(deliveryPage.getAddressModalUserSurname).toHaveValue('Kowalski1');
      await expect(deliveryPage.getAddressModalUserPhoneNumber).toHaveValue('777666555');
      await expect(deliveryPage.getAddressModalUserPostalCode).toHaveValue('05-506');
      await expect(deliveryPage.getAddressModalUserCity).toHaveValue('Lesznowola');
      await expect(deliveryPage.getAddressModalUserStreet).toHaveValue('Oficerska');
      await expect(deliveryPage.getAddressModalUserHouseNumber).toHaveValue('4');
      await expect(deliveryPage.getAddressModalUserStaircase).toHaveValue('2');
      await expect(deliveryPage.getAddressModalUserFlatNumber).toHaveValue('3');
      await expect(deliveryPage.getAddressModalUserFloor).toHaveValue('77');                                                                                      
      await expect(deliveryPage.getAddressModalUserDeliveryNotes).toHaveValue('Edytowana testowa notatka');
    })
    
    test('M | Możliwość usunięcia adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addAddressDeliveryViaAPI }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Adres dostawy');
      await allure.allureId('651');

      test.setTimeout(50000);

      await addAddressDeliveryViaAPI('Adres Edytowany');

      await page.goto('/dostawa', { waitUntil: 'load' });

      await page.waitForTimeout(2000);

      await deliveryPage.getDeliveryAddressTitle.waitFor({ state: 'visible', timeout: 10000 })

      await deliveryPage.clickDeleteAddressButton('Adres Edytowany');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName('Adres Edytowany')).toContainText('Adres Edytowany');
      await expect(deliveryPage.getAddressModalCancelButton).toBeVisible();
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został usunięty.', { timeout: 15000 })
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await page.waitForSelector('text=Adres Edytowany', { state: 'hidden' });
    })
  })

  test.describe('Faktura firmowa', async () => {
    
    test('M | Możliwość dodania podmiotu do faktury firmowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura firmowa');
      await allure.allureId('652');

      test.setTimeout(150000);
      
      await page.goto('/platnosc', { waitUntil: 'load' });

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();
      await page.evaluate(async () => {
        window.scrollBy(0, 200)
        await new Promise(r => setTimeout(r, 700));
      })
      await deliveryPage.getDeliveryInvoiceCheckbox.check({ force: true });
      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Dodaj nowy podmiot');
      await expect(deliveryPage.getInvoiceAddressTypeDropdown).toHaveText('Faktura firmowa');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toBeVisible();
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Testowa nazwa podmiotu');

      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toBeVisible();
      await deliveryPage.getInvoiceAddressModalCompanyName.fill('Testowa nazwa firmy');

      await expect(deliveryPage.getInvoiceAddressModalNIP).toBeVisible();
      await deliveryPage.getInvoiceAddressModalNIP.fill('8140667487')

      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-133');

      await expect(deliveryPage.getInvoiceAddressModalUserCity).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Warszawa');

      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('aleja Jana Pawła II');

      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('10');

      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('12');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await page.waitForSelector('text=Testowa nazwa podmiotu', { timeout: 10000, state: 'visible' });
    })

    test('M | Możliwość wyboru podmiotu do faktury firmowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addCompanyInvoiceAddressDelivery }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura firmowa');
      await allure.allureId('653');

      test.setTimeout(150000);

      const targetAddress = page.getByText('Testowa nazwa podmiotu').locator('..').locator('..').locator('..').locator('..');
      
      await page.goto('/platnosc', { waitUntil: 'load' });

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      await page.waitForSelector('text="Chcę otrzymać fakturę"', { timeout: 30000, state: 'visible' });

      await paymentsPage.waitForLoader();

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await addCompanyInvoiceAddressDelivery('Fixturowy adres podmiotu');
      await addCompanyInvoiceAddressDelivery('Testowa nazwa podmiotu');

      await page.waitForSelector('text=Fixturowy adres podmiotu', { state: 'visible' });
      await page.waitForSelector('text=Testowa nazwa podmiotu', { state: 'visible' });

      await page.evaluate(async () => {
        window.scrollBy(0, 400)
        await new Promise(r => setTimeout(r, 700));
      })

      await page.getByText('Testowa nazwa podmiotu').click({ force: true, delay: 300 });

      await expect(targetAddress).toHaveCSS('border-bottom-color', 'rgb(78, 180, 40)', { timeout: 10000 });
    })

    test('M | Możliwość edycji podmiotu do faktury firmowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addCompanyInvoiceAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura firmowa');
      await allure.allureId('654');
      
      test.setTimeout(120000);

      await page.goto('/platnosc', { waitUntil: 'load' });

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();

      await addCompanyInvoiceAddressDelivery('Fixturowy adres podmiotu');

      await expect(commonPage.getMessage).toBeVisible({ timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await page.waitForSelector('text=Fixturowy adres podmiotu', { timeout: 5000, state: 'visible' });

      await deliveryPage.clickEditInvoiceAddressButton('Fixturowy adres podmiotu');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');
      await expect(deliveryPage.getInvoiceAddressTypeDropdown).toHaveText('Faktura firmowa');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Fixturowy adres podmiotu');
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Edytowana nazwa podmiotu');

      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toHaveValue('Testowa firma');
      await deliveryPage.getInvoiceAddressModalCompanyName.fill('Edytowana nazwa firmy');

      await expect(deliveryPage.getInvoiceAddressModalNIP).toHaveValue('8140667487');
      await deliveryPage.getInvoiceAddressModalNIP.fill('1085179548')

      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-828');
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-100');

      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Warszawa');
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Magdalenka');

      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('Edytowana ulica');

      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('1');
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('100');

      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('30');
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('200');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został zaktualizowany.', { timeout: 15000 })
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }
      
      await page.waitForSelector('text=Edytowana nazwa podmiotu', { timeout: 5000, state: 'visible' });

      await deliveryPage.clickEditInvoiceAddressButton('Edytowana nazwa podmiotu');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');
      await expect(deliveryPage.getInvoiceAddressTypeDropdown).toHaveText('Faktura firmowa');
      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Edytowana nazwa podmiotu')
      await expect(deliveryPage.getInvoiceAddressModalCompanyName).toHaveValue('Edytowana nazwa firmy');
      await expect(deliveryPage.getInvoiceAddressModalNIP).toHaveValue('1085179548');
      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-100');
      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Magdalenka');
      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('Edytowana ulica');
      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('100');
      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('200');
    })
    
    test('M | Możliwość usunięcia podmiotu do faktury firmowej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addCompanyInvoiceAddressDelivery }) => {
      
      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura firmowa');
      await allure.allureId('655');

      test.setTimeout(120000);
      
      await page.goto('/platnosc', { waitUntil: 'load' });

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await addCompanyInvoiceAddressDelivery('Edytowana nazwa podmiotu');

      await expect(commonPage.getMessage).toBeVisible({ timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await deliveryPage.getAddNewInvoiceAddressButton.scrollIntoViewIfNeeded();
      await deliveryPage.clickDeleteInvoiceAddressButton('Edytowana nazwa podmiotu');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 3000 });
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName('Edytowana nazwa podmiotu')).toContainText('Edytowana nazwa podmiotu');
      await expect(deliveryPage.getAddressModalCancelButton).toBeVisible();
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana nazwa podmiotu" został usunięty.', { timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await page.waitForSelector('text=Edytowana nazwa podmiotu', { strict: true , state: 'hidden' });
    })
  })

  test.describe('Faktura imienna', async () => {
    
    test('M | Możliwość dodania podmiotu do faktury imiennej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura imienna');
      await allure.allureId('3326');
      
      test.setTimeout(150000);
      
      await page.goto('/platnosc');

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await deliveryPage.getDeliveryInvoiceCheckbox.check({ force: true });
      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();
      await deliveryPage.clickAddNewInvoiceAddressButton();
      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Dodaj nowy podmiot');
      await deliveryPage.selectInvoiceAddressType('Faktura imienna');
      await expect(deliveryPage.getInvoiceAddressTypeDropdown).toHaveText('Faktura imienna');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toBeVisible();
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Testowa nazwa faktury imiennej');

      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressFirstName).toBeVisible();
      await deliveryPage.getPersonalInvoiceAddressModalAddressFirstName.fill('Jan');

      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressLastName).toBeVisible();
      await deliveryPage.getPersonalInvoiceAddressModalAddressLastName.fill('Kowalski');
  
      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-133');
  
      await expect(deliveryPage.getInvoiceAddressModalUserCity).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Warszawa');
  
      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('aleja Jana Pawła II');
  
      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('10');
  
      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toBeVisible();
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('12');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 15000 })

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await page.waitForSelector('text=Testowa nazwa faktury imiennej', { timeout: 10000, state: 'visible' });
    })

    test('M | Możliwość wyboru podmiotu do faktury imiennej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addPersonalInvoiceAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura imienna');
      await allure.allureId('3327');
      
      test.setTimeout(150000);

      const targetAddress = page.getByText('Testowa nazwa faktury imiennej').locator('..').locator('..').locator('..').locator('..');
      
      await page.goto('/platnosc');

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      await page.waitForSelector('text="Chcę otrzymać fakturę"', { timeout: 30000, state: 'visible' });

      await paymentsPage.waitForLoader();

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await addPersonalInvoiceAddressDelivery('Faktura imienna');
      await addPersonalInvoiceAddressDelivery('Testowa nazwa faktury imiennej');

      await page.waitForSelector('text=Faktura imienna', { state: 'visible' });
      await page.waitForSelector('text=Testowa nazwa faktury imiennej', { state: 'visible' });

      await page.getByText('Testowa nazwa faktury imiennej').click({ force: true, delay: 300 });

      await expect(targetAddress).toHaveCSS('border-bottom-color', 'rgb(78, 180, 40)', { timeout: 10000 });
    })

    test('M | Możliwość edycji podmiotu do faktury imiennej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addPersonalInvoiceAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura imienna');
      await allure.allureId('3328');
      
      test.setTimeout(120000);

      await page.goto('/platnosc');

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await deliveryPage.getDeliveryInvoiceCheckbox.check({ force: true });
      await deliveryPage.getDeliveryInvoiceCheckbox.isChecked();

      await addPersonalInvoiceAddressDelivery('Faktura imienna');

      await expect(commonPage.getMessage).toBeVisible({ timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await page.waitForSelector('text=Faktura imienna', { timeout: 5000, state: 'visible' });

      await deliveryPage.clickEditInvoiceAddressButton('Faktura imienna');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');

      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Faktura imienna');
      await deliveryPage.getInvoiceAddressModalAddressName.fill('Edytowana Faktura imienna');

      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressFirstName).toHaveValue('Jan');
      await deliveryPage.getPersonalInvoiceAddressModalAddressFirstName.fill('Janina');
  
      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressLastName).toHaveValue('Kowalski');
      await deliveryPage.getPersonalInvoiceAddressModalAddressLastName.fill('Kowalska');
  
      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-828');
      await deliveryPage.getInvoiceAddressModalUserPostalCode.fill('00-100');
  
      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Warszawa');
      await deliveryPage.getInvoiceAddressModalUserCity.fill('Magdalenka');
  
      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
      await deliveryPage.getInvoiceAddressModalUserStreet.fill('Edytowana ulica');
  
      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('1');
      await deliveryPage.getInvoiceAddressModalUserHouseNumber.fill('100');
  
      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('30');
      await deliveryPage.getInvoiceAddressModalUserFlatNumber.fill('200');

      await expect(deliveryPage.getAddressModalSaveButton).toBeVisible();
      await deliveryPage.clickSaveAdressModalButton();

      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana Faktura imienna" został zaktualizowany.', { timeout: 15000 })
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }
      
      await page.waitForSelector('text=Edytowana Faktura imienna', { timeout: 5000, state: 'visible' });

      await deliveryPage.clickEditInvoiceAddressButton('Edytowana Faktura imienna');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 10000 });
      await expect(deliveryPage.getAddressModal).toContainText('Edytuj podmiot');
      await expect(deliveryPage.getInvoiceAddressModalAddressName).toHaveValue('Edytowana Faktura imienna')
      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressFirstName).toHaveValue('Janina');
      await expect(deliveryPage.getPersonalInvoiceAddressModalAddressLastName).toHaveValue('Kowalska');
      await expect(deliveryPage.getInvoiceAddressModalUserPostalCode).toHaveValue('00-100');
      await expect(deliveryPage.getInvoiceAddressModalUserCity).toHaveValue('Magdalenka');
      await expect(deliveryPage.getInvoiceAddressModalUserStreet).toHaveValue('Edytowana ulica');
      await expect(deliveryPage.getInvoiceAddressModalUserHouseNumber).toHaveValue('100');
      await expect(deliveryPage.getInvoiceAddressModalUserFlatNumber).toHaveValue('200');
    })
    
    test('M | Możliwość usunięcia podmiotu do faktury imiennej', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addPersonalInvoiceAddressDelivery }) => {

      await allure.tags('Mobilne', 'Dostawa');
      await allure.epic('Mobilne');
      await allure.parentSuite('Dostawa');
      await allure.suite('Testy dostawy');
      await allure.subSuite('Faktura imienna');
      await allure.allureId('3329');

      test.setTimeout(120000);
      
      await page.goto('/platnosc');

      await expect(page.getByText('Potrzebujesz faktury do zamówienia?')).toBeVisible({ timeout: 10000 });

      const checkbox = deliveryPage.getDeliveryInvoiceCheckbox;
      let attempts = 0;
      const maxAttempts = 3;

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await addPersonalInvoiceAddressDelivery('Edytowana Faktura imienna');

      await expect(commonPage.getMessage).toBeVisible({ timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      await page.waitForSelector('text=Edytowana Faktura imienna', { timeout: 5000, state: 'visible' });

      await deliveryPage.clickDeleteInvoiceAddressButton('Edytowana Faktura imienna');

      await expect(deliveryPage.getAddressModal).toBeVisible({ timeout: 3000 });
      await expect(deliveryPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
      await expect(deliveryPage.getAddressModalDeleteAddressName('Edytowana Faktura imienna')).toContainText('Edytowana Faktura imienna');
      await expect(deliveryPage.getAddressModalCancelButton).toBeVisible();
      await expect(deliveryPage.getAddressModalConfirmationButton).toBeVisible();
      await deliveryPage.getAddressModalConfirmationButton.click();
      await expect(commonPage.getMessage).toHaveText('Adres "Edytowana Faktura imienna" został usunięty.', { timeout: 15000 });
      await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

      while (attempts < maxAttempts) {
        await checkbox.waitFor({ state: 'visible' });
        
        if (!(await checkbox.isChecked())) {
          await checkbox.click({ force: true, delay: 1000 });
          console.log(`Próba ${attempts + 1}: Zaznaczono checkbox`);
        } else {
          console.log(`Próba ${attempts + 1}: Checkbox już zaznaczony`);
        }
        
        attempts++;
      }

      await page.waitForSelector('text=Edytowana Faktura imienna', { strict: true , state: 'hidden' });
    })
  })
})