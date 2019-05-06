"use strict";

const CREDS = require('../creds');

// Selector for the username input of the UW NetID login page
const USERNAME_SELECTOR = '#weblogin_netid';

// Selector for the password input of the UW NetID login page
const PASSWORD_SELECTOR = '#weblogin_password';

// Selector for the submit button of the UW NetID login page
const BUTTON_SELECTOR = '#submit_button';

/**
 * Navigates to a url after logging in with stored UW NetID credentials if required
 * @param {Object} page - The current Puppeteer page instance
 * @param {String} url - The url to navigate to with a check for a UW NetID login requirement
 */
async function navigateWithLoginCheck(page, url) {
    var response = await page.goto(url, {waitUntil: 'networkidle0'});
    var chain = response.request().redirectChain();

    if (chain.length > 0) {
        if (chain[chain.length - 1]._url.startsWith("https://idp.u.washington.edu/idp/profile/")) {
            await page.click(USERNAME_SELECTOR);
            await page.keyboard.type(CREDS.username);

            await page.click(PASSWORD_SELECTOR);
            await page.keyboard.type(CREDS.password);

            await Promise.all([
                page.click(BUTTON_SELECTOR),
                page.waitForNavigation( { 'waitUntil' : 'networkidle0' } )
            ]);
        }
    }
}

module.exports = {
    navigateWithLoginCheck
};