import React from 'react';
import { Proforma, Form, Field } from 'react-proforma';

class RestrictUserInput extends React.Component {
  renderForm() {
    return (
      <Form>
        <div>
          <label htmlFor="amount">Amount:</label>
          <Field name="amount" />
        </div>
      </Form>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            amount: ''
          },
          customOnChangeObject: {
            amount: (event, setValues) => {
              /* This function will be called instead of Proforma's own change handler */

              const value = event.target.value;

              /* Conditionally update view, only if input is a number */
              if (value.length > 0) {
                const pValue = parseFloat(value);
                if (isNaN(pValue)) return;
              }

              /* The value passes the isNaN test, so update view */
              setValues({ amount: value });
            }
          }
        }}
        handleSubmit={(values) => console.log(values)}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
