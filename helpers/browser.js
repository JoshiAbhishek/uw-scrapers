"use strict";

//
const USERNAME_SELECTOR = '#weblogin_netid';

//
const PASSWORD_SELECTOR = '#weblogin_password';

//
const BUTTON_SELECTOR = '#submit_button';

const CREDS = require('../creds');

/**
 * 
 * @param {*} page 
 * @param {*} url 
 */
async function navigateWithLoginCheck(page, url) {
    var response = await page.goto(url);
    var chain = response.request().redirectChain();

    if (chain.length > 0) {
        if (chain[chain.length - 1]._url.startsWith("https://idp.u.washington.edu/idp/profile/")) {
            await page.click(USERNAME_SELECTOR);
            await page.keyboard.type(CREDS.username);

            await page.click(PASSWORD_SELECTOR);
            await page.keyboard.type(CREDS.password);

            await page.click(BUTTON_SELECTOR);

            await page.waitForNavigation();
        }
    }
}

module.exports = {
    navigateWithLoginCheck
};