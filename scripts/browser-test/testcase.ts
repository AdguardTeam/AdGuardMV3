import { Product } from './product';

export interface Testcase {
    id: number,
    title: string,
    link: string,
    rulesUrl?: string,
    readmeUrl?: string,
    compatibility: Product[],
}

export const filterCompatibleTestcases = (testcases: Testcase[], productType: Product) => {
    return testcases.filter((testcase) => {
        return testcase.compatibility.includes(productType);
    });
};
