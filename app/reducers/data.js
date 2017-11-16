// @flow

import { LOAD_DATA } from '../actions/data';

export type Teacher = {
  data: string
};

export interface IState {
  +teachers: Teacher[]
}

const initialState = {
  teachers: {}
};


export default function data(state: any = initialState, action: any) {
  switch (action.type) {
    case LOAD_DATA:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
