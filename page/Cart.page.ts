import { Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';
import { expect } from "@playwright/test";

export default class CartPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async waitForPaymentConfirmationButton() {
        await this.page.waitForTimeout(5000);
        await this.page.waitForSelector(this.mobile ? '[data-cy="mobile-payment-checkout-button"]' : '[data-cy="desktop-payment-checkout-button"]', { timeout: 25000, state: 'hidden' });
    }

    async clickCartPaymentConfirmationButton() {
        await expect(this.getCartPaymentConfirmationButton).toHaveCSS('background-color', 'rgb(249, 127, 21)');
        await this.getCartPaymentConfirmationButton.click({ force: true });
    }
    
    async clickCartSummaryButton() {
        const button = this.page.locator(this.mobile ? '[data-cy="mobile-cart-checkout-button"]' : '[data-cy="desktop-cart-checkout-button"]');
        await expect(button).toHaveCSS('background-color', /rgb\((249, 127, 21|229, 110, 6)\)/);
        return button.click({ force: true, delay: 300 });
    }

    async clickCartSummaryPaymentButton() {
        const button = this.page.locator(this.mobile ? '[data-cy="mobile-delivery-checkout-button"]' : '[data-cy="desktop-delivery-checkout-button"]');
        await expect(button).toHaveCSS('background-color', /rgb\((249, 127, 21|229, 110, 6)\)/, { timeout: 15000 });
        return button.click({ force: true, delay: 300 });
    }

    async clickShowCartButton() {
        await this.page.click(selectors.CartPage.web.showCartButton);
    }

    async clickCartDrawerButton() {
        await this.getCartDrawerButton.click({ force: true, delay: 200 });
    }

    async clickClearCartButton() {
        await this.page.click(selectors.CartPage.common.clearCartButton);
    }

    async clickClearCartConfirmButton() {
        await this.page.click(selectors.CartPage.common.clearCartConfirmButton);
    }

    async clickDeleteProductCartIcon() {
        await this.page.click(selectors.CartPage.common.deleteProductCartIcon);
    }

    async clickDeleteProductCartConfirmButton() {
        await this.getProductCartConfirmButton.click({ force: true });
    }

    async clickIncreaseProductButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-plus"]' : 'div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-plus"]').click({ force: true, delay: 300 });
    }

    async clickDecreaseProductButton() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] svg[class*="tabler-icon tabler-icon-minus"]' : 'div[data-sentry-element="InsideWrapper"] svg[class*="tabler-icon tabler-icon-minus"]').click({ force: true, delay: 300 });
    }
    
    async clickCloseDrawerIconButton() {
        await this.getCartDrawerCloseIconButton.click();
    }

    async clickCartDrawerToCartButton() {
        await this.getCartDrawerToCartButton.click();
    }

    async clickCartExpandCollapseButton() {
        await this.getCartExpandCollapseButton.click();
    }

    get getCartPaymentConfirmationButton() {
        return this.page.locator(this.mobile ? '[data-cy="mobile-payment-checkout-button"]' : '[data-cy="desktop-payment-checkout-button"]')
    }

    get getCartPaymentConfirmationDisabledButton() {
        return this.page.locator(this.mobile ? '[data-cy="mobile-payment-checkout-button"]' : '[data-cy="desktop-payment-checkout-button"]')
    }

    get getProductCartConfirmButton() {
        return this.page.locator('div[data-sentry-element="ModalContent"]').getByText('Potwierdź');
    }

    get getPromotionLabel() {
        return this.getEmptyCartNotification.getByText('Promocje');
    }

    get getEmptyCartNotification() {
        return this.page.locator('div[data-sentry-component="CartProductsList"]')
    }

    get getEmptyCartDrawerNotification() {
        return this.mobile ? this.page.locator('#cart-drawer-content-tablet div[data-sentry-component="CartProductsList"]').locator('div').last() : this.page.locator('#cart-drawer-content-desktop div[data-sentry-component="CartProductsList"]');
    }

    get getProductList() {
        return this.page.locator(selectors.CartPage.common.productCartList);
    }

    get getProductItemCount() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[class*="item_count_button"] div[data-sentry-element="ProductQuantityInput"] div input' : 'div[data-sentry-element="InsideWrapper"] div[class*="item_count_button"] div[data-sentry-element="ProductQuantityInput"] div input').last();;
    }

    get getCartDrawer() {
        return this.page.locator(selectors.CartPage.common.cartDrawer)
    }

    get getCartTitle() {
        return this.page.locator(selectors.CartPage.common.cartTitle)
    }

    get getCartCodesTitle() {
        return this.page.locator(selectors.CartPage.web.cartCodesTitle)
    }

    get getCartAvailableCodesButton() {
        return this.page.getByRole('button', { name: 'Sprawdź dostępne kody' });
    }

    get getCartDrawerToCartButton() {
        return this.page.locator(this.mobile ? '[data-cy="mobile-drawer-checkout-button"]' : '[data-cy="desktop-drawer-checkout-button"]');
    }

    get getCartSummaryButton() {
        return this.page.locator(selectors.CartPage.common.cartSummaryButton)
    }

    get getCartReturnButton() {
        return this.page.locator(selectors.CartPage.common.cartReturnButton)
    }

    get getShowCartButton() {
        return this.page.locator(selectors.CartPage.web.showCartButton)
    }

    get getClearCartButton() {
        return this.page.locator(selectors.CartPage.common.clearCartButton)
    }

    get getCartDrawerButton() {
        return this.page.locator(this.mobile ? "div[data-sentry-element='TabletContent'] #cart_button_mobile" : "div[data-sentry-element='WebContent'] #cart_button");
    }

    get getCartDrawerSummaryTitle() {
        return this.page.locator(selectors.CartPage.web.cartDrawerSummaryTitle);
    }

    get getCartDrawerProductsValue() {
        return this.page.locator(selectors.CartPage.web.cartDrawerProductsValue);
    }

    get cartDrawerDeliveryCosts() {
        return this.page.locator(selectors.CartPage.web.cartDrawerDeliveryCosts);
    }

    get cartDrawerDeliveryMinimalValue() {
        return this.page.locator(selectors.CartPage.web.cartDrawerDeliveryMinimalValue);
    }

    get getCartDrawerCloseIconButton() {
        return this.page.locator('button[aria-label="Zamknij"]');
    }

    get getCartPaymentButton() {
        return this.page.locator(selectors.CartPage.common.cartSummaryPaymentButton);
    }

    get getCartCodesDrawer() {
        return this.page.getByText('Kody rabatowe nie obejmują napojów alkoholowych.').locator('..');
    }

    get getActiveDiscountCodesTitle() {
        return this.page.locator('div[data-cy="active-codes-description"]')
    }

    get getActiveCodeValue() {
        return this.page.locator(this.mobile ? 'div[data-sentry-component="MobileSummary"] [data-cy="active-codes-badge"]' : 'div[data-sentry-element="SummaryColumn"] [data-cy="active-codes-badge"]')
    }

    get getSummaryDeleteDiscountCodeButton() {
        return this.page.getByRole('button', { name: 'Usuń', exact: true });
    }

    get getDiscountCodesTitle() {
        return this.page.locator('div[data-cy="cart-summary-rebate-codes"]')
    }

    get getTotalSummaryValue() {
        return this.page.locator(this.mobile ? 'div[data-sentry-component="MobileSummary"] [data-cy="cart-summary-total-price"]' : '[data-sentry-element="SummaryColumn"] [data-cy="cart-summary-total-price"]')
    }

    get getSummaryExpandButton() {
        return this.page.locator('button[data-cy="cart-expand-button"]');
    }

    get getProductNames() {
        return this.page.locator('div[data-sentry-element="InsideWrapper"] a div[class*="sc-a15683e8-2"]');
    }

    get getProductQuantities() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] div[data-sentry-element="StyledProductQuantityInput"] div input' : 'div[data-sentry-element="InsideWrapper"] div[data-sentry-element="StyledProductQuantityInput"] div input');
    }

    get getProductPrices() {
        return this.page.locator(this.mobile ? 'div[data-sentry-element="TabletContent"] #cart_unit_price b' : 'div[data-sentry-element="InsideWrapper"] #cart_unit_price b').last();;
    }

    get getCartExpandCollapseButton() {
        return this.page.locator('button[data-cy="cart-expand-button"]');
    }
}
