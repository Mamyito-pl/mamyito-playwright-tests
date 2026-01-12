import { expect } from '@playwright/test';
import NonLoggedUserPage from '../../page/NonLoggedUser.page.ts';
import MainPage from '../../page/Main.page.ts';
import MenuCategoriesPage from "../../page/MenuCategories.page";
import SearchbarPage from '../../page/Searchbar.page.ts';
import CartPage from '../../page/Cart.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods.ts';
import CommonPage from '../../page/Common.page.ts';
import * as selectors from '../../utils/selectors.json';

test.describe('Testy niezalogowanego użytkownika', async () => {

  let nonLoggedUserPage: NonLoggedUserPage;
  let mainPage: MainPage;
  let menuCategoriesPage: MenuCategoriesPage;
  let searchbarPage: SearchbarPage;
  let cartPage: CartPage;
  let commonPage: CommonPage;
  let product = 'janex polędwica wołowa';

  test.use({ storageState: { cookies: [], origins: [] }})
  test.beforeEach(async ({ page }) => {
    
    await utility.gotoWithRetry(page, '/');

    await page.waitForTimeout(4000);

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    nonLoggedUserPage = new NonLoggedUserPage(page);
    mainPage = new MainPage(page);
    menuCategoriesPage = new MenuCategoriesPage(page);
    searchbarPage = new SearchbarPage(page);
    cartPage = new CartPage(page);
    commonPage = new CommonPage(page)
  })

  test.afterEach(async ({ clearCartViaAPI }) => {
    await clearCartViaAPI();
  }) 

  test('W | Strona główna otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2527');

    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 3000);
    await page.waitForTimeout(1500);
    await page.mouse.wheel(0, 5000);
    await page.waitForTimeout(1500);

    await expect(mainPage.getLogo).toBeVisible();
    await expect(searchbarPage.getSearchbarInput).toBeVisible()
    await expect(nonLoggedUserPage.getDeliveryAvailableLink).toBeVisible();
    await expect(nonLoggedUserPage.getLoginLink).toBeVisible();
    await expect(nonLoggedUserPage.getRegisterLink).toBeVisible();
    await expect(mainPage.getAboutDeliveryButton).toBeVisible();

    await expect(menuCategoriesPage.getMenuCategoriesButton).toBeVisible();
    await expect(mainPage.getStrefaMamityButton).toBeVisible();
    await expect(mainPage.getDiscountsButton).toBeVisible();
    await expect(mainPage.getNewProductsButton).toBeVisible();
    await expect(mainPage.getBestsellersButton).toBeVisible();
    await expect(mainPage.getPaymentMethodsButton).toBeVisible();

    await expect(mainPage.getBanerSlider).toBeVisible();

    await expect(mainPage.getSectionTitle('Promocje')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('promocje')).toBeVisible();
    await expect(mainPage.getDiscountsSection).toBeVisible();

    await mainPage.getSectionShowAllLink('bestsellery').scrollIntoViewIfNeeded();
    await expect(mainPage.getSectionTitle('Bestsellery')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('bestsellery')).toBeVisible();
    await expect(mainPage.getBestsellersSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Kategorie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('kategorie')).toBeVisible();
    await expect(mainPage.getCategoriesSection).toBeVisible();

    await expect(mainPage.getSectionTitle('Nowości')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('nowosci')).toBeVisible();
    await expect(mainPage.getNewProductsSection).toBeVisible();

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
  })
  
  test('W | Po dodaniu do koszyka produktu wyświetla się modal z dodaniem kodu pocztowego', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2528');

    await expect(mainPage.getDiscountsSection).toBeVisible();
    await page.locator('[data-cy="promocje-products-list-slider"] div[data-sentry-element="ButtonWrapper"]').first().click();
    await page.waitForTimeout(2000);

    await expect(nonLoggedUserPage.getPostalCodeModalTitle).toBeVisible({ timeout: 15000 });
  }) 

  test('W | Po dodaniu do koszyka produktów na wartość >150 i przejściu dalej z koszyka pojawia się modal z logowaniem', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2529');

    test.setTimeout(120000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct(product);
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });
    await page.locator(selectors.Searchbar.common.productSearchAddButton).first().click({ force: true, delay: 300 });
    await page.waitForTimeout(4000);

    await expect(nonLoggedUserPage.getPostalCodeModalTitle).toBeVisible({ timeout: 15000 });
    await nonLoggedUserPage.getPostalCodeModalInput.fill('00-828');
    await page.waitForTimeout(1000);
    await expect(nonLoggedUserPage.getPostalCodeModalButton).toBeEnabled({ timeout: 15000 });
    await nonLoggedUserPage.clickPostalCodeModalButton();
    await expect(nonLoggedUserPage.getPostalCodeModalTitle).not.toBeVisible({ timeout: 15000 });
    
    await searchbarPage.getProductItemCount.first().type('1');
    await page.waitForTimeout(1000);
    await commonPage.getCartButton.click();
    await page.waitForTimeout(1000);
    await expect(cartPage.getCartDrawerToCartButton).toBeVisible({ timeout: 10000 });
    await cartPage.clickCartDrawerToCartButton();
    await page.waitForLoadState();
    await page.waitForSelector(selectors.CartPage.common.productCartList, { timeout: 15000 });
    await page.waitForTimeout(2000);
    await cartPage.clickCartSummaryButton();

    await expect(nonLoggedUserPage.getLoginModalTitle).toBeVisible({ timeout: 10000 });
  })
  
  test('W | Alkoholowy produkt jest jako zablurowany', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2530');

    test.setTimeout(120000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct('wódka');
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });

    const searchedProductBlur = page.locator('div[data-sentry-element="WebContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"] div[data-sentry-element="Wrapper"]').first();
    const attachedAttribute = page.locator('div[data-sentry-element="WebContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"] img[alt="poniżej 18 lat"]').first();

    const filterValue = await searchedProductBlur.evaluate(el => getComputedStyle(el).filter);

    await expect(attachedAttribute).toBeVisible();
    expect(filterValue).toContain('blur(7px)');
  })

  test('W | Wyświetlony produkt alkoholowy ma napis "Potwierdź datę urodzenia"', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2531');

    test.setTimeout(120000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct('wódka');
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });

    await expect(searchbarPage.getSearchbarProductTiles.locator('div').first()).toHaveText('Potwierdź datę urodzenia', { timeout: 15000 });
  })

  test('W | Po kliknięciu na produkt alkoholowy wyświetla się modal z logowaniem', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Web', 'Niezalogowany użytkownik');
    await allure.epic('Webowe');
    await allure.parentSuite('Niezalogowany użytkownik');
    await allure.suite('Testy niezalogowanego użytkownika');
    await allure.subSuite('');
    await allure.allureId('2532');

    test.setTimeout(120000);

    await searchbarPage.getSearchbarInput.click();
    await page.waitForTimeout(1000);
    await searchbarPage.enterProduct('wódka');
    await expect(commonPage.getLoader).toBeHidden({ timeout: 15000 });

    await searchbarPage.getSearchbarProductTiles.first().click();
    await expect(nonLoggedUserPage.getLoginModalTitle).toBeVisible({ timeout: 10000 });
  })
})

