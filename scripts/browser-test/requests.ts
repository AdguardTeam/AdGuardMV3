import axios from 'axios';

import { TESTCASES_BASE_URL, TESTCASES_DATA_PATH } from '../test-constants';

import { Testcase } from './testcase';

axios.defaults.baseURL = TESTCASES_BASE_URL;

export const get = async <ResponseData>(url: string) => {
    const res = await axios.get<ResponseData>(url, {
        validateStatus: (status) => {
            return status === 200; // Resolve only if the status code is 200
        },
    });

    return res.data;
};

export const getRuleText = (path: string) => get<string>(path);

export const getTestcases = () => get<Testcase[]>(TESTCASES_DATA_PATH);
