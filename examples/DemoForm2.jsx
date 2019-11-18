import React from 'react';
import './DemoForm2.css'; /* css file located in <root>/demo/DemoForm2.css */
import {
  Proforma,
  Form,
  Field,
  Submit,
  Debug,
  fieldValidator,
  fieldError
} from 'react-proforma';

function FieldError(props) {
  return <p className="field-error">{props.error}</p>;
}

export class DemoForm2 extends React.Component {
  renderForm() {
    return (
      <div className="outer-wrapper">
        <div className="form-wrapper">
          <Form>
            <div className="field-row">
              <label htmlFor="name-field">Name:</label>
              <Field
                name="name"
                type="text"
                className="form-field"
                id="name-field"
                placeholder="E.g. Billy Bob"
              />
            </div>
            {fieldError('name', FieldError)}
            <div className="field-row">
              <label htmlFor="email-field">Email:</label>
              <Field
                name="email"
                type="text"
                className="form-field"
                id="email-field"
                placeholder="E.g. billy@bob.com"
              />
            </div>
            {fieldError('email', FieldError)}
            <div className="field-row">
              <label htmlFor="password-field">Password:</label>
              <Field
                name="password"
                type="password"
                className="form-field"
                id="password-field"
              />
            </div>
            {fieldError('password', FieldError)}
            <div className="field-row">
              <label htmlFor="password2-field">Re-enter Password:</label>
              <Field
                name="password2"
                type="password"
                className="form-field"
                id="password2-field"
              />
            </div>
            {fieldError('password2', FieldError)}
            <Submit className="submit-button" />
          </Form>
        </div>
        <div className="debug-wrapper">
          <Debug />
        </div>
      </div>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            name: '',
            email: '',
            password: '',
            password2: ''
          },
          validationObject: {
            name: (values) => {
              return fieldValidator(values.name)
                .required()
                .regex(
                  /^[a-zA-Z\s]*$/,
                  'Your name can only contain letters and spaces.'
                )
                .end();
            },
            email: (values) => {
              return fieldValidator(values.email)
                .required()
                .email()
                .end();
            },
            password: (values) => {
              return fieldValidator(values.password)
                .required()
                .regex(
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
                  'Please enter a stronger password!'
                )
                .end();
            },
            password2: (values) => {
              return fieldValidator(values.password2)
                .required()
                .equals(values.password, 'Your passwords must match exactly!')
                .end();
            }
          }
        }}
        handleSubmit={(values) => {
          console.log('The form has been submitted!', values);
        }}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
