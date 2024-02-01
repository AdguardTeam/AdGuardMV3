/* eslint-disable no-await-in-loop */
import { chromium, type Page } from 'playwright';
import { program } from 'commander';
import builder from 'junit-report-builder';

import { EXTENSION_INITIALIZED_EVENT } from '../../src/common/constants/common';
import { BUILD_PATH } from '../build-constants';
import { USER_DATA_PATH, DEFAULT_EXTENSION_CONFIG, TESTCASES_BASE_URL } from '../test-constants';

import {
    addQunitListeners,
    setTsWebExtensionConfig,
    SetTsWebExtensionConfigArg,
    waitUntilExtensionInitialized,
} from './page-injections';
import { getTestcases, getRuleText } from './requests';
import { filterCompatibleTestcases } from './testcase';
import { logTestResult, logTestTimeout, TestDetails } from './logger';
import { Product } from './product';
import { TestStatus } from './text-color';

// https://playwright.dev/docs/service-workers-experimental
process.env.PW_EXPERIMENTAL_SERVICE_WORKER_NETWORK_EVENTS = '1';

const TESTS_TIMEOUT_MS = 5 * 1000;

const TEST_REPORT_PATH = 'test-report.xml';

const PRODUCT_MV3 = Product.Mv3;

/**
 * Opens the page, waits for the `networkidle` event, and then, if
 * `waitForResult` was toggled, checks for test results.
 *
 * @param page Page of playwright.
 * @param testPageUrl URL address of tests.
 * @param waitForResult Should check test details or not.
 *
 * @returns Promise waiting for the completion of all tests.
 */
const waitForTests = async (
    page: Page,
    testPageUrl: string,
): Promise<TestDetails> => {
    await page.goto(testPageUrl, { waitUntil: 'networkidle' });

    const testDetailsObject = await page.waitForFunction(
        // Waits until `window.testDetails` is defined.
        (): TestDetails => (<any>window).testDetails,
        undefined,
        { timeout: 0 },
    );

    const testDetails = await testDetailsObject.jsonValue();

    return testDetails;
};

/**
 * Runs integration tests in specified `testMode`.
 *
 * @param testMode - 'dev' or 'release', depending on which build should be tested.
 *
 * @returns True if all tests have passed or false if any tests have failed
 * or timed out.
 */
const runTests = async (testMode: string): Promise<boolean> => {
    // Launch browser with installed extension
    const browserContext = await chromium.launchPersistentContext(USER_DATA_PATH, {
        args: [
            `--disable-extensions-except=${BUILD_PATH}/${testMode}/chrome`,
            `--load-extension=${BUILD_PATH}/${testMode}/chrome`,
            '--headless=new',
        ],
    });

    let [backgroundPage] = browserContext.serviceWorkers();
    if (!backgroundPage) {
        backgroundPage = await browserContext.waitForEvent('serviceworker');
    }

    await backgroundPage.evaluate<void, string>(
        waitUntilExtensionInitialized,
        EXTENSION_INITIALIZED_EVENT,
    );

    const page = await browserContext.newPage();

    const testcases = await getTestcases();

    const compatibleTestcases = filterCompatibleTestcases(testcases, PRODUCT_MV3);

    // register function, that transfer args from page to playwright context
    // installed function survive navigations.
    await page.exposeFunction('logTestResult', logTestResult);

    // extends QUnit instance on creation by custom event listeners,
    // that triggers exposed function
    await page.addInitScript(addQunitListeners, 'logTestResult');

    let allTestsPassed = true;

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

        let testPageUrl = `${TESTCASES_BASE_URL}/${testcase.link}`;

        const productExceptionsData = testcase.exceptions?.find((ex) => Object.keys(ex)[0] === PRODUCT_MV3);
        if (productExceptionsData && productExceptionsData[PRODUCT_MV3].length > 0) {
            testPageUrl += `?exceptions=${productExceptionsData[PRODUCT_MV3].join(',')}`;
        }

        // Wait for a test details only if the tests are not CSP tests,
        // as they do not work correctly in playwright.
        const openPageAndWaitForTests = waitForTests(page, testPageUrl);

        const timeoutForTests = page
            .waitForTimeout(TESTS_TIMEOUT_MS)
            .then(() => TestStatus.Timeout);

        // Create a test suite
        const testSuite = builder
            .testSuite()
            .name(testcase.title);

        let res: TestDetails | TestStatus;
        try {
            res = await Promise.race([
                timeoutForTests,
                openPageAndWaitForTests,
            ]);
        } catch (e: unknown) {
            allTestsPassed = false;
            // eslint-disable-next-line no-continue
            continue;
        }

        if (res === TestStatus.Timeout) {
            logTestTimeout(testcase.title, TESTS_TIMEOUT_MS);

            testSuite.time(TESTS_TIMEOUT_MS / 5);

            testSuite
                .testCase()
                .name('Timeout')
                .time(TESTS_TIMEOUT_MS / 5)
                .failure();

            allTestsPassed = false;
        } else {
            const testDetails = res as TestDetails;
            logTestResult(testDetails);

            testSuite.time(testDetails.runtime / 1000);

            testDetails.tests.forEach((t) => {
                const testCase = testSuite
                    .testCase()
                    .name(t.name)
                    .time(t.runtime / 1000);

                if (t.errors.length > 0) {
                    testCase.error(
                        t.errors[0].message,
                        undefined,
                        t.errors[0].stack,
                    );
                }

                switch (t.status) {
                    case TestStatus.Failed: {
                        testCase.failure();
                        break;
                    }
                    case TestStatus.Skipped: {
                        testCase.skipped();
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }
    }

    await browserContext.close();

    builder.writeTo(TEST_REPORT_PATH);

    return allTestsPassed;
};

program
    .command('dev')
    .description('run tests in dev mode')
    .action(async () => {
        const success = await runTests('dev');

        if (!success) {
            program.error('Some tests failed. Check detailed info in the up log.');
        }
    });

program
    .command('release')
    .description('run tests in release mode')
    .action(async () => {
        const success = await runTests('release');

        if (!success) {
            program.error('Some tests failed. Check detailed info in the up log.');
        }
    });

program.parse(process.argv);
