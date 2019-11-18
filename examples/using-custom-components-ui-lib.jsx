import React from 'react';
import styled from 'styled-components';
import {
  Button as MuiButton,
  Radio as MuiRadio,
  TextField as MuiTextField,
  Checkbox as MuiCheckbox
} from '@material-ui/core';
import { Proforma, Form, Checkbox, Field, Radio, Submit } from 'react-proforma';

/* Example css-in-js component */
const StyledInput = styled.input`
  color: blue;
  font-size: 35px;
  font-weight: 600;
  padding: 8px;
`;

class UsingCustomComponents extends React.Component {
  renderForm() {
    return (
      <Form>
        <div>
          <label htmlFor="mui-text">MuiText:</label>
          <Field name="muiText" component={MuiTextField} id="mui-text" />
        </div>
        <div>
          <label htmlFor="styled-text">StyledText:</label>
          <Field name="styledText" component={StyledInput} id="styled-text" />
        </div>
        <div>
          <label htmlFor="checkbox">checkbox: </label>
          <Checkbox
            component={MuiCheckbox}
            name="checkbox"
            id="checkbox"
            color="primary"
          />
        </div>
        <div>
          <label htmlFor="radio1">radio1</label>
          <Radio component={MuiRadio} name="radio" value="radio1" id="radio1" />
          <label htmlFor="radio2">radio2</label>
          <Radio component={MuiRadio} name="radio" value="radio2" id="radio2" />
          <label htmlFor="radio3">radio3</label>
          <Radio component={MuiRadio} name="radio" value="radio3" id="radio3" />
        </div>
        <div>
          <Submit component={MuiButton} />
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            muiText: '',
            styledText: '',
            checkbox: true,
            radio: 'radio1'
          }
        }}
        handleSubmit={(values) => console.log(values)}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
