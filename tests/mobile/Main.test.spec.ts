import { expect } from '@playwright/test';
import MainPage from '../../page/Main.page.ts';
import MenuCategoriesPage from "../../page/MenuCategories.page.ts";
import SearchbarPage from '../../page/Searchbar.page.ts';
import CartPage from '../../page/Cart.page.ts';
import ProductsListPage from '../../page/ProductsList.page.ts';
import ProductsCategoriesPage from '../../page/ProductsCategories.page.ts';
import FavouritesPage from '../../page/Profile/Favourites.page.ts';
import CommonPage from '../../page/Common.page.ts';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';
import * as utility from '../../utils/utility-methods.ts';

test.setTimeout(120000);

test.describe('Testy strony głównej', async () => {

  let mainPage: MainPage;
  let menuCategoriesPage: MenuCategoriesPage;
  let searchbarPage: SearchbarPage;
  let cartPage: CartPage;
  let productsListPage: ProductsListPage;
  let productsCategoriesPage: ProductsCategoriesPage;
  let favouritesPage: FavouritesPage;
  let commonPage: CommonPage;

  test.beforeEach(async ({ page }) => {
    
    await utility.gotoWithoutParameter(page, '/');

    await page.waitForTimeout(4000);

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });

    mainPage = new MainPage(page);
    menuCategoriesPage = new MenuCategoriesPage(page);
    searchbarPage = new SearchbarPage(page);
    cartPage = new CartPage(page);
    productsListPage = new ProductsListPage(page)
    productsCategoriesPage = new ProductsCategoriesPage(page)
    favouritesPage = new FavouritesPage(page)
    commonPage = new CommonPage(page)
  })

  test('M | Strona główna otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1261');

    await page.evaluate(async () => {
      window.scrollBy(0, 1000)
      await new Promise(r => setTimeout(r, 1500));
      window.scrollBy(0, 1000)
      await new Promise(r => setTimeout(r, 1500));
      window.scrollBy(0, 1000)
      await new Promise(r => setTimeout(r, 1500));
      window.scrollBy(0, 1000)
      await new Promise(r => setTimeout(r, 1500));
    })

    await expect(mainPage.getLogo).toBeVisible();
    await expect(mainPage.getDeliveryButton).toBeVisible();
    await expect(mainPage.getProfileButton).toBeVisible();
    await expect(mainPage.getFavouritesButton).toBeVisible();
    await expect(cartPage.getCartDrawerButton).toBeVisible();

    await expect(menuCategoriesPage.getMenuCategoriesButton).toBeVisible();
    await expect(searchbarPage.getSearchbarInput).toBeVisible()

    await mainPage.getStrefaMamityButton.scrollIntoViewIfNeeded();
    await expect(mainPage.getStrefaMamityButton).toBeVisible();
    await mainPage.getDiscountsButton.scrollIntoViewIfNeeded();
    await expect(mainPage.getDiscountsButton).toBeVisible();
    await mainPage.getNewProductsButton.scrollIntoViewIfNeeded();
    await expect(mainPage.getNewProductsButton).toBeVisible();
    await mainPage.getBestsellersButton.scrollIntoViewIfNeeded();
    await expect(mainPage.getBestsellersButton).toBeVisible();

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

    await expect(mainPage.getSectionTitle('Najczęściej kupowane przez Ciebie')).toBeVisible();
    await expect(mainPage.getSectionShowAllLink('najczesciej-kupowane')).toBeVisible();
    await expect(mainPage.getRecentlyBoughtSection).toBeVisible();

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
  })

  test('M | Możliwość przewijania slidera promocji', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1262');
    
    const firstItemInSlider = page.locator('[data-cy="promocje-product-card-slider"]').first()

    await mainPage.getSectionGetLeftButton.nth(0).isDisabled();
    await mainPage.getSectionGetRightButton.nth(0).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).not.toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(0).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(0).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(0).isDisabled();
  })
  
  test('M | Możliwość przejścia do promocji poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1263');

    await mainPage.getSectionShowAllLink('promocje').click();
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(page.locator('div[data-sentry-element="TitleMobile"]:has-text("Promocje")')).toBeVisible({ timeout: 10000 });
  })
  
  test('M | Możliwość przewijania slidera bestsellery', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1264');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 650)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(1200);
    }

    const firstItemInSlider = page.locator('[data-cy="bestsellery-product-card-slider"]').first()

    await mainPage.getBestsellersSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionGetLeftButton.nth(1).isDisabled();
    await mainPage.getSectionGetRightButton.nth(1).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).not.toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(1).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(1).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(1).isDisabled();
  })
  
  test('M | Możliwość przejścia do bestsellerów poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1265');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 700)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(1200);
    }

    await mainPage.getBestsellersSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionShowAllLink('bestsellery').click();
    await expect(page).toHaveURL(`${baseURL}` + '/bestsellery', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nasze bestsellery')).toBeVisible({ timeout: 10000 });
  })
    
  test('M | Możliwość przewijania slidera kategorii', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1266');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1250)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 300)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1500);      
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1500);
    }
    
    const firstItemInSlider = page.locator('div[data-sentry-component="CategoriesSection"] section a[rel="nofollow"]').first()

    await mainPage.getCategoriesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionGetLeftButton.nth(3).isDisabled();
    await mainPage.getSectionGetRightButton.nth(3).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).not.toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(3).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(3).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(3).isDisabled();
  })
  
  test('M | Możliwość przejścia do wszystkich kategorii poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1267');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1250)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 300)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1500);      
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1500);
    }

    await mainPage.getCategoriesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionShowAllLink('kategorie').click();
    await expect(page).toHaveURL(`${baseURL}` + '/kategorie', { timeout: 10000 });
    await expect(productsCategoriesPage.getProductsCategoriesTitle).toBeVisible();
  })

  test('M | Możliwość przejścia do wybranej kategorii ze slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1268');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1250)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 300)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1200);      
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1500);
    }

    const firstItemInSlider = page.locator('div[data-sentry-component="CategoriesSection"] section a[rel="nofollow"]').first();
    const itemLink = await firstItemInSlider.getAttribute('href');
    const itemName = await firstItemInSlider.last().innerText();
    const modifiedItemName = itemName.length > 1 ? itemName.slice(1, -1) : '';

    await mainPage.getCategoriesSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await firstItemInSlider.click();
    await expect(page).toHaveURL(`${baseURL}` + itemLink, { timeout: 10000 });
    await expect(page.locator(`div[data-sentry-element="TitleMobile"]:has-text("${modifiedItemName}")`)).toBeVisible({ timeout: 10000 });
  })

  test('M | Możliwość przewijania slidera nowości', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1269');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async() => {
        window.scrollBy(0, 1550)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 700)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(1200);
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(1200);
    }

    const firstItemInSlider = page.locator('[data-cy="nowosci-product-card-slider"]').first()

    await mainPage.getNewProductsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionGetLeftButton.nth(4).isDisabled();
    await mainPage.getSectionGetRightButton.nth(4).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).not.toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(4).isEnabled();
    await mainPage.getSectionGetLeftButton.nth(4).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(4).isDisabled();
  })
  
  test('M | Możliwość przejścia do nowości poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1270');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1550)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 500)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(1200);
      await page.mouse.wheel(0, 500);
      await page.waitForTimeout(1200);
    }

    await mainPage.getNewProductsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionShowAllLink('nowosci').click();
    await expect(page).toHaveURL(`${baseURL}` + '/nowosci', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nowości')).toBeVisible({ timeout: 10000 });
  })

  test('M | Możliwość przewijania slidera najczęściej kupowanych produktów', { tag: ['@Prod', '@Test'] }, async ({ page, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1271');
    
    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1850)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 1200)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1550);
      await page.waitForTimeout(1200);
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1200);
    }

    const firstItemInSlider = page.locator('#most_frequently_bought div[data-sentry-component="ProductCard"]').first()

    await mainPage.getNewProductsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await expect(mainPage.getSectionGetRightButton.nth(5)).toBeEnabled();
    await mainPage.getSectionGetRightButton.nth(5).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).not.toBeInViewport({ timeout: 5000 });
    await mainPage.getSectionGetLeftButton.nth(5).click({ force: true, delay: 300 });
    await expect(firstItemInSlider).toBeInViewport({ timeout: 5000 });
  })
  
  test('M | Możliwość przejścia do najczęściej kupowanych produktów poprzez link slidera', { tag: ['@Prod', '@Test'] }, async ({ page, baseURL, browser }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1272');

    const project = browser.browserType().name();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1850)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 1200)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1550);
      await page.waitForTimeout(1200);
      await page.mouse.wheel(0, 1200);
      await page.waitForTimeout(1200);
    }

    await mainPage.getNewProductsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(2000);

    await mainPage.getSectionShowAllLink('najczesciej-kupowane').click();
    await page.waitForLoadState();
    await expect(page).toHaveURL(`${baseURL}` + '/najczesciej-kupowane', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Najcześciej kupowane przez Ciebie')).toBeVisible({ timeout: 15000 });
  })

  test('M | Możliwość przejścia do "Strefa Niskich Cen" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1273');

    await mainPage.getStrefaMamityButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/strefa-mamity', { timeout: 10000 });
    await expect(page.locator('div[data-sentry-element="TitleMobile"]:has-text("Strefa Niskich Cen")')).toBeVisible({ timeout: 15000 });
  })
    
  test('M | Możliwość przejścia do "Promocje" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1274');

    await mainPage.getDiscountsButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/promocje', { timeout: 10000 });
    await expect(page.locator('div[data-sentry-element="TitleMobile"]:has-text("Promocje")')).toBeVisible({ timeout: 15000 });
  })
    
  test('M | Możliwość przejścia do "Nowości" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1275');

    await mainPage.getNewProductsButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/nowosci', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nowości')).toBeVisible({ timeout: 15000 });
  })
      
  test('M | Możliwość przejścia do "Bestsellery" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1276');

    await mainPage.getBestsellersButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/bestsellery', { timeout: 10000 });
    await expect(productsListPage.getSpecialProductCategoryTitle('Nasze bestsellery')).toBeVisible({ timeout: 15000 });
  })
  
  test('M | Możliwość przejścia do "Ulubione" poprzez przycisk menu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1277');

    await mainPage.getFavouritesButton.click()
    await expect(page).toHaveURL(`${baseURL}` + '/profil/ulubione', { timeout: 10000 });
    await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible({ timeout: 15000 });
  })

  test('M | Możliwość zapisania się do newslettera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, browser, newsletterSignOutViaAPI }) => {

    await allure.tags('Mobilne', 'Strona główna');
    await allure.epic('Mobilne');
    await allure.parentSuite('Strona główna');
    await allure.suite('Testy strony głównej');
    await allure.subSuite('');
    await allure.allureId('1505');

    const userEmail = `${process.env.EMAIL}`

    const project = browser.browserType().name();

    await newsletterSignOutViaAPI();

    if (project === 'webkit') {
      await page.evaluate(async () => {
        window.scrollBy(0, 1550)
        await new Promise(r => setTimeout(r, 1500));
        window.scrollBy(0, 1700)
        await new Promise(r => setTimeout(r, 1500));
      });
    } else {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(1200);
      await page.mouse.wheel(0, 1700);
      await page.waitForTimeout(1200);
    }

    await expect(mainPage.getNewsletterSection).toBeVisible();
    await expect(mainPage.getNewsletterInput).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeVisible();
    await expect(mainPage.getNewsletterSubscribeButton).toBeDisabled();
    await expect(mainPage.getNewsletterCheckbox).toBeVisible();
    expect(mainPage.getNewsletterCheckbox).not.toBeChecked;

    await mainPage.getNewsletterInput.fill(userEmail);
    await expect(mainPage.getNewsletterInput).toHaveValue(userEmail);
    await mainPage.getNewsletterCheckbox.check();
    await expect(mainPage.getNewsletterCheckbox).toBeChecked();
    await expect(mainPage.getNewsletterSubscribeButton).toBeEnabled();
    await mainPage.getNewsletterSubscribeButton.click();
    await expect(commonPage.getMessage).toHaveText('Pomyślnie zapisano do newslettera', { timeout: 15000 })
  })
})

