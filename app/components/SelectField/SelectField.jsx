// @flow
import React, { Component } from 'react';
import MUISelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class SelectField extends Component {
  state = {
    value: '',
  };

  handleChange = (event: any, index: any, value: any) => {
    // TODO: пределать дублирование с 21 строкой
    let { data } = this.props;
    data = [ {data: null, id: null }, ...data];
    this.setState({value});
    // У нас может быть либо масив здесь если выбрали несколько элементов
    // Тогда отдаем этот масив
    // Если у нас один элемент выбрали то засовываем его в масив
    // Чтоб на выходе был один форма
    // Масив с объектам формата [{id: ..., data: ...}]
    const selectedData = Array.isArray(value)
      ? value
      : [value];
    const formatedData = selectedData.map((v, i) => {
      const selected = data.find((element) => element.data === v );
      return ({ id: selected.id , data: selected.data });
    });
    this.props.onSelect(formatedData);
  };

  menuItems(values: any) {
    let { data } = this.props;
    data = [ {data: null, id: null }, ...data];
    return data.map((element) => (
      <MenuItem
        key={element.id}
        insetChildren={true}
        checked={values && (""+values).indexOf(element.data) > -1}
        value={element.data}
        primaryText={element.data}
      />
    ));
  }

  render() {
    const {value} = this.state;
    const { hintText, disabled, className, multiple } = this.props;
    return (
      <div className={className}>
        <MUISelectField
          multiple={multiple}
          hintText={hintText}
          value={value}
          onChange={this.handleChange}
          disabled={disabled}
        >
          {this.menuItems(value)}
        </MUISelectField>
      </div>
    );
  }
}