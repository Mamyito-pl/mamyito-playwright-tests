import { Page, expect } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class Przelewy24Page {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickMainBlikButton() {
        await this.page.click(selectors.Przelewy24.common.mainBlikButton);
    }

    async clickMainTransferButton() {
        await this.page.click(selectors.Przelewy24.common.mainTransferButton);
    }

    async clickChosenBlikButton() {
        await this.page.click(selectors.Przelewy24.common.chosenBlikButton);
    }

    async clickChosenTransferButton() {
        await this.page.click(selectors.Przelewy24.common.chosenTransferButton);
    }

    async clickPayButton() {
        await this.getPayButton.click({ force: true });
    }

    async clickErrorPayButton() {
        await this.getErrorPayButton.click({ force: true })
    }

    async clickBackToShopButton() {
        await this.getBackToShopButton.click();
    }

    async payWithDpay() {
        await expect(this.page).toHaveURL(new RegExp('^https://secure.dpay.pl/transfer@pay@'));
        await this.clickPayButton();
        await expect(this.page).toHaveURL(new RegExp('^https://secure.dpay.pl/transfer@test@'));
        await this.clickBackToShopButton();
    }

    get getBackToShopButton() {
        return this.page.getByText('Powrót na stronę sprzedawcy');
    }

    get getErrorPayButton() {
        return this.page.locator("#user_account_pbl_error");
    }

    get getPayButton() {
        return this.page.getByText('Zapłać', { exact: true });
    }
}