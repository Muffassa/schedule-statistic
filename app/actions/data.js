// @flow
import openFileFromDialog from '../services/FileService';
import { type Teacher } from '../reducers/data';
import { XLSXDataService } from '../services';

import XLSX from 'xlsx';

export type actionType = {
  +type: string,
  +payload: Teacher[]
};

export function loadTeachers(teachers: Teacher[]): actionType {
  return {
    type: TEACHERS_LOAD_ALL,
    payload: teachers,
  };
}

export const TEACHERS_LOAD_ALL = 'TEACHERS_LOAD_ALL';

export function loadAllTeachers() {
  return (dispatch: (action: actionType) => any) => {
    const { getDataFromWorkSheet, getTeachersWorkload } = XLSXDataService;
    const fileName = openFileFromDialog();
    const workbook = XLSX.readFile(fileName[0]);
    const firstSheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[firstSheetName];
    debugger;
    const data = getDataFromWorkSheet(workSheet);
    const teachers = getTeachersWorkload(data);
    dispatch(loadTeachers(teachers));
  };
}
