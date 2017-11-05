// @flow
import { SSF } from 'xlsx';

export function getDataFromWorkSheet(worksheet: any) {
  const workSheetData = {};
  let dateCode;
  for (let i = 2; i <= 101; i += 2) {
    const scheme = {
      troopNumber: [`B${i}`],
      subjectName: [`C${i}`, `E${i}`, `G${i}`],
      themeNumber: [`C${i + 1}`, `E${i + 1}`, `G${i + 1}`],
      place: [`D${i}`, `F${i}`, `H${i}`],
      teachers: [`D${i + 1}`, `F${i + 1}`, `H${i + 1}`],
    };

    const getScheduleByScheme = makeXLSXParser(worksheet);

    const { troopNumber, subjectName, themeNumber, place, teachers } = getScheduleByScheme(scheme);

    const lessons = subjectName.map((subject, index) => ({
      subject: subject
        .toString()
        .toString()
        .split('/')[0],
      type: subject.toString().split('/')[1],
      thems: themeNumber[index].toString().split('/'),
      places: place[index].toString().split('/'),
      teachers: teachers[index].toString().split('/'),
    }));

    dateCode = worksheet[`A${i}`] ? worksheet[`A${i}`].v : dateCode;
    const { d, m } = SSF.parse_date_code(dateCode, { date1904: false });
    const day: string = `${d}.${m}`;
    const troopDaySchedule = {
      troop: troopNumber[0],
      lessons,
    };

    workSheetData[day]
      ? workSheetData[day].push(troopDaySchedule)
      : (workSheetData[day] = [{ ...troopDaySchedule }]);
  }
  return workSheetData;
}

const makeXLSXParser = worksheet => scheme =>
  Object.keys(scheme).reduce((result, key) => {
    const cellNumbers = scheme[key];
    const worksheetData = cellNumbers.map(
      cellNumber => (worksheet[cellNumber] ? worksheet[cellNumber].v : ''),
    );
    return { ...result, [key]: worksheetData };
  }, {});

export function getTeachersWorkload(data: any) {
  const teachersWorkload = Object.keys(data)
    .map(key => data[key])
    .reduce((prev, dateLessons) => prev.concat(dateLessons), [])
    .reduce((prev, lessonDays) => prev.concat(lessonDays.lessons), [])
    .map(lesson => lesson.teachers.map(teacher => ({ name: teacher, type: lesson.type })))
    .reduce((prev, dayTeachers) => prev.concat(dayTeachers), [])
    .reduce((prev, teacher) => {
      const { name, type } = teacher;
      if (prev[name]) {
        const { workload } = prev[name];
        const teacherWorkload = { ...prev[name], workload: workload + 2 };

        if (prev[name][type]) {
          const prevWorkloadByLessonType = prev[name][type];
          return { ...prev, [name]: { ...teacherWorkload, [type]: prevWorkloadByLessonType + 2 } };
        }

        return { ...prev, [name]: { ...teacherWorkload, [type]: 2 } };
      }

      return {
        ...prev,
        [name]: {
          workload: 2,
          [type]: 2,
        },
      };
    }, {});

  return Object.keys(teachersWorkload).map(teacherName => {
    const teacherData = teachersWorkload[teacherName];
    return Object.keys(teacherData).reduce((prev, key) => ({ ...prev, [key]: teacherData[key] }), {
      name: teacherName,
    });
  });
}
