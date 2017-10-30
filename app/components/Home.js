import React, { Component } from 'react';
import styles from './Home.css';
import SimpleBarChart from './SimpleBarChart';
// import { Teacher } from '../reducers/data';

export default class Home extends Component {
  render() {
    const { loadAllTeachers } = this.props;
    return (
      <div>
        <div className={styles.container} data-tid="container">
          <button onClick={loadAllTeachers}>Open File</button>
          <SimpleBarChart data={this.props.teachers} />
        </div>
      </div>
    );
  }
}
