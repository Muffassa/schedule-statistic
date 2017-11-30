import { SSF } from 'xlsx';
// import moment from 'moment';
import { schema, normalize } from 'normalizr';
import md5 from 'blueimp-md5';

// import { filterObject } from '../utils';

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
    dateCode = worksheet[`A${i}`] ? worksheet[`A${i}`].v : dateCode;

    const lessons = subjectName.map((subject, index) => {
      const subjectTitle = subject.toString().split('/')[0];
      const subjectType = subject.toString().split('/')[1];
      return {
        id: md5(`${dateCode}${troopNumber[0]}${index}`),
        subject: { id: md5(subjectTitle), title: subjectTitle },
        type: { id: md5(subjectType), type: subjectType },
        thems: arrayToObjects(themeNumber[index].toString().split('/')),
        places: arrayToObjects(place[index].toString().split('/')),
        teachers: arrayToObjects(teachers[index].toString().split('/')),
      };
    });

    const { d, m } = SSF.parse_date_code(dateCode, { date1904: false });
    const day: string = `${d}.${m}`;
    const troopDaySchedule = {
      id: md5(`${dateCode}${troopNumber[0]}${i}`),
      troop: { data: troopNumber[0], id: md5(troopNumber[0]) },
      lessons,
    };

    workSheetData[day]
      ? workSheetData[day].push(troopDaySchedule)
      : (workSheetData[day] = [{ ...troopDaySchedule }]);
  }

  return normalizeData(workSheetData);
}

const makeXLSXParser = worksheet => scheme =>
  Object.keys(scheme).reduce((result, key) => {
    const cellNumbers = scheme[key];
    const worksheetData = cellNumbers.map(
      cellNumber => (worksheet[cellNumber] ? worksheet[cellNumber].v : ''),
    );
    return { ...result, [key]: worksheetData };
  }, {});

// Converts array of data into array of objects with id
function arrayToObjects(data) {
  const result = data.map(element => ({ id: md5(element), data: element }));
  return result;
}

function normalizeData(data) {
  const formatedData = Object.keys(data).map((date, i) => ({ id: i, date, schedule: data[date] }));
  const teacher = new schema.Entity('teachers');
  const place = new schema.Entity('places');
  const subject = new schema.Entity('subjects');
  const type = new schema.Entity('lessonTypes');
  const troop = new schema.Entity('troops');
  const lesson = new schema.Entity('lessons', { teachers: [teacher], places: [place], subject, type });
  const troopScedules = new schema.Entity('troopSchedules', { lessons: [lesson], troop });
  const dateSchedule = new schema.Entity(
    'dateSchedules',
    { schedule: [troopScedules] },
    { idAttribute: 'date' },
  );
  const mySchema = [dateSchedule];
  const result = normalize(formatedData, mySchema);
  return result.entities;
}
