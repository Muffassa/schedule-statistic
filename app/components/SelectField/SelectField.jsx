// @flow
import React, { Component } from 'react';
import MUISelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class SelectField extends Component {
  state = {
    value: '',
  };

  handleChange = (event: any, index: any, value: any) => {
    const { data } = this.props;
    this.setState({value});
    this.props.onSelect({ id: data[index].id, data: value });
  };

  menuItems(values: any) {
    const { data } = this.props;
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