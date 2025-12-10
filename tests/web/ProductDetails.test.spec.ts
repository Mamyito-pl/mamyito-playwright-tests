import { expect } from '@playwright/test';
import ProductDetailsPage from '../../page/ProductDetails.page.ts';
import FavouritesPage from '../../page/Profile/Favourites.page.ts';
import ProductsListPage from "../../page/ProductsList.page.ts";
import SearchbarPage from '../../page/Searchbar.page.ts';
import BrandPage from '../../page/Brand.page.ts';
import MainPage from '../../page/Main.page.ts';
import CommonPage from '../../page/Common.page.ts';
import CartPage from '../../page/Cart.page.ts';
import * as utility from '../../utils/utility-methods';
import * as allure from "allure-js-commons";
import { test } from '../../fixtures/fixtures.ts';

test.describe.configure({ mode: 'serial' })

test.describe('Testy szczegółów produktu', async () => {

  let productDetailsPage: ProductDetailsPage;
  let favouritesPage: FavouritesPage;
  let productsListPage: ProductsListPage;
  let searchbarPage: SearchbarPage;
  let brandPage: BrandPage;
  let mainPage: MainPage;
  let commonPage: CommonPage;
  let cartPage: CartPage;

  const productToSearchName = 'woda mineralna szkło'

  test.beforeEach(async ({ page }) => {

    productDetailsPage = new ProductDetailsPage(page);
    favouritesPage = new FavouritesPage(page);
    productsListPage = new ProductsListPage(page);
    searchbarPage = new SearchbarPage(page);
    brandPage = new BrandPage(page);
    mainPage = new MainPage(page);
    commonPage = new CommonPage(page);
    cartPage = new CartPage(page);

    await utility.gotoWithRetry(page, '/');

    await utility.addGlobalStyles(page);

    page.on('framenavigated', async () => {
      await utility.addGlobalStyles(page);
    });
  })

  test.afterEach(async ({ clearCartViaAPI }) => {
    
    await cartPage.clickCartDrawerButton();
    await clearCartViaAPI();
  }) 

  test('W | Strona produktu otwiera się ze wszystkimi wymaganymi polami', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1855');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover({ force: true });

    const productBrandName = await searchbarPage.getSearchbarProductBrandNames.first().allTextContents();
    const productName = await searchbarPage.getSearchbarProductNames.first().allTextContents();
    const productGrammar = await searchbarPage.getSearchbarProductGrammars.first().allTextContents();
    const productPricePerGrammar = await searchbarPage.getSearchbarProductPricePerGrammar.first().allTextContents();
    const productPrice = await searchbarPage.getProductPrices.first().allTextContents();
    const productSetFirstQuantityButton = await page.locator('div[data-testid="search-results"] div[data-sentry-element="ProductSets"] button').first().allTextContents();
    const productSetSecondQuantityButton = await page.locator('div[data-testid="search-results"] div[data-sentry-element="ProductSets"] button').nth(1).allTextContents();
    
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const newProductBrandName = await productDetailsPage.getProductBrandName.first().allTextContents();
    const newProductName = await productDetailsPage.getProductName.first().allTextContents();
    const newProductGrammar = await productDetailsPage.getProductGrammar.first().allTextContents();
    const newProductPricePerGrammar = await productDetailsPage.getProductPricePerGrammar.first().allTextContents();
    const newProductPrice = await productDetailsPage.getProductPrice.allTextContents();
    const productNewSetFirstQuantityButton = await productDetailsPage.getSetFirstQuantityButton.allTextContents();
    const productNewSetSecondQuantityButton = await productDetailsPage.getSetSecondQuantityButton.allTextContents();

    const formattedNewProductPrice = newProductPrice[0].replace(/\s+/g, '');
    const formattedProductPrice = productPrice[0].replace(/\s+/g, '');
    const formattedNewProductSetFirstQuantityButton = productNewSetFirstQuantityButton[0];
    const formattedNewProductSetSecondQuantityButton = productNewSetSecondQuantityButton[0];
    
    expect(newProductBrandName).toEqual(productBrandName);
    expect(newProductName[0]).toContain(productName[0]);
    expect(newProductGrammar).toEqual(productGrammar);
    expect(newProductPricePerGrammar).toEqual(productPricePerGrammar);
    expect(formattedNewProductPrice).toContain(formattedProductPrice);
    expect(productSetFirstQuantityButton[0]).toEqual(formattedNewProductSetFirstQuantityButton);
    expect(productSetSecondQuantityButton[0]).toEqual(formattedNewProductSetSecondQuantityButton);

    await expect(productDetailsPage.getProductActualPriceTitle).toBeVisible();
    await expect(productDetailsPage.getAddProductButton).toBeVisible();
    await expect(productDetailsPage.getMainInfoProductDropdown).toBeVisible();
    await expect(productDetailsPage.getPackagingInfoDropdown).toBeVisible();
    await expect(productDetailsPage.getProductDescriptionTitle).toBeVisible();
    await expect(productDetailsPage.getOtherProductsFromThisCategorySection).toBeVisible();
    await expect(productDetailsPage.getOtherProductsFromThisCategorySectionTitle).toBeVisible();
    await expect(productDetailsPage.getSectionShowAllLink).toBeVisible();
  })
  
  test('W | Możliwość dodania jednej sztuki produktu do koszyka', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1856');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover({ force: true });
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    const productPrice = await productDetailsPage.getProductPrice.first().textContent();
    const formattedProductPrice = productPrice?.slice(0, -9);

    await expect(productDetailsPage.getSetFirstQuantityButton.locator('div')).toHaveAttribute('data-cy', 'product-page-quantity-jump-icon');
    expect(productDetailsPage.getSetFirstQuantityButton.locator('div')).toBeVisible();
    await productDetailsPage.clickAddProductButton();

    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');
    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    await expect(commonPage.getCartProductsCount).toHaveText('1');
    await expect(commonPage.getCartProductsPrice).toHaveText(formattedProductPrice || '');
  })
      
  test('W | Możliwość dodania wielosztuk produktu do koszyka', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1857');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    const secondQuantityButtonText = await productDetailsPage.getSetSecondQuantityButton.textContent();
    const formattedSecondQuantityButtonText = secondQuantityButtonText?.slice(0, -5);

    await productDetailsPage.getSetSecondQuantityButton.click();
    await expect(productDetailsPage.getSetSecondQuantityButton.locator('div')).toHaveAttribute('data-cy', 'product-page-quantity-jump-icon');
    expect(productDetailsPage.getSetSecondQuantityButton.locator('div')).toBeVisible();
    
    const productPrice = await productDetailsPage.getProductPrice.first().textContent();

    let formattedProductPrice: string | undefined = '';

    if (productPrice) {
        if (secondQuantityButtonText) {
            formattedProductPrice = secondQuantityButtonText.length > 6
            ? productPrice.slice(0, -9) : productPrice.slice(0, -8);
        } else {
            formattedProductPrice = productPrice;
        }
    }

    await productDetailsPage.clickAddProductButton();

    await expect(productDetailsPage.getProductItemCount).toHaveValue(formattedSecondQuantityButtonText || '');
    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    await expect(commonPage.getCartProductsCount).toHaveText('1');
    await expect(commonPage.getCartProductsPrice).toHaveText(formattedProductPrice || '');
  })
        
  test('W | Możliwość zmniejszenia ilości produktu z poziomu szczegółów produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1858');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    await productDetailsPage.clickAddProductButton();

    await page.waitForTimeout(1000);

    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();

    for (let i = 0; i < 2; i++) {
      await productDetailsPage.getIncreaseProductButton.click();
      await page.waitForTimeout(1000);
    }
    
    await expect(productDetailsPage.getProductItemCount).toHaveValue('3');

    for (let i = 0; i < 2; i++) {
      await productDetailsPage.getDecreaseProductButton.click();
      await page.waitForTimeout(1000);
    }
    
    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');
  })
     
  test('W | Możliwość usunięcia produktu z poziomu szczegółów produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1859');

    test.setTimeout(100000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    await productDetailsPage.clickAddProductButton();

    await page.waitForTimeout(1000);

    await expect(productDetailsPage.getProductItemCount).toHaveValue('1');

    await expect(productDetailsPage.getIncreaseProductButton).toBeVisible();
    await expect(productDetailsPage.getDecreaseProductButton).toBeVisible();
    
    await productDetailsPage.getDecreaseProductButton.click();

    await expect(productDetailsPage.getDeleteProductModal).toBeVisible({ timeout: 5000 });
    await expect(productDetailsPage.getConfirmDeleteModalButton).toBeVisible();
    await page.waitForTimeout(1000);
    await productDetailsPage.getConfirmDeleteModalButton.click({ force: true, delay: 500 });
    await page.waitForTimeout(1000);
    await expect(productDetailsPage.getDeleteProductModal).not.toBeVisible({ timeout: 5000 });

    await page.waitForTimeout(5000);
    await expect(commonPage.getCartProductsPrice).toHaveText('0,00 zł');
  })
  
  test.skip('W | Możliwość dodania i usunięcia ulubionego produktu z poziomu szczegółów produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1860');

    test.setTimeout(520000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productName = await productDetailsPage.getProductName.textContent() || '';

    await productDetailsPage.getAddToFavouritesButton.click({ force: true, delay: 300 });

    await expect(commonPage.getMessage).toHaveText('Dodano produkt do ulubionych', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(162000);

    await mainPage.getFavouritesButton.click({ force: true, delay: 300 });
    await page.waitForLoadState('domcontentloaded');

    await expect(favouritesPage.getProductNameWithBrand.first()).toBeVisible({ timeout: 15000 });

    const allProductNames = await favouritesPage.getProductNameWithBrand.allTextContents();

    const allProductCount = allProductNames.length
    
    const productFound = allProductNames.some(name => name.includes(productName));

    expect(productFound).toBe(true);

    await page.getByText(productName).hover();
    await page.waitForTimeout(2000);
    await page.getByText(productName).click();
    await page.waitForLoadState('domcontentloaded');

    await productDetailsPage.getAddToFavouritesButton.click({ force: true, delay: 300 });

    await expect(commonPage.getMessage).toHaveText('Usunięto produkt z ulubionych', { timeout: 15000 });
    await expect(commonPage.getMessage).not.toBeVisible({ timeout: 15000 });

    await page.waitForTimeout(162000);

    await mainPage.getFavouritesButton.click({ force: true, delay: 300 });
    await expect(favouritesPage.getFavouritesProductsTitle).toBeVisible({ timeout: 15000 });
    await page.reload();
    await page.waitForLoadState('domcontentloaded');

   await expect(favouritesPage.getProductNameWithBrand.first()).toBeVisible({ timeout: 15000 });

    const updatedProductNames = await favouritesPage.getProductNameWithBrand.allTextContents();
    expect(updatedProductNames.length).toBe(allProductCount - 1);

    const productNotFound = !updatedProductNames.some(name => name.includes(productName));
    expect(productNotFound).toBe(true);
  })
    
  test('W | Możliwość przejścia do strony marki z tytułu produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1861');

    test.setTimeout(80000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productBrandName = await productDetailsPage.getProductBrandName.textContent();
    const formattedProductBrandName = productBrandName?.toLowerCase();

    await productDetailsPage.getProductBrandName.click();

    await expect(page).toHaveURL(`${baseURL}` + '/marki/' + formattedProductBrandName, { timeout: 10000 });
    await expect(brandPage.getBrandTitle).toContainText(productBrandName || '')
  })
          
  test('W | Możliwość wyświetlenia informacji głównych o produkcie', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1862');

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productBrandName = await productDetailsPage.getProductBrandName.textContent();

    await expect(productDetailsPage.getMainInfoProductDropdown).toBeVisible();

    await productDetailsPage.getMainInfoProductDropdown.click();

    const mainInfoContent = productDetailsPage.getMainInfoProductDropdown.locator('..').locator('..').locator('div[class*="MuiCollapse-entered"]').getByText('Zobacz produkty marki');

    await expect(mainInfoContent).toContainText(productBrandName || '');
  })
            
  test('W | Możliwość wyświetlenia informacji opakowania o produkcie', { tag: ['@Prod', '@Beta'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1863');

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productGrammar = await productDetailsPage.getProductGrammar.textContent();

    await expect(productDetailsPage.getMainInfoProductDropdown).toBeVisible();

    await productDetailsPage.getPackagingInfoDropdown.click();

    const mainInfoContent = productDetailsPage.getPackagingInfoDropdown.locator('..').locator('..').locator('div[class*="MuiCollapse-entered"]');

    await expect(mainInfoContent).toHaveText('Objętość: ' + productGrammar);
  })
              
  test('W | Możliwość przejścia do strony marki z informacji głównych produktu', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1864');

    test.setTimeout(80000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const productBrandName = await productDetailsPage.getProductBrandName.textContent();
    const formattedProductBrandName = productBrandName?.toLowerCase();

    await expect(productDetailsPage.getMainInfoProductDropdown).toBeVisible();

    await productDetailsPage.getMainInfoProductDropdown.click();

    const mainInfoContentBrand = page.locator('div[class*="MuiCollapse-entered"]').getByText(productBrandName + ' >'|| '', { exact: true });

    await mainInfoContentBrand.click();

    await expect(page).toHaveURL(`${baseURL}` + '/marki/' + formattedProductBrandName, { timeout: 10000 });
    await expect(brandPage.getBrandTitle).toContainText(productBrandName || '')
  })

  test('W | Możliwość przewijania slidera inne produkty z tej kategorii', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1865');

    test.setTimeout(80000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    const firstItemInSlider = page.locator('[data-cy="inne-produkty-z-tej-kategorii-product-card-slider"]').first();

    await productDetailsPage.getSliderSectionGetLeftButton.isDisabled();
    await productDetailsPage.getSliderSectionGetRightButton.click();
    await page.waitForTimeout(1000);
    await expect(firstItemInSlider).not.toBeInViewport();
    await productDetailsPage.getSliderSectionGetLeftButton.isEnabled();
    await productDetailsPage.getSliderSectionGetLeftButton.click();
    await page.waitForTimeout(1000);
    await expect(firstItemInSlider).toBeInViewport();
    await productDetailsPage.getSliderSectionGetLeftButton.isDisabled();
  })

  test('W | Możliwość przejścia do inne produkty z tej kategorii poprzez link slidera', { tag: ['@Prod', '@Beta', '@Test'] }, async ({ page, baseURL, searchProduct }) => {

    await allure.tags('Web', 'Szczegóły produktu');
    await allure.epic('Webowe');
    await allure.parentSuite('Szczegóły produktu');
    await allure.suite('Testy szczegółów produktu');
    await allure.subSuite('');
    await allure.allureId('1866');

    test.setTimeout(80000);

    await searchProduct(productToSearchName);

    await searchbarPage.getSearchbarProductTiles.first().locator('h3').isVisible({ timeout: 3000 });
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').hover();
    await page.waitForTimeout(1000);
    await searchbarPage.getSearchbarProductTiles.first().locator('h3').click({ force: true, delay: 300 });

    await page.waitForSelector('text="Informacje główne"', { timeout: 15000, state: 'visible' });

    await productDetailsPage.getSectionShowAllLink.click();
    await expect(page).toHaveURL(`${baseURL}` + '/woda-i-napoje/woda/niegazowana', { timeout: 10000 });
    await expect(productsListPage.getProductCategoryTitle('Niegazowana')).toBeVisible({ timeout: 10000 });
  })
})

