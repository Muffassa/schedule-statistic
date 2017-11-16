// @flow
import openFileFromDialog from '../services/FileService';
import { type Teacher } from '../reducers/data';
import { XLSXDataService } from '../services';
import XLSX from 'xlsx';

export const TEACHERS_LOAD_ALL = 'TEACHERS_LOAD_ALL';
export const LOAD_DATA = 'LOAD_DATA';

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

export const loadData = (payload: any) => ({
  type: LOAD_DATA,
  payload
});

export function loadAllData() {
  return (dispatch: (action: actionType) => any) => {
    const { getDataFromWorkSheet } = XLSXDataService;
    const fileName = openFileFromDialog();
    const workbook = XLSX.readFile(fileName[0]);
    const firstSheetName = workbook.SheetNames[0];
    const workSheet = workbook.Sheets[firstSheetName];
    const payload = getDataFromWorkSheet(workSheet);
    dispatch(loadData(payload));
  };
}
