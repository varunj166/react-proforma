# React Proforma

### React Proforma helps you build simple to complex forms with ease in React for the web.

#### Simplicity where you want it. Flexibility where you need it.

---

# Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [What about Formik?](#what-about-formik?)
- [API](#api)

---

## Installation

Install using npm:

`npm install react-proforma`

---

## Usage

We'll start with a very basic, no-frills example, just to give you a feel for what's going on. After that, I'll demonstrate code that is more like what you would normally use, including using React Proforma's custom form elements that are all hooked up internally.

(_Note_: I prefer using class components because I find they better organize my code. You are of course, free to use function components.)

(_Note2_: All imports are named imports, so don't forget your curly brackets!)

```javascript
import React from 'react';
import { Proforma } from 'react-proforma';

class MyAwesomeForm extends React.Component {
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
        <button role="submit">Submit</button>
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
        handleSubmit={() => {
          console.log('Form has been submitted!');
        }}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
```
