import { expect, Page } from "@playwright/test";
import * as selectors from '../utils/selectors.json';
import { isMobile } from '../utils/utility-methods.ts';

export default class DeliveryPage {
    private mobile: boolean;

    constructor(public page: Page) {
        this.page = page;
        const viewport = page.viewportSize();
        if (!viewport) throw new Error('Viewport is null');
        this.mobile = isMobile(viewport.width);
    }

    async clickAddNewAddressButton() {
        await this.getAddNewAddressButton.click({ force: true, delay: 300 });
    }

    async clickCloseAddressModalButton() {
        await this.getCloseAddressModalButton.click({ force: true, delay: 300 });
    }

    async clickAddNewInvoiceAddressButton() {
        await this.getAddNewInvoiceAddressButton.click({ force: true, delay: 300 });
    }

    async selectInvoiceAddressType(type: string) {
        await this.getInvoiceAddressTypeDropdown.click({ force: true, delay: 300 });
        await this.page.waitForTimeout(2000);
        await this.getAddressModal.getByText(type).click({ force: true, delay: 300 });
    }

    async clickEditAddressButton(addressName: string) {
        const button = await this.getEditAddressButton(addressName);
        await button.click();
    }

    async clickEditInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('..').locator('svg[class*="tabler-icon tabler-icon-pencil"]').click();
    }

    async clickDeleteAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('div').locator('div').locator('svg[class*="tabler-icon tabler-icon-trash "]').click();
    }

    async clickDeleteInvoiceAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('..').locator('svg[class*="tabler-icon tabler-icon-trash "]').click();
    }

    async getEditAddressButton(addressName: string) {
        return this.page.getByText(addressName).locator('..').locator('..').locator('..').locator('div').locator('div').locator('svg[class*="tabler-icon tabler-icon-pencil "]');
    }

    async clickSaveReservationButton() {
        await expect(this.getSaveReservationButton).toBeVisible({ timeout: 5000 });
        await this.getSaveReservationButton.click({ force: true, delay: 300 });
    }   

    async clickConfirmReservationButton() {
        await expect(this.getConfirmReservationButton).toBeVisible({ timeout: 5000 });
        await this.getConfirmReservationButton.click({ force: true, delay: 300 });
    }

    get getCloseAddressModalButton() {
        return this.page.locator('button[aria-label="Zamknij"]');
    }

    get getDeliverySlotButton() {
        return this.page.locator(selectors.DeliveryPage.common.deliverySlot);
    }

    get getDeliveryAddressTitle() {
        return this.page.locator('div[data-sentry-element="Title"]').getByText('Adres dostawy');
    }

    get getInvoiceAddressTitle() {
        return this.page.getByText('Dane podmiotu');
    }

    get getDeliveryAddressSubTitle() {
        return this.page.getByText('Wybierz adres dostawy lub dodaj nowy');
    }

    get getAddNewAddressButton() {
        return this.page.getByText('Dodaj nowy adres');
    }

    get getAddNewInvoiceAddressButton() {
        return this.page.locator(`button:has-text('Dodaj nowy podmiot')`)
    }

    get getDeliveryInvoiceCheckbox() {
        return this.page.getByText('Chcę otrzymać fakturę');
    }

    get getDeliveryDateTitle() {
        return this.page.locator('div[data-sentry-component="CartDeliveryDate"]').getByText('Termin dostawy');
    }

    get getVerifyAddressButton() {
        return this.page.getByRole('button', { name: 'Zweryfikuj' });
    }

    get getSaveReservationButton() {
        return this.page.getByRole('button', { name: 'Zapisz rezerwacje' });
    }

    get getConfirmReservationButton() {
        return this.page.getByRole('button', { name: 'Potwierdź rezerwację' });
    }

    // Address/Invoice Modal

    async clickSaveAdressModalButton() {
        await this.getAddressModalSaveButton.click();
    }

    get getAddressModalCloseIcon() {
        return this.page.locator(selectors.DeliveryPage.common.AddressModalCloseIcon);
    }

    get getAddressModalSaveButton() {
        return this.page.getByRole('button', { name: 'Zapisz', exact: true });
    }

    get getAddressModalCancelButton() {
        return this.page.getByText('Anuluj');
    }

    get getAddressModalConfirmationButton() {
        return this.page.locator(`button:has-text("Potwierdź")`);
    }

    getAddressModalDeleteAddressName(addressName: string) {
        return this.page.locator(`div[data-sentry-element="Modal"] div[data-sentry-element="AddressName"]:has-text("${addressName}")`);
    }

    // Address Modal

    get getInvoiceAddressTypeDropdown() {
        return this.page.locator('#invoice_address_type');
    }

    get getAddressModal() {
        return this.page.locator('div[data-sentry-element="Modal"]');
    }

    get getPersonalInvoiceAddressModalAddressFirstName() {
        return this.page.locator('#invoice_address_first_name');
    }
    
    get getPersonalInvoiceAddressModalAddressLastName() {
        return this.page.locator('#invoice_address_last_name');
    }

    get getAddressModalAddressName() {
        return this.page.locator('#delivery_address_name');
    }

    get getAddressModalAddressSearchAddress() {
        return this.page.locator('#:r16:');
    }

    get getAddressModalUserName() {
        return this.page.locator('#delivery_address_first_name');
    }

    get getAddressModalUserSurname() {
        return this.page.locator('#delivery_address_last_name');
    }

    get getAddressModalUserPhoneNumber() {
        return this.page.locator('#delivery_address_phone');
    }

    get getAddressModalUserPostalCode() {
        return this.page.locator('#delivery_address_postal');
    }

    get getAddressModalUserCity() {
        return this.page.locator('#delivery_address_city');
    }

    get getAddressModalUserStreet() {
        return this.page.locator('#delivery_address_street');
    }

    get getAddressModalUserHouseNumber() {
        return this.page.locator('#delivery_address_house_number');
    }

    get getAddressModalUserStaircase() {
        return this.page.locator('#delivery_address_staircase');
    }

    get getAddressModalUserFlatNumber() {
        return this.page.locator('#delivery_address_flat_number');
    }

    get getAddressModalUserFloor() {
        return this.page.locator('#delivery_address_floor');
    }

    get getAddressModalUserDeliveryNotes() {
        return this.page.locator('#delivery_address_client_delivery_notes');
    }

    // Invoice Address Modal

    get getInvoiceAddressModalAddressName() {
        return this.page.locator('#invoice_address_name');
    }

    get getInvoiceAddressModalAddressSearchAddress() {
        return this.page.locator('#:rku:');
    }

    get getInvoiceAddressModalCompanyName() {
        return this.page.locator('#invoice_address_company_name');
    }

    get getInvoiceAddressModalNIP() {
        return this.page.locator('#invoice_address_tax');
    }

    get getInvoiceAddressModalUserPostalCode() {
        return this.page.locator('#invoice_address_postal');
    }

    get getInvoiceAddressModalUserCity() {
        return this.page.locator('#invoice_address_city');
    }

    get getInvoiceAddressModalUserStreet() {
        return this.page.locator('#invoice_address_street');
    }

    get getInvoiceAddressModalUserHouseNumber() {
        return this.page.locator('#invoice_address_house_number');
    }

    get getInvoiceAddressModalUserFlatNumber() {
        return this.page.locator('#invoice_address_flat_number');
    }
}