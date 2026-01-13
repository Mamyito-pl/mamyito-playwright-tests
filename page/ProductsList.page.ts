import { Page, Locator, expect } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class ProductsListPage {
    private mobile: boolean;

    constructor(public page: Page) {
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async getSortSelect(sortName: string) {

        const option = this.mobile 
            ? this.getSettingsDrawer.getByText(sortName, { exact: true })
            : this.getSortDropdown.getByRole('option', { name: sortName, exact: true });
    
        await option.click();
    }

    async getFilterSelectExact(filterName: string, selectName: string) {

        const filter = this.mobile 
            ? this.getSettingsDrawer.getByText(filterName, { exact: true })
            : await this.getFilter(filterName);

        const filterSelect = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName, { exact: true })
            : (await this.getFilterDropdown(filterName)).getByText(new RegExp(`^${selectName}$`));

        const radioInput = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName).locator('..').getByRole('radio', { name: selectName })
            : (await this.getFilterDropdown(filterName)).locator('..').getByRole('radio', { name: selectName });


        await expect(filter).toBeVisible({ timeout: 5000 });
        await expect(filter).toBeAttached();
        await filter.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        await filter.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(2000);
        await filterSelect.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(2000);
        await filterSelect.click({ force: true, delay: 300 });
    }

    async getFilterSelect(filterName: string, selectName: string) {

        const filter = this.mobile 
            ? this.getSettingsDrawer.getByText(filterName, { exact: true })
            : await this.getFilter(filterName);

        const filterSelect = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName + ' (')
            : (await this.getFilterDropdown(filterName)).getByText(selectName);

        const radioInput = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName).locator('..').getByRole('radio', { name: selectName })
            : (await this.getFilterDropdown(filterName)).locator('..').getByRole('radio', { name: selectName });


        await expect(filter).toBeVisible({ timeout: 5000 });
        await filter.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(1000);
        await filter.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(2000);
        await filterSelect.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(2000);
        await filterSelect.click({ force: true, delay: 300 });  
    }

    async getFilterSelectCheckbox(filterName: string, selectName: string) {

        const filter = this.mobile 
            ? this.getSettingsDrawer.getByText(filterName, { exact: true })
            : await this.getFilter(filterName);

        const filterSelect = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName, { exact: true })
            : (await this.getFilterDropdown(filterName)).getByText(new RegExp(`^${selectName}$`));

        const filterSelectCheckboxChecked = this.mobile 
            ? this.getSettingsDrawer.getByText(selectName).locator('..').locator('span')
            : (await this.getFilterDropdown(filterName)).getByText(selectName).locator('..').locator('span');
    
        await filter.click({ force: true, delay: 300 });
        await expect(filterSelect).toBeVisible({ timeout: 5000 });
        
        let isChecked = false;
        for (let i = 0; i < 3; i++) {
            try {
                await filterSelect.click({ force: true, delay: 300 });
                await expect(filterSelectCheckboxChecked).toHaveCSS('background-color', 'rgb(78, 180, 40)');
                isChecked = true;
                break;
            } catch (e) {
                // Jeśli nie jest widoczny, spróbuj ponownie
            }
        }
        if (!isChecked) {
            throw new Error('Nie udało się zaznaczyć filtra po 3 próbach.');
        }
    }
    
    async getFilterCustomPriceFromSet(filterName: string, priceFrom: string) {

        await this.page.waitForTimeout(3000);

        const filter = this.mobile 
            ? this.getSettingsDrawer.getByText(filterName, { exact: true })
            : await this.getFilter(filterName);
        
        await filter.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(1000);
        await this.getFilterPriceFromInput.fill(priceFrom)
    }

    async getFilterCustomPriceToSet(filterName: string, priceTo: string) {

        await this.page.waitForTimeout(3000);

        const filter = this.mobile 
            ? this.getSettingsDrawer.locator('div h2').getByText(filterName, { exact: true }).locator('..')
            : await this.getFilter(filterName);
        
        await filter.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(1000);
        await this.getFilterPriceToInput.fill(priceTo)
    }

    async getFilterDropdown(filterName: string) {
        return this.page.locator(`h2[data-sentry-element="PanelTitle"]:has-text('${filterName}')`).locator('..').locator('..');
    }

    async getFilter(filterName: string) {
        return this.page.locator(this.mobile ? `div[data-sentry-element="DrawerContent"]:text-is('${filterName}')` : `h2[data-sentry-element="PanelTitle"]:text-is('${filterName}')`);
    }

    async clickIncreaseProductButton() {
        return this.page.locator(selectors.ProductsListPage.common.productCardIncreaseButton).click();
    }

    async clickDecreaseProductButton() {
        return this.page.locator(selectors.ProductsListPage.common.productCardDecreaseButton).click();
    }

    async clickApplyButton() {
        return this.getApplyButton.click({ force: true, delay: 300 });
    }

    getProductCategoryTitle(titleName: string) {
        return this.page.locator(this.mobile ? `div[data-sentry-element="TitleMobile"]:has-text("${titleName}")` : `h1[data-sentry-element="Title"]:has-text("${titleName}")`);
    }

    getSpecialProductCategoryTitle(titleName: string) {
        return this.page.locator(`h1[data-sentry-element="Title"]:has-text("${titleName}")`);
    }

    async getOpenedFilter(filterName: string) {
        return this.page.locator('div[data-sentry-element="PanelHeader"]').getByText(`${filterName}`).locator('..');
    }

    get getFiltersCounter() {
        return this.page.locator('[data-cy="mobile-active-filters-counter"]');
    }

    get getBreadcrumbs() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="Mobile"]' : 'div[data-sentry-element="Desktop"]');
    }

    get getCategoryTag() {
        return this.page.locator('a[data-cy="category-tag"]');
    }

    get getBigBanner() {
        return this.page.locator('div[data-sentry-element="Desktop"]');
    }

    get getCategoryTags() {
        return this.page.locator('div[data-sentry-element="CategoriesWrapper"]');
    }

    get getHorizontalMenuButton() {
        return this.page.locator('svg[class*="tabler-icon tabler-icon-arrow-bar-down"]');
    }

    get getVerticalMenuButton() {
        return this.page.locator('svg[class*="tabler-icon tabler-icon-arrow-bar-right"]');
    }

    get getVerticalMenu() {
        return this.page.locator('div[data-sentry-component="CategoryFilters"]');
    }

    get getHorizontalMenu() {
        return this.page.locator('div[data-sentry-component="HorizontalCategoryFilters"]');
    }

    get getProductTypeFilter() {
        return this.mobile? this.page.locator('div[data-sentry-element="PanelHeader"]').getByText('Typ produktu') : this.page.locator('div[data-sentry-element="HeaderContent"] div[data-sentry-element="Wrapper"] div[data-sentry-element="FiltersWrapper"]').getByText('Typ produktu');
    }

    get getPriceFilter() {
        return this.mobile? this.page.locator('div[data-sentry-element="PanelHeader"]').getByText('Cena') : this.page.locator('div[data-sentry-element="HeaderContent"] div[data-sentry-element="Wrapper"] div[data-sentry-element="FiltersWrapper"]').getByText('Cena');
    }

    get getManufacturerFilter() {
        return this.mobile? this.page.locator('div[data-sentry-element="PanelHeader"]').getByText('Producent') : this.page.locator('div[data-sentry-element="HeaderContent"] div[data-sentry-element="Wrapper"] div[data-sentry-element="FiltersWrapper"]').getByText('Producent');
    }

    get getAvailableInDeliveryFilter() {
        return this.mobile? this.page.locator('div[data-sentry-element="PanelHeader"]').getByText('Dostępność w dostawie') : this.page.locator('div[data-sentry-element="HeaderContent"] div[data-sentry-element="Wrapper"] div[data-sentry-element="FiltersWrapper"]').getByText('Dostępność w dostawie');
    }

    get getFiltersButton() {
        return this.page.getByRole('button', { name: 'Filtry', exact: true });
    }

    get getSortButton() {
        return this.page.locator(this.mobile ? `button:has-text('Sortuj')` : `div[data-sentry-element="SortingInputWrapper"] [data-sentry-component="SelectDropdown"]`);
    }

    get getFilterButton() {
        return this.page.locator(`button:has-text('Filtry')`)
    }

    get getSortDropdown() {
        return this.page.locator('ul[role="listbox"]');
    }

    get getSettingsDrawer() {
        return this.page.locator('div[data-sentry-element="DrawerContent"]');
    }

    get getCloseIconButton() {
        return this.page.locator('svg[class*="tabler-icon tabler-icon-x"]');
    }

    get getSaveButtonSettingsDrawer() {
        return this.page.getByRole('button').getByText('Zastosuj');
    }

    get getClearButtonSettingsDrawer() {
        return this.page.getByRole('button').getByText('Wyczyść');
    }

    get getProductTiles() {
        return this.page.locator('div[data-sentry-component="ProductCard"] h3').locator('..').locator('..').locator('..').locator('..').locator('..')
    }
    
    get getProductPrices() {
        return this.page.locator('div[data-sentry-element="ListingWrapper"] p[data-sentry-element="CurrentPrice"]');
    }

    get getProductPricesPerGrammar() {
        return this.page.locator('div[data-sentry-element="ListingWrapper"] p[data-sentry-element="PricePerGrammar"]');
    }

    get getProductName() {
        return this.page.locator('div[data-sentry-element="ListingWrapper"] h3[data-sentry-element="Name"]');
    }

    get getProductBrand() {
        return this.page.locator('div[data-sentry-element="ListingWrapper"] h4[data-sentry-element="MadeBy"]');
    }

    get getApplyButton() {
        return this.page.getByRole('button', { name: 'Zastosuj' });
    }

    get getClearFiltersButton() {
        return this.mobile 
        ? this.page.getByRole('button', { name: 'Wyczyść', exact: true })
        : this.page.getByRole('button', { name: 'Wyczyść filtry', exact: true });
    }

    get getNoProductsResult() {
        return this.page.getByText('Brak wyników').locator('..').getByText('Brak wynikówNiestety nie udało nam się znaleźć odpowiednich produktów.Spróbuj dostosować filtry lub sprawdź w innej kategorii.')
    }

    get getFilterPriceFromInput() {
        return this.mobile 
            ? this.page.locator('div[data-sentry-element="DrawerContent"]').getByPlaceholder('od', { exact: true })
            : this.page.getByPlaceholder('od', { exact: true });
    }

    get getFilterPriceToInput() {
        return this.mobile 
            ? this.page.locator('div[data-sentry-element="DrawerContent"]').getByPlaceholder('do', { exact: true })
            : this.page.getByPlaceholder('do', { exact: true });
    }
}