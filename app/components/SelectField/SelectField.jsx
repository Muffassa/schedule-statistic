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
    this.props.onSelect({ id: data[index].id, data: value });
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
    const { hintText } = this.props;
    return (
      <MUISelectField
        hintText={hintText}
        value={value}
        onChange={this.handleChange}
      >
        {this.menuItems(value)}
      </MUISelectField>
    );
  }
}