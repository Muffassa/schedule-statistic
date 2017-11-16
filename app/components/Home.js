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
      selectedTeacher: {
        workload: 0,
      },
    };
  }

  loadTeachersWorkload = teacher => {
    const { dateFrom, dateTo } = this.state;
    const momentDateFrom = moment(dateFrom);
    const momentDateTo = moment(dateTo);
    const { dateSchedules, troopSchedules, lessons } = this.props;
    if (!dateFrom && !dateTo) {
      throw new Error('Выберите дату');
    }

    const teacherWorkload = Object.keys(dateSchedules)
      .filter(date => {
        const [day, month] = date.split('.');
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
        const { schedule } = dateSchedules[date];
        return [...troopScedules, ...schedule];
      }, [])
      .reduce(
        (troopLessons, troopSceduleId) => [
          ...troopLessons,
          ...troopSchedules[troopSceduleId].lessons,
        ],
        [],
      )
      .reduce((teachers, lessonId) => [...teachers, ...lessons[lessonId].teachers], [])
      .reduce((workload, teacherId) => {
        const workingTime = teacher.id === teacherId ? 2 : 0;
        return workload + workingTime;
      }, 0);

    this.setState({ selectedTeacher: { ...teacher, workload: teacherWorkload } });
  };

  setDateFrom = (info, date) => {
    this.setState({ dateFrom: date });
  };

  setDateTo = (info, date) => {
    this.setState({ dateTo: date });
  };

  render() {
    const DateTimeFormat = global.Intl.DateTimeFormat;
    const { teachers } = this.props;
    const teachersArray = Object.keys(teachers).map(key => teachers[key]);
    const { loadAllData } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
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
          <SelectField data={teachersArray} onSelect={this.loadTeachersWorkload} />
          <div>Загруженность {this.state.selectedTeacher.workload}</div>
          <RaisedButton label="Загрузить документ" primary onClick={loadAllData} />
        </div>
      </div>
    );
  }
}
