import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';


export default class SearchbarPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async enterProduct(product: string) {
        await this.getSearchbarInput.fill(product);
    }

    async clickSearchbar() {
        await this.getSearchbarInput.click({ force: true });
    }

    async clickSearchbarCloseButton() {
        await this.getSearchbarCloseButton.click({ force: true });
    }

    async clickIncreaseProductButton() {
        return this.mobile ? this.page.locator('div[data-sentry-element="TabletContent"] div[data-testid="search-results"] svg[class*="tabler-icon tabler-icon-plus"]').click({ delay: 300 }) : this.page.locator('div[data-sentry-element="WebContent"] div[data-testid="search-results"] svg[class*="tabler-icon tabler-icon-plus"]').click({ delay: 300 });
    }

    async clickDecreaseProductButton() {
        return this.mobile ? this.page.locator('div[data-sentry-element="TabletContent"] div[data-testid="search-results"] svg[class*="tabler-icon tabler-icon-minus"]').click({ delay: 300 }) : this.page.locator('div[data-sentry-element="WebContent"] div[data-testid="search-results"] svg[class*="tabler-icon tabler-icon-minus"]').click({ delay: 300 });
    }

    get getProductItemCount() {
        return this.mobile ? this.page.locator('div[data-sentry-element="TabletContent"] div[data-testid="search-results"] div[data-sentry-element="ProductQuantityInput"] div input') : this.page.locator('div[data-sentry-element="WebContent"] div[data-testid="search-results"] div[data-sentry-element="ProductQuantityInput"] div input');
    }

    get getSearchbarProductBrandNames() {
        return this.page.locator('div[data-testid="search-results"] h4[data-sentry-element="MadeBy"]');
    }

    get getSearchbarProductNames() {
        return this.page.locator('div[data-testid="search-results"] h3[data-sentry-element="Name"]');
    }

    get getSearchbarProductGrammars() {
        return this.page.locator('div[data-testid="search-results"] p[data-sentry-element="Grammar"]');
    }

    get getSearchbarProductPricePerGrammar() {
        return this.page.locator('div[data-testid="search-results"] p[data-sentry-element="PricePerGrammar"]');
    }

    get getProductPrices() {
        return this.page.locator('div[data-testid="search-results"] p[data-sentry-element="CurrentPrice"]');
    }

    get getSearchbarInput() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_search_input" : "div[data-sentry-element='WebContent'] #search_hub_search_input");
    }

    get getSearchbarCloseButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_close_button:has-text('Zamknij ')" : "div[data-sentry-element='WebContent'] #search_hub_close_button:has-text('Zamknij ')");
    }

    get getSearchbarClearButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #search_hub_clear_button:has-text('wyczyść')" : "div[data-sentry-element='WebContent'] #search_hub_clear_button:has-text('wyczyść')");
    }

    get getOurDiscountsTitle() {
        return this.page.getByText('Nasze promocje');
    }

    get getSectionShowAllLink() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="HubContent"] div[data-sentry-element="Controls"] a[href="/promocje"]:has-text("Zobacz wszystkie")' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] div[data-sentry-element="Controls"] a[href="/promocje"]:has-text("Zobacz wszystkie")');
    }

    get getOurDiscountsSection() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #wyszukiwarka-nasze-promocje' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] #wyszukiwarka-nasze-promocje');
    }

    get getBigBanner() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="HubContent"] div[data-sentry-component="BannerListing"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="HubContent"] div[data-sentry-component="BannerListing"]');
    }

    get getSearchbarProductTiles() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"]' : 'div[data-sentry-element="WebContent"] div[data-testid="search-results"] div[data-sentry-component="ProductCard"]')
    }

    get getSliderLeftButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-left"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-left"]');
    }

    get getSliderRightButton() {
        return this.page.locator(this.mobile ?'div[data-sentry-element="TabletContent"] div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-right"]' : 'div[data-sentry-element="WebContent"] div[data-sentry-element="Controls"] button svg[class*="tabler-icon tabler-icon-arrow-right"]');
    }
}