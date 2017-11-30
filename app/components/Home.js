import React, { Component } from 'react';
import moment from 'moment';
import RaisedButton from 'material-ui/RaisedButton';
import DatePicker from 'material-ui/DatePicker';
import { SelectField } from './';
import styles from './Home.css';

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
    if (troop.id) {
      dayTroopSchedules = dayTroopSchedules.filter(lesson => lesson.troop === troop.id);
    }

    const dayTroopLessonsId = dayTroopSchedules.reduce(
      (dayLessonsIds, schedule) => [...dayLessonsIds, ...schedule.lessons],
      [],
    );

    let selectedLessons = dayTroopLessonsId.map(id => lessons[id]);

    if (teacher.id) {
      selectedLessons = selectedLessons.filter(lesson => lesson.teachers.includes(teacher.id));
    }

    if (place.id) {
      selectedLessons = selectedLessons.filter(lesson => lesson.places.includes(place.id));
    }

    if (subject.id) {
      selectedLessons = selectedLessons.filter(lesson => lesson.subject === subject.id);
    }

    if (lessonType.id) {
      selectedLessons = selectedLessons.filter(lesson => lesson.type === lessonType.id);
    }

    const workLoad = selectedLessons.length * 2;

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

  render() {
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
    const { loadAllData } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <div>
            <DatePicker
              disableYearSelection
              autoOk
              cancelLabel="Отменить"
              locale="ru-RU"
              DateTimeFormat={DateTimeFormat}
              onChange={this.setDateFrom}
            />
            <DatePicker
              disableYearSelection
              autoOk
              cancelLabel="Отменить"
              locale="ru-RU"
              DateTimeFormat={DateTimeFormat}
              onChange={this.setDateTo}
            />
          </div>
          <SelectField
            data={teachersArray}
            onSelect={this.setCurrentTeacher}
            hintText="Выберите преподавателя"
          />
          <SelectField
            data={placesArray}
            onSelect={this.setCurrentPlace}
            hintText="Выберите аудиторию"
          />
          <SelectField
            data={subjectsArray}
            onSelect={this.setCurrentSubject}
            hintText="Выберите предмет"
          />
          <SelectField
            data={lessonTypesArray}
            onSelect={this.setCurrentLessonType}
            hintText="Выберите тип занятия"
          />
          <SelectField
            data={troopsArray}
            onSelect={this.setCurrentTroop}
            hintText="Выберите взвод"
          />
          <RaisedButton label="Посчитать загруженность" primary onClick={this.calculateWorkload} />
          <div className={styles.workload}>Загруженность часов{this.state.workLoad}</div>
          <RaisedButton label="Загрузить документ" primary onClick={loadAllData} />
        </div>
      </div>
    );
  }
}
