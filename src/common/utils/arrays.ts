/**
 * Converts array of double numbers (e.x. [[0,1], [2,3]]) to Map<number, number>
 */
export const arrayToMap = (arr: Array<Array<number>>) => new Map(arr.map((i) => [i[0], i[1]]));
