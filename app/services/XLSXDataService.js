// @flow

import type { Teacher } from '../reducers/data';

export default function getTeachersData(worksheet: any): Teacher[] {
  const teachers = {};
  for (let i = 3; i <= 55; i += 2) {
    const teachersNamesD = worksheet[`D${i}`].v.split('/');
    const lessonTypeC = worksheet[`C${i - 1}`].v.split('/')[1];

    teachersNamesD.map(teacherName => {
      if (
        teachers[teacherName] &&
        teachers[teacherName].workingTime &&
        teachers[teacherName].lessonTypes &&
        teachers[teacherName].lessonTypes[lessonTypeC]
      ) {
        teachers[teacherName].workingTime += 2;
        teachers[teacherName].lessonTypes[lessonTypeC] += 2;
      } else {
        teachers[teacherName] = {
          workingTime: 2,
          lessonTypes: {
            [lessonTypeC]: 2
          }
        };
      }

      return true;
    });

    const teachersNamesF = worksheet[`F${i}`].v.split('/');

    teachersNamesF.map(teacherName => {
      if (teachers[teacherName] && teachers[teacherName].workingTime) {
        teachers[teacherName].workingTime += 2;
      } else {
        teachers[teacherName] = {};
        teachers[teacherName].workingTime = 2;
      }

      return true;
    });

    const teacherNameH = worksheet[`H${i}`].v.split('/');

    teacherNameH.map(teacherName => {
      if (teachers[teacherName] && teachers[teacherName].workingTime) {
        teachers[teacherName].workingTime += 2;
      } else {
        teachers[teacherName] = {};
        teachers[teacherName].workingTime = 2;
      }

      return true;
    });
  }

  const data: Teacher[] = Object.keys(teachers).map(key => {
    return { name: key, workingTime: teachers[key].workingTime };
  });

  return data;
}
