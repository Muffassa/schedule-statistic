/* global expect, it, describe */

import { getTeachersWorkload, getTeachersWorkloadForPeriod } from './XLSXDataService';
import data from './data';

describe('description', () => {
  it('Return teachers workload', () => {
    const result = [
      { name: 'Варлаков', workload: 54, практика: 54 },
      { name: 'Беликов', workload: 54, практика: 54 },
      { name: 'Чикирев', workload: 54, практика: 54 },
    ];
    expect(getTeachersWorkload(data)).toEqual(result);
  });

  it('Return teachers workload for period', () => {
    const result = [
      { name: 'Варлаков', workload: 54, практика: 54 },
      { name: 'Беликов', workload: 54, практика: 54 },
      { name: 'Чикирев', workload: 54, практика: 54 },
    ];
    const from = '01.09';
    const to = '30.09';
    expect(getTeachersWorkloadForPeriod(data, from, to)).toEqual(result);
  });

  it('Return teachers workload for not availiable period', () => {
    const result = false;
    const from = '01.10';
    const to = '10.10';
    expect(getTeachersWorkloadForPeriod(data, from, to)).toBe(result);
  });
});
