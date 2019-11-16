import React from 'react';
import { Proforma, Debug } from 'react-proforma';

export class DemoForm1 extends React.Component {
  renderForm(proformaBundle) {
    const {
      values,
      handleSubmit,
      handleChange,
      handleFocus,
      handleBlur
    } = proformaBundle;

    return (
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="field1"
          value={values.field1}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button type="submit">Submit</button>
        <Debug />
      </form>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            field1: ''
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
