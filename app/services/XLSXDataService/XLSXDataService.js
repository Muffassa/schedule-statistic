import { SSF } from 'xlsx';
// import moment from 'moment';
import { schema, normalize } from 'normalizr';
import md5 from 'blueimp-md5';

// import { filterObject } from '../utils';

export function getDataFromWorkSheet(worksheet: any) {
  const workSheetData = {};
  let dateCode;
  // Получаем из данных формата "Q23:A22" номер последней строки
  const numbeOfElements = parseInt(worksheet['!ref'].split(':')[1].replace(/^\D+/g, ''), 10);
  for (let i = 2; i <= numbeOfElements; i += 2) {
    const scheme = {
      troopNumber: [`B${i}`],
      subjectName: [`C${i}`, `F${i}`, `I${i}`, `L${i}`, `O${i}`],
      subjectType: [`D${i + 1}`, `G${i + 1}`, `J${i + 1}`, `M${i + 1}`, `P${i + 1}`],
      themeNumber: [`C${i + 1}`, `F${i + 1}`, `I${i + 1}`, `L${i + 1}`, `O${i + 1}`],
      place: [`E${i}`, `H${i}`, `K${i}`, `N${i}`, `Q${i}`],
      teachers: [`E${i + 1}`, `H${i + 1}`, `K${i + 1}`, `N${i + 1}`, `Q${i + 1}`],
    };

    const getScheduleByScheme = makeXLSXParser(worksheet);

    const {
      troopNumber,
      subjectName,
      themeNumber,
      place,
      teachers,
      subjectType
    } = getScheduleByScheme(scheme);

    //  Если все поля пустые то пропустить цикл
    if (
      troopNumber[0] === ''
      && subjectName[0] === ''
      && themeNumber[0] === ''
      && place[0] === ''
      && teachers[0] === ''
      && subjectType[0] === ''
    ) {
      continue;
    }

    dateCode = worksheet[`A${i}`] ? worksheet[`A${i}`].w : dateCode;
    const lessons = subjectName.map((subject, index) => {
      const subjectTitle = subject.toString().split('/')[0];
      const duration = index > 2
        ? 1
        : 2; // 4 и 5 занятия длятся по часу, 1/2/3 2 часа
      return {
        id: md5(`${dateCode}${troopNumber[0]}${index}`),
        subject: { id: md5(subjectTitle), title: subjectTitle },
        type: { id: md5(subjectType[index]), type: subjectType[index] },
        thems: arrayToObjects(themeNumber[index].toString().split('/')),
        places: arrayToObjects(place[index].toString().split('/')),
        teachers: arrayToObjects(teachers[index].toString().split('/')),
        duration
      };
    });

    const troopDaySchedule = {
      id: md5(`${dateCode}${troopNumber[0]}${i}`),
      troop: { data: troopNumber[0], id: md5(troopNumber[0]) },
      lessons,
    };

    workSheetData[dateCode]
      ? workSheetData[dateCode].push(troopDaySchedule)
      : (workSheetData[dateCode] = [{ ...troopDaySchedule }]);
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
