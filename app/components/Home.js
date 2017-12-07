import React, { Component } from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import { SelectField } from './';
import styles from './Home.css';
import { dialog } from 'electron';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      dateFrom: null,
      dateTo: null,
      teacher: {},
      place: {},
      subject: {},
      lessonType: {},
      troop: {},
      workLoad: 0,
    };
  }

  setCurrentTeacher = teacher => this.setState({ teacher });
  setCurrentLessonType = lessonType => this.setState({ lessonType });
  setCurrentPlace = place => this.setState({ place });
  setCurrentSubject = subject => this.setState({ subject });
  setCurrentTroop = troop => this.setState({ troop });

  setDateFrom = (info, date) => {
    this.setState({ dateFrom: date });
  };

  setDateTo = (info, date) => {
    this.setState({ dateTo: date });
  };

  calculateWorkload = () => {
    const { dateFrom, dateTo, troop, teacher, place, subject, lessonType } = this.state;

    const { dateSchedules, troopSchedules, lessons } = this.props;

    const selectedDatesSchedule = this.getTroopsSchedulesByDates(dateFrom, dateTo, dateSchedules);
    let dayTroopSchedules = selectedDatesSchedule.map(
      troopDayScheduleId => troopSchedules[troopDayScheduleId],
    );
    if (troop.length) {
      dayTroopSchedules = dayTroopSchedules.filter(lesson =>
        troop.find(t => t.id === lesson.troop),
      );
    }

    const dayTroopLessonsId = dayTroopSchedules.reduce(
      (dayLessonsIds, schedule) => [...dayLessonsIds, ...schedule.lessons],
      [],
    );

    let selectedLessons = dayTroopLessonsId.map(id => lessons[id]);

    if (teacher.length) {
      // У преподов нам нужно включать все массивы, которые подходят для каждого препода
      selectedLessons = teacher.reduce(
        (lessonsArray, t) => [
          ...selectedLessons.filter(lesson => lesson.teachers.includes(t.id)),
          ...lessonsArray,
        ],
        [],
      );
    }

    if (place.length) {
      const selectedPlace = place[0];
      selectedLessons = selectedLessons.filter(lesson => lesson.places.includes(selectedPlace.id));
    }

    if (subject.length) {
      const selectedSubject = subject[0];
      selectedLessons = selectedLessons.filter(lesson => lesson.subject === selectedSubject.id);
    }
    if (lessonType.length) {
      selectedLessons = selectedLessons.filter(lesson =>
        lessonType.find(l => l.id === lesson.type),
      );
    }

    const workLoad = selectedLessons.reduce(
      (fullWorkload, lesson) => fullWorkload + lesson.duration,
      0,
    );

    this.setState({ workLoad });
  };

  getTroopsSchedulesByDates = (dateFrom, dateTo, fullSchedule) =>
    Object.keys(fullSchedule)
      .filter(date => {
        const [day, month] = date.split('.');
        const momentDateFrom = moment(dateFrom);
        const momentDateTo = moment(dateTo);
        const momentDate = moment()
          .date(day)
          .month(month - 1)
          .hour(0)
          .minute(0)
          .second(0)
          .millisecond(0);
        return (
          moment(momentDate).isSameOrAfter(momentDateFrom) &&
          moment(momentDate).isSameOrBefore(momentDateTo)
        );
      })
      .reduce((troopScedules, date) => {
        const { schedule } = fullSchedule[date];
        return [...troopScedules, ...schedule];
      }, []);

  dataSelectors = isLoadedFile => {
    const DateTimeFormat = global.Intl.DateTimeFormat;
    const { teachers, places, subjects, lessonTypes, troops } = this.props;
    const placesArray = Object.keys(places).map(key => places[key]);
    const teachersArray = Object.keys(teachers).map(key => teachers[key]);
    const subjectsArray = Object.keys(subjects).map(key => ({
      data: subjects[key].title,
      id: subjects[key].id,
    }));
    const lessonTypesArray = Object.keys(lessonTypes)
      .map(key => ({
        data: lessonTypes[key].type,
        id: lessonTypes[key].id,
      }))
      .filter(lessonType => lessonType.data);
    const troopsArray = Object.keys(troops).map(key => troops[key]);
    const { dateFrom, dateTo } = this.state;
    const disabled = !dateFrom && !dateTo;

    if (isLoadedFile) {
      return (
        <div className={styles.selectorWrapper}>
          <div className={styles.datePickWrapper}>
            <DatePicker
              disableYearSelection
              autoOk
              cancelLabel="Отменить"
              locale="ru-RU"
              DateTimeFormat={DateTimeFormat}
              onChange={this.setDateFrom}
              hintText="Выберите с какого числа"
            />
            <DatePicker
              disableYearSelection
              autoOk
              cancelLabel="Отменить"
              locale="ru-RU"
              DateTimeFormat={DateTimeFormat}
              onChange={this.setDateTo}
              hintText="Выберите по какое число"
            />
          </div>
          <SelectField
            data={teachersArray}
            onSelect={this.setCurrentTeacher}
            hintText="Выберите преподавателя"
            disabled={disabled}
            className={styles.selector}
            multiple
          />
          <SelectField
            data={placesArray}
            onSelect={this.setCurrentPlace}
            hintText="Выберите аудиторию"
            disabled={disabled}
            className={styles.selector}
          />
          <SelectField
            data={subjectsArray}
            onSelect={this.setCurrentSubject}
            hintText="Выберите предмет"
            className={styles.selector}
            disabled={disabled}
          />
          <SelectField
            data={lessonTypesArray}
            onSelect={this.setCurrentLessonType}
            hintText="Выберите тип занятия"
            className={styles.selector}
            disabled={disabled}
            multiple
          />
          <SelectField
            data={troopsArray}
            onSelect={this.setCurrentTroop}
            hintText="Выберите взвод"
            className={styles.selector}
            disabled={disabled}
            multiple
          />
          <RaisedButton
            label="Посчитать загруженность"
            primary
            onClick={this.calculateWorkload}
            className={styles.workloadButton}
          />
          <div className={styles.workload}>Загруженность {this.state.workLoad} часов</div>
        </div>
      );
    }
    return '';
  };
  render() {
    const { teachers, loadAllData } = this.props;
    const teachersArray = Object.keys(teachers).map(key => teachers[key]);
    const isLoadedFile = Boolean(teachersArray.length);
    return (
      <div>
        <div className={styles.container} data-tid="container">
          {this.dataSelectors(isLoadedFile)}
          <RaisedButton
            label="Загрузить документ"
            primary
            onClick={loadAllData}
            className={styles.fileLoadButton}
          />
        </div>
      </div>
    );
  }
}
