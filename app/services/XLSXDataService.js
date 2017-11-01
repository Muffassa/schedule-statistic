// @flow

import type { Teacher } from '../reducers/data';
/**
 * {
 *  Взвод: [
 *    {предмет: РемЭСО, тема: 12.1, тип: лекция, кабинет: 700, преподаватели: [Шмаков, Варлаков, Быта]}
 *  ]
 * }
 * @param {*} worksheet
 */

export function getDataFromWorkSheet(worksheet: any) {
  const workSheetData = {};
  for (let i = 2; i <= 55; i += 2) {
    // добавить возможность загружать данные из нескольких ячеек
    const scheme = {
      troopNumber: [`B${i}`],
      subjectName: [`C${i}`],
      subjectType: [`C${i}`],
      themeNumber: [`C${i + 1}`],
      place: [`D${i}`],
      teachers: [`D${i + 1}`],
    };

    const { troopNumber, ...data } = getDataFrom(worksheet).by(scheme);
    const lesson = {
      ...data,
      subjectName: data.subjectName.split('/')[0],
      subjectType: data.subjectType.split('/')[1],
      teachers: data.teachers.split('/'),
    };

    workSheetData[troopNumber]
      ? workSheetData[troopNumber].push(lesson)
      : (workSheetData[troopNumber] = [{ ...lesson }]);
  }
  return workSheetData;
}

function getDataFrom(worksheet: any) {
  const by = scheme => Object.keys(scheme).reduce((result, key) => {
    const cellNumber = scheme[key];
    const worksheetData = worksheet[cellNumber].v;
    return { ...result, [key]: worksheetData };
  }, {});

  return {
    by,
  };
}

export default function getTeachersData(worksheet: any): Teacher[] {
  const teachers = {};
  for (let i = 3; i <= 55; i += 2) {
    const teachersNamesD = worksheet[`D${i}`].v.split('/');
    const lessonTypeC = worksheet[`C${i - 1}`].v.split('/')[1];

    teachersNamesD.map(teacherName => {
      if (teachers[teacherName]) {
        teachers[teacherName].workingTime += 2;
        teachers[teacherName].lessonTypes[lessonTypeC] += 2;
      } else {
        teachers[teacherName] = {
          workingTime: 2,
          lessonTypes: {
            [lessonTypeC]: 2,
          },
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

  const data: Teacher[] = Object.keys(teachers).map(key => ({ name: key, workingTime: teachers[key].workingTime }));

  return data;
}
