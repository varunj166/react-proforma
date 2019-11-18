import React from 'react';
import {
  Proforma,
  Form,
  Field,
  Select,
  Radio,
  Checkbox,
  Textarea,
  Submit,
  Reset
} from 'react-proforma';

class AllComponents extends React.Component {
  renderForm() {
    return (
      <Form>
        <div>
          <label htmlFor="fieldInputText">Field (text)</label>
          <Field name="fieldInputText" type="text" id="fieldInputText" />
        </div>
        <div>
          <label htmlFor="fieldInputRange">Field (range)</label>
          <Field name="fieldInputRange" type="range" id="fieldInputRange" />
        </div>
        <div>
          <label htmlFor="selectInput">Select</label>
          <Select name="selectInput" id="selectInput">
            <option value="chocolate">Chocolate</option>
            <option value="strawberry">Strawberry</option>
            <option value="peppermint">Peppermint</option>
          </Select>
        </div>
        <div>
          <label htmlFor="gender-male">Male</label>
          <Radio name="radioInput" value="male" id="gender-male" />

          <label htmlFor="gender-female">Female</label>
          <Radio name="radioInput" value="female" id="gender-male" />

          <label htmlFor="gender-other">Other</label>
          <Radio name="radioInput" value="other" id="gender-other" />
        </div>
        <div>
          <label htmlFor="checkboxInput">Checkbox</label>
          <Checkbox name="checkboxInput" id="checkboxInput" />
        </div>
        <div>
          <label htmlFor="textareaInput">Textarea</label>
          <Textarea name="textareaInput" id="textareaInput" />
        </div>
        <div>
          <Submit />
          <Reset />
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            fieldInputText: '',
            fieldInputRange: '50',
            selectInput: 'chocolate',
            radioInput: 'male',
            checkboxInput: true,
            textareaInput: ''
          }
        }}
        handleSubmit={(values) => console.log(values)}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
