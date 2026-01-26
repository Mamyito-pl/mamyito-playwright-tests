import { expect } from '@playwright/test';
import CommonPage from "../../../page/Common.page.ts";
import MainPage from '../../../page/Main.page.ts';
import DeliveryAddressesPage from '../../../page/Profile/DeliveryAddresses.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../../fixtures/fixtures.ts';
import * as utility from '../../../utils/utility-methods';

test.describe.configure({ mode: 'serial'})

test.describe('Testy adresy dostaw', async () => {

  let commonPage: CommonPage;
  let deliveryAddressesPage : DeliveryAddressesPage;
  let mainPage: MainPage;

  test.beforeEach(async ({ page }) => {

    await utility.gotoWithoutParameter(page, '/');
    
    await page.waitForTimeout(4000);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    commonPage = new CommonPage(page);
    deliveryAddressesPage = new DeliveryAddressesPage(page);
    mainPage = new MainPage(page);
  })
  
  test('W | Strona adresy dostaw pojawia się ze wszystkimi potrzebnymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('919');
    
    await utility.gotoWithRetry(page, 'profil/adresy-dostaw');

    await expect(deliveryAddressesPage.getDeliveryAddressesTitle).toBeVisible();
    await expect(deliveryAddressesPage.getAddNewAddressButton).toBeVisible();
  })

  test('W | Możliwość dodania adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('920');

    test.setTimeout(150000);
    
    await utility.gotoWithRetry(page, 'profil/adresy-dostaw');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await deliveryAddressesPage.getDeliveryAddressesTitle.waitFor({ state: 'visible', timeout: 10000 });

    await deliveryAddressesPage.clickAddNewAddressButton();
    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Dodaj nowy adres');

    await expect(deliveryAddressesPage.getAddressModalAddressName).toBeVisible();
    await deliveryAddressesPage.getAddressModalAddressName.fill('Adres Testowy');

    await expect(deliveryAddressesPage.getAddressModalUserName).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserName.fill('Jan');

    await expect(deliveryAddressesPage.getAddressModalUserSurname).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserSurname.fill('Kowalski')

    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserPhoneNumber.fill('555666777');

    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserPostalCode.fill('00-133');

    await expect(deliveryAddressesPage.getAddressModalUserCity).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserCity.fill('Warszawa');

    await expect(deliveryAddressesPage.getAddressModalUserStreet).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserStreet.fill('aleja Jana Pawła II');

    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserHouseNumber.fill('20');

    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserStaircase.fill('1');

    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserFlatNumber.fill('30');

    await expect(deliveryAddressesPage.getAddressModalUserFloor).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserFloor.fill('2');
                                                                                      
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toBeVisible();
    await deliveryAddressesPage.getAddressModalUserDeliveryNotes.fill('Testowa notatka')

    await expect(deliveryAddressesPage.getAddressModalSaveButton).toBeVisible();
    await deliveryAddressesPage.clickSaveAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Dane zostały zapisane', { timeout: 15000 })

    await page.waitForSelector('text=Adres Testowy', { state: 'visible' });
  })

  test('W | Możliwość ustawienia głównego adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addAddressDelivery }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('921');

    test.setTimeout(120000);
    
    await utility.gotoWithRetry(page, 'profil/adresy-dostaw');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await addAddressDelivery('Adres Testowy');
    await addAddressDelivery('Adres Fixturowy');

    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.check();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isChecked();
    await deliveryAddressesPage.clickSaveAdressModalButton();
    await deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy').isVisible();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy')).toHaveText('Główny', { timeout: 20000 });
    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');
    await deliveryAddressesPage.getCurrentMainAddressModalInfo.isVisible();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isHidden();
    await deliveryAddressesPage.clickCancelAdressModalButton();

    await deliveryAddressesPage.clickEditAddressButton('Adres Testowy');
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.check();
    await deliveryAddressesPage.getAddressModalMainAddressCheckbox.isChecked();
    await deliveryAddressesPage.clickSaveAdressModalButton();
    await deliveryAddressesPage.getMainAddressInfo('Adres Testowy').isVisible();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Testowy')).toHaveText('Główny', { timeout: 20000 });
    await deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy').isHidden();
    await expect(deliveryAddressesPage.getMainAddressInfo('Adres Fixturowy')).not.toBeAttached();
  })

  test('W | Możliwość edycji adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addAddressDelivery }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('922');

    test.setTimeout(100000);

    await utility.gotoWithRetry(page, 'profil/adresy-dostaw');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await addAddressDelivery('Adres Fixturowy');
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await page.getByText('Adres Fixturowy').click({ force: true, delay: 300 });

    await deliveryAddressesPage.clickEditAddressButton('Adres Fixturowy');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Edytuj adres');

    await expect(deliveryAddressesPage.getAddressModalAddressName).toHaveValue('Adres Fixturowy')
    await deliveryAddressesPage.getAddressModalAddressName.fill('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModalUserName).toHaveValue('Jan');
    await deliveryAddressesPage.getAddressModalUserName.fill('Jan1');

    await expect(deliveryAddressesPage.getAddressModalUserSurname).toHaveValue('Kowalski');
    await deliveryAddressesPage.getAddressModalUserSurname.fill('Kowalski1');

    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toHaveValue('555666777');
    await deliveryAddressesPage.getAddressModalUserPhoneNumber.fill('777666555');

    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toHaveValue('00-828');
    await deliveryAddressesPage.getAddressModalUserPostalCode.fill('05-506');

    await expect(deliveryAddressesPage.getAddressModalUserCity).toHaveValue('Warszawa');
    await deliveryAddressesPage.getAddressModalUserCity.fill('Lesznowola');

    await expect(deliveryAddressesPage.getAddressModalUserStreet).toHaveValue('aleja Jana Pawła II');
    await deliveryAddressesPage.getAddressModalUserStreet.fill('Oficerska');

    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toHaveValue('1');
    await deliveryAddressesPage.getAddressModalUserHouseNumber.fill('4');

    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toHaveValue('1');
    await deliveryAddressesPage.getAddressModalUserStaircase.fill('2');

    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toHaveValue('30');
    await deliveryAddressesPage.getAddressModalUserFlatNumber.fill('3');

    await expect(deliveryAddressesPage.getAddressModalUserFloor).toHaveValue('2');
    await deliveryAddressesPage.getAddressModalUserFloor.fill('4');
                                                                                      
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toHaveValue('Testowa notatka');
    await deliveryAddressesPage.getAddressModalUserDeliveryNotes.fill('Edytowana testowa notatka')

    await expect(deliveryAddressesPage.getAddressModalSaveButton).toBeVisible();
    await deliveryAddressesPage.clickSaveAdressModalButton();

    await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został zaktualizowany.', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await deliveryAddressesPage.clickEditAddressButton('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Edytuj adres');
    await expect(deliveryAddressesPage.getAddressModalAddressName).toHaveValue('Adres Edytowany')
    await expect(deliveryAddressesPage.getAddressModalUserName).toHaveValue('Jan1');
    await expect(deliveryAddressesPage.getAddressModalUserSurname).toHaveValue('Kowalski1');
    await expect(deliveryAddressesPage.getAddressModalUserPhoneNumber).toHaveValue('777666555');
    await expect(deliveryAddressesPage.getAddressModalUserPostalCode).toHaveValue('05-506');
    await expect(deliveryAddressesPage.getAddressModalUserCity).toHaveValue('Lesznowola');
    await expect(deliveryAddressesPage.getAddressModalUserStreet).toHaveValue('Oficerska');
    await expect(deliveryAddressesPage.getAddressModalUserHouseNumber).toHaveValue('4');
    await expect(deliveryAddressesPage.getAddressModalUserStaircase).toHaveValue('2');
    await expect(deliveryAddressesPage.getAddressModalUserFlatNumber).toHaveValue('3');
    await expect(deliveryAddressesPage.getAddressModalUserFloor).toHaveValue('4');
    await expect(deliveryAddressesPage.getAddressModalUserDeliveryNotes).toHaveValue('Edytowana testowa notatka');
  })
  
  test('W | Możliwość usunięcia adresu dostawy', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, addAddressDelivery }) => {

    await allure.tags('Web', 'Profil');
    await allure.epic('Webowe');
    await allure.parentSuite('Profil');
    await allure.suite('Testy adresy dostaw');
    await allure.subSuite('');
    await allure.allureId('923');

    test.setTimeout(150000);

    await utility.gotoWithRetry(page, 'profil/adresy-dostaw');

    await expect(mainPage.getProfileButton).toBeVisible({ timeout: 10000 });
    await page.waitForTimeout(1000);

    await addAddressDelivery('Adres Edytowany');
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await deliveryAddressesPage.clickDeleteAddressButton('Adres Edytowany');

    await expect(deliveryAddressesPage.getAddressModal).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModal).toContainText('Potwierdź usunięcie adresu');
    await expect(deliveryAddressesPage.getAddressModalDeleteAddressName('Adres Edytowany')).toContainText('Adres Edytowany');
    await expect(deliveryAddressesPage.getAddressModalCancelButton).toBeVisible();
    await expect(deliveryAddressesPage.getAddressModalConfirmationButton).toBeVisible();
    await deliveryAddressesPage.getAddressModalConfirmationButton.click();
    await expect(commonPage.getMessage).toHaveText('Adres "Adres Edytowany" został usunięty.', { timeout: 15000 })
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await page.waitForSelector('text=Adres Edytowany', { strict: true , state: 'hidden' });
  })

  test.afterEach(async ({ deleteDeliveryAddressViaAPI }) => {

    await deleteDeliveryAddressViaAPI('Adres Testowy');
    await deleteDeliveryAddressViaAPI('Adres Fixturowy');
    await deleteDeliveryAddressViaAPI('Adres Edytowany');
  })
})
