// @flow

import { TEACHERS_LOAD_ALL } from '../actions/data';

export type Teacher = {
  +name: string,
  +workload: number
};

export interface IState {
  +teachers: Teacher[]
}

const initialState: IState = { teachers: [] };


export default function data(state: IState = initialState, action: any) {
  switch (action.type) {
    case TEACHERS_LOAD_ALL:
      return {
        ...state,
        teachers: action.payload
      };
    default:
      return state;
  }
}
