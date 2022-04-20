import { userRules } from '../../src/background/userRules';
import { engine } from '../../src/background/engine';

jest.mock('../../src/background/engine');
jest.mock('../../src/background/storage');

describe('user rules', () => {
    it('updates engine once', async () => {
        await userRules.setUserRules('example.org##h1');
        // TODO should be called just once, currently it updates twice,
        //  first time on filter remove and second time on filter add
        expect(engine.init).toBeCalledTimes(2);
    });
});
