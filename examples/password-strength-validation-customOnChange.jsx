import React from 'react';
import { Proforma, Form, Field } from 'react-proforma';

/* example regexes */
const passwordStrengthRegexes = {
  medium: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/,
  strong: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
};

class PasswordStrength extends React.Component {
  constructor(props) {
    super(props);

    this.renderForm = this.renderForm.bind(this);

    /* use component state to track passwordStrength */
    this.state = {
      passwordStrength: 'weak'
    };
  }

  renderForm() {
    return (
      <Form>
        <div>
          <label htmlFor="password">Password:</label>
          <Field name="password" />
        </div>
        {this.state.passwordStrength}
      </Form>
    );
  }

  render() {
    return (
      <Proforma
        config={{
          initialValues: {
            password: ''
          },
          customOnChangeObject: {
            password: (event, setValues) => {
              /* This function will be called instead of Proforma's own change handler */

              const value = event.target.value;
              const { medium, strong } = passwordStrengthRegexes;

              /* === IMPORTANT!! === */
              /* Needed for view to update */
              setValues({ password: value });

              if (strong.test(value))
                this.setState({ passwordStrength: 'strong' });
              else if (medium.test(value))
                this.setState({ passwordStrength: 'medium' });
              else this.setState({ passwordStrength: 'weak' });
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
