/* global expect, it, describe */

import { filterObject } from './index';

describe('Test utils', () => {
  it('should filter object keys', () => {
    const data = {
      '01.09': {
        data: 'asd',
      },
      10.09: {
        data: 'asd',
      },
      17.09: {
        data: 'asd',
      },
    };
    const expectResult = { '01.09': { data: 'asd' } };
    const result = filterObject(data, key => key === '01.09');

    expect(result).toEqual(expectResult);
  });
});
