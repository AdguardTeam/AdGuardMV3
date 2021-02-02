/**
 * This function allows cache property in object. Use with javascript getter.
 *
 * var Object = {
 *
 *      get someProperty(){
 *          return lazyGet(Object, 'someProperty', function() {
 *              return calculateSomeProperty();
 *          });
 *      }
 * }
 *
 */

type lazyGetObjectType = { [key: string]: any };

export const lazyGet = <T>(object: lazyGetObjectType, prop: string, calculateFunc: () => T): T => {
    const cachedProp = `_${prop}`;
    if (cachedProp in object) {
        return object[cachedProp];
    }
    const value = calculateFunc.apply(object);
    // eslint-disable-next-line no-param-reassign
    object[cachedProp] = value;
    return value;
};

/**
 * Clear cached property
 */
export const lazyGetClear = (object: lazyGetObjectType, prop: string) => {
    // eslint-disable-next-line no-param-reassign
    delete object[`_${prop}`];
};
