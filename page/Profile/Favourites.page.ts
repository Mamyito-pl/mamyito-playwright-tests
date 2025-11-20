import { Page } from "@playwright/test";
import { isMobile } from '../../utils/utility-methods.ts';

export default class FavouritesPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async getSortSelect(sortName: string) {
        return this.getSortDropdown.getByRole('option', { name: sortName, exact: true }).click();
    }

    get getFavouritesProductsTitle() {
        return this.page.locator('main div[id="profile_details_favourites"]:has-text("Ulubione produkty")');
    }

    get getProductPrices() {
        return this.page.locator('div[data-sentry-source-file="ProfileFavourites.tsx"] p[data-sentry-element="CurrentPrice"]');
    }

    get getProductPricesPerGrammar() {
        return this.page.locator('div[data-sentry-source-file="ProfileFavourites.tsx"] p[data-sentry-element="PricePerGrammar"]');
    }

    get getSortButton() {
        return this.page.locator('div[data-sentry-element="SortingInputWrapper"]');
    }

    get getSortDropdown() {
        return this.page.locator('ul[role="listbox"]');
    }

    get getProductName() {
        return this.page.locator('div[data-sentry-source-file="ProfileFavourites.tsx"] h3[data-sentry-element="Name"]');
    }

    get getProductNameWithBrand() {
        return this.page.locator('div[data-sentry-source-file="ProfileFavourites.tsx"] div[data-sentry-element="BasicDetails"]');
    }
}