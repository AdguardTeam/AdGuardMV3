/* eslint-disable no-await-in-loop */
import { chromium } from 'playwright';

import { EXTENSION_INITIALIZED_EVENT } from '../../src/common/constants/common';
import {
    BUILD_PATH,
    USER_DATA_PATH,
    DEFAULT_EXTENSION_CONFIG,
    TESTCASES_BASE_URL,
} from '../test-constants';

import {
    addQunitListeners,
    setTsWebExtensionConfig,
    SetTsWebExtensionConfigArg,
    waitUntilExtensionInitialized,
} from './page-injections';
import { getTestcases, getRuleText } from './requests';
import { filterCompatibleTestcases } from './testcase';
import { logTestResult, logTestTimeout } from './logger';
import { Product } from './product';

const TESTS_TIMEOUT_MS = 5 * 1000;
const TESTS_TIMEOUT_CODE = 'tests_timeout';
const CSP_TEST_ID = 12;
const TESTING_MODE = process.env.TEST_MODE;

(async () => {
    // Launch browser with installed extension
    const browserContext = await chromium.launchPersistentContext(USER_DATA_PATH, {
        args: [
            `--disable-extensions-except=${BUILD_PATH}/${TESTING_MODE}/chrome`,
            `--load-extension=${BUILD_PATH}/${TESTING_MODE}/chrome`,
            '--headless=chrome',
        ],
    });

    const backgroundPage = await browserContext.waitForEvent('serviceworker');

    await backgroundPage.evaluate<void, string>(
        waitUntilExtensionInitialized,
        EXTENSION_INITIALIZED_EVENT,
    );

    const page = await browserContext.newPage();

    const testcases = await getTestcases();

    const compatibleTestcases = filterCompatibleTestcases(testcases, Product.Chrome);

    // register function, that transfer args from page to playwright context
    // installed function survive navigations.
    await page.exposeFunction('logTestResult', logTestResult);

    // extends QUnit instance on creation by custom event listeners,
    // that triggers exposed function
    await page.addInitScript(addQunitListeners, 'logTestResult');

    // run testcases
    // eslint-disable-next-line no-restricted-syntax
    for (const testcase of compatibleTestcases) {
        // TODO: implement separate e2e test for popups
        // ignore popup tests
        if (!testcase.rulesUrl) {
            // eslint-disable-next-line no-continue
            continue;
        }

        // load rules text for current testcase
        const userrules = await getRuleText(testcase.rulesUrl);

        // update tsWebExtension config
        await backgroundPage.evaluate<void, SetTsWebExtensionConfigArg>(
            setTsWebExtensionConfig,
            [DEFAULT_EXTENSION_CONFIG, userrules],
        );

        const openPageAndWaitForTests = testcase.id === CSP_TEST_ID
            ? page.goto(`${TESTCASES_BASE_URL}/${testcase.link}`, { waitUntil: 'networkidle' })
            // The function with tests check works only if there is no CSP
            : Promise.all([
                // run test page
                page.goto(`${TESTCASES_BASE_URL}/${testcase.link}`),
                // wait until all tests are completed with disabled timeout
                // eslint-disable-next-line @typescript-eslint/no-loop-func
                page.waitForFunction(() => (<any>window).testsCompleted, undefined, { timeout: 0 }),
            ]);

        const timeoutForTests = page.waitForTimeout(TESTS_TIMEOUT_MS).then(() => TESTS_TIMEOUT_CODE);

        const res = await Promise.race([
            timeoutForTests,
            openPageAndWaitForTests,
        ]);

        if (res === TESTS_TIMEOUT_CODE) {
            logTestTimeout(testcase.title, TESTS_TIMEOUT_MS);
        }
    }

    await browserContext.close();
})();
