import React, { Component } from 'react';
import styles from './Home.css';
import SimpleBarChart from './SimpleBarChart';
// import { Teacher } from '../reducers/data';

export default class Home extends Component {
  constructor() {
    super();
    this.state = {
      dateFrom: '',
      dateTo: ''
    };
  }

  setDateFrom = (e) => this.setState({ dateFrom: e.target.value });
  setDateTo = (e) => this.setState({ dateTo: e.target.value });

  render() {
    const { loadAllTeachers } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <input type="date" value={this.state.dateFrom} onChange={this.setDateTo} />
          <input type="date" value={this.state.dateTo} onChange={this.setDateFrom} />
          <button onClick={loadAllTeachers}>Открыть документ</button>
          <SimpleBarChart data={this.props.teachers} />
        </div>
      </div>
    );
  }
}
