import { Product } from './product';

/**
 * Key is a product name,
 * value is an array of testcase exceptions for the product.
 */
export type TestcaseException = {
    [key in Product]: number[];
};

export interface Testcase {
    id: number,
    title: string,
    link: string,
    rulesUrl?: string,
    readmeUrl?: string,
    compatibility: Product[],
    exceptions?: TestcaseException[],
}

export const filterCompatibleTestcases = (testcases: Testcase[], productType: Product) => {
    return testcases.filter((testcase) => {
        return testcase.compatibility.includes(productType);
    });
};
