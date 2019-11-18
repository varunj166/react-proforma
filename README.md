![Banner](images/banner.png 'Banner')

[![Build Status](https://travis-ci.org/varunj166/react-proforma.svg?branch=master?type=flat)](https://travis-ci.org/varunj166/react-proforma)

# React Proforma <!-- omit in toc -->

### React Proforma helps you build simple to complex forms with ease in React for the web. <!-- omit in toc -->

**Simplicity where you want it. Flexibility where you need it.**

Easily manage multiple form fields, validation, focus handling, and form submission. Use custom components (styled with css-in-js or from a UI library) or standard react elements anywhere you like. React Proforma is a complete form-solution that has been performance-optimized, and will make building your next React web form a breeze!

---

# Table of Contents <!-- omit in toc -->

- [Installation](#installation)
- [Basic Usage](#basic-usage)
  - [Step 1: Build the scaffolding:](#step-1-build-the-scaffolding)
  - [Step 2: Add `config` and `handleSubmit` props to the `Proforma` component](#step-2-add-config-and-handlesubmit-props-to-the-proforma-component)
  - [Step 3: Fill in `renderForm`](#step-3-fill-in-renderform)
- [Normal Usage](#normal-usage)
  - [Form Mark-Up](#form-mark-up)
  - [Validation](#validation)
  - [Cross-Field Validation](#cross-field-validation)
  - [Displaying Errors](#displaying-errors)
  - [Wrap-up](#wrap-up)
- [Typescript](#typescript)
- [Going further](#going-further)
  - [Using Custom Components/UI LIbs](#using-custom-componentsui-libs)
  - [Using `Proforma.config.customOnChange`](#using-proformaconfigcustomonchange)
- [API](#api)
  - [Components](#components)
    - [Proforma](#proforma)
    - [Form](#form)
    - [Field](#field)
    - [Checkbox](#checkbox)
    - [Radio](#radio)
    - [Select](#select)
    - [Textarea](#textarea)
    - [Submit](#submit)
    - [Reset](#reset)
    - [Debug](#debug)
  - [ProformaBundle](#proformabundle)
  - [Helper functions](#helper-functions)
    - [fieldValidator](#fieldvalidator)
    - [fieldError](#fielderror)
    - [fieldValid](#fieldvalid)
- [Running tests](#running-tests)
- [What about React Native?](#what-about-react-native)
- [What About Formik?](#what-about-formik)

---

## Installation

Install using npm:

`npm install react-proforma`

---

## Basic Usage

We'll start by building up a very basic, no-frills example with a single field and a submit button, just to give you a feel for what's going on. After that, I'll demonstrate code that is more like what you would normally use, including using React Proforma's custom form elements that are all hooked up internally.

Please note:

- I prefer using class components because I find they better organize my code. You are, of course, free to use function components.
- **_All exports are named exports_**, so don't forget your curly brackets on your import statements!

### Step 1: Build the scaffolding:

```javascript
import React from 'react';
import { Proforma } from 'react-proforma';

class DemoForm1 extends React.Component {
  renderForm(proformaBundle) {
    /* to be filled in shortly */
  }

  render() {
    return (
      <Proforma>
        {this.renderForm}
      </Proforma>
    );
  }
}
```

- Notice how the component's `render` method is returning the `Proforma` component, and inside that is a reference to a function that I've called `renderForm` (which is currently empty).
- The sole argument passed to `renderForm` is the bundle of methods and properties you will need for your form to function. I've assigned this argument the name `proformaBundle`.
- Please note that **there are no parentheses** next to `this.renderForm`! This is a function reference, not a function invocation.

### Step 2: Add `config` and `handleSubmit` props to the `Proforma` component

```javascript
import React from 'react';
import { Proforma } from 'react-proforma';

class DemoForm1 extends React.Component {
  renderForm(proformaBundle) {
    /* to be filled in shortly */
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
```

- `Proforma.config` accepts an object (note the double curly braces) with one required property (`initialValues`) and a few optional properties (we'll learn more about those later).
  - `initialValues` is a required property, whose value must be an object, whose properties must correspond with the names of your form fields (i.e. name, email, password, etc.), and whose values are the initial value you'd like to set for each respective form field.
  - In this example, I have a single field name ('field1' here), and I've set it to have an initial value of `''` (empty string).
  - Please note that form field values in React and HTML can only be boolean (for checkboxes) or strings. So if you pass in any other type of value to `initialValues`, it will be ignored, and empty string `''` will be used.
- `Proforma.handleSubmit` is any function you want to have executed when the form is submitted. [See the api](#proforma) for details, including what arguments are passed to your `handleSubmit` function on execution.
- There will be nothing on your screen because `renderForm` isn't returning anything. Let's fix that next.

### Step 3: Fill in `renderForm`

```javascript
import React from 'react';
import { Proforma } from 'react-proforma';

class DemoForm1 extends React.Component {
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
```

**I know this looks ugly, but React Proforma's custom form elements will clean this all up very quickly! I just wanted to show you the manual set up first.**

- We begin by destructuring out `values`, `handleSubmit`, `handleChange`, `handleFocus`, and `handleBlur` from `proformaBundle`.
  - [See the ProformaBundle docs](#proformaBundle) for a full breakdown of all the properties and methods you can access from inside `proformaBundle`.
- `renderForm` then returns a regular React form component.
- I manually assign the various handlers to their respective event hooks in the `form` and `input` elements, set the `name` prop on the `input` element to be 'field1', and hook up the `value` prop of the input to `values.field1`.

At this point, we have a fully functioning form. The input is completely controlled, and you can submit the form by clicking the submit button (your console should display the message "The form has been submitted!", followed by the form values).

![Demo Form 1](demo/screenshots/demo-form-1.png 'Demo Form 1')

[**Check out the complete code for this form here.**](/examples/DemoForm1.jsx)

---

## Normal Usage

Now that you've seen the nuts and bolts, let's clean it up and create a more complete example, with multiple fields (and types of fields), validation, and custom components.

### Form Mark-Up

#### Introducing `Form`, `Field`, and `Submit` <!-- omit in toc -->

We'll create a sign-up form with name, email address, and password fields to start.

```javascript
import React from 'react';
import './DemoForm2.css';
import { Proforma, Form, Field, Submit, Debug } from 'react-proforma';

class DemoForm2 extends React.Component {
  renderForm() {
    return (
      <div className="outer-wrapper">        
        {/* === FORM STARTS HERE === */}
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
          <div className="field-row">
            <label htmlFor="password-field">Password:</label>
            <Field
              name="password"
              type="password"
              className="form-field"
              id="password-field"
            />
          </div>
          <Submit className="submit-button" />
        </Form>
        {/* === FORM ENDS HERE === */}        
        <div className="debug-wrapper">
          {/* DEBUG COMPONENT */}
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
            password: ''
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
```

With some styling divs here and there, this code produces the following form:

**([Grab the css file](demo/DemoForm2.css) if you want to follow along exactly.)**

![Demo Form 2a](demo/screenshots/demo-form-2-a.png 'Demo Form 2a')

**NOTE: That window you see on the right is a `Debug` component I made in case you ever want to see the current internal Proforma state. Just `import { Debug } from 'react-proforma'` and insert the component anywhere.**

The styling divs clutter things up a little, but I want you to just focus on the props passed to the `Proforma` component, as well as the `Form` element inside the `renderForm` method.

- **Proforma props**
  - Again we have our `config` prop. Inside `config` is an object with a single property (for now) called 'initialValues', which contains the names of all the form fields our form is going to have, and their respective initial values.
  - Our `handleSubmit` is again going to just console log our values.
- **Looking inside `renderForm`: `Form`, `Field`, and `Submit`**
  - Here is our first exposure to the [`Form`](#form), [`Field`](#field), and [`Submit`](#submit) components imported from React Proforma.
  - Using these components, **you no longer have to wire up your form functionality manually** -- these components are all hooked up for you.
  - For `Field`, all you have to do is pass in a `name` (that corresponds with one of the keys on your `initialValues` object) and a `type` (defaults to "text") as props, along with whatever other props you'd want passed down to the input element that will be returned (e.g. id, className, style, placeholder, maxLength, etc.)
  - (Much more customization is possible with all components exported from React Proforma. [See the API](#api) for more information.

[**See an example that shows each React Proforma component in action.**](/examples/all-react-proforma-components.jsx)

Alright, so everything looks good, but we're going to need some **validation**.

Thankfully, React Proforma makes that almost comically easy!

### Validation

**Enter the `validationObject`.**

First, let's do it the long way:

```javascript
<Proforma
  config={{
    initialValues: {
      name: '',
      email: '',
      password: ''
    },
    validationObject: {
      name: (values) => {
        const { name } = values;
        const errors = [];
        if (name.length === 0) {
          errors.push('This field is required.');
        }
        if (!/^[a-zA-Z\s]*$/.test(name)) {
          errors.push('Your name can only contain letters and spaces.');
        }
        if (errors.length > 0) {
          return errors;
        }
        return null;
      }
    }
  }}
  handleSubmit={(values) => {
    console.log('The form has been submitted!', values);
  }}
>
  {this.renderForm}
</Proforma>
```

So what's going on here.

- `validationObject` is another property on the object passed to the `config` prop. Here, the keys are one of the form field names (I used the 'name' form field here), and the values are a function which accepts **all** of the current form values, and returns either an array of strings or null.
- In this example, I destructure the 'name' value from `values`, set up an empty errors array, and then run two validation tests on 'name':
  1. Make sure the length of 'name' is not zero (i.e. this field is required)
  2. Make sure 'name' contains only letters and spaces (with a regex test)
- If either of these produce an error, an error message is pushed into the errors array.
- Finally, if there are any errors in the errors array, the errors array is returned. Otherwise, `null` is returned.

So, obviously this is a lot of typing. This is why I created a field validation helper called `fieldValidator`. Simpy `import { fieldValidator } from 'react-proforma'`, and use it to produce the same result as above:

```javascript
validationObject: {
  name: (values) => {
    return fieldValidator(values.name)
      .required()
      .regex(/^[a-zA-Z\s]*$/, 'Your name can only contain letters and spaces.')
      .end();
  };
}
```

- Inside the function, pass to `fieldValidator` the value you want to validated (in this case, it's "values\.name"), and then chain on whatever validations you want.
- Here, I've used `.required()` and `.regex()`.
- All validator methods have default error messages, but you can optionally use your own, as I did here with the `regex()` call.
- [See the `fieldValidator` docs](#fieldValidator) for all of the methods available to you.

**NOTE: You must add `.end()` to the end of the `fieldValidator` chain, and return the entire chain from the function! (I.e. `return fieldValidator(values.name) ..... .end()`)**

With this new tool, let's go ahead and add email and password validation in just a few seconds:

```javascript
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
  }
}
```

**NOTE: I pass the entire values object to each validation field so that you can access other values if that's what your validation requires. For more information, [see the `fieldValidator` docs](#fieldValidator).**

Now we can take our form for a spin. Enter valid and invalid values, and see the 'Errors' object update in the `Debug` display.

For example:
![Demo Form 2b](demo/screenshots/demo-form-2-b.png 'Demo Form 2b')

**NOTE: The 'Touched' value for each field name turns `true` when a field recieves and then loses focus. This is useful for displaying errors to the user, which is typically done only if 'touched' is `true` for that field name.**

So this is all working quite nicely. But let's go ahead and try something a little more challenging, and see how React Proforma performs.

### Cross-Field Validation

Let's say at this point we decide to add a second password field. That means we have to add a new field to our form, as well as attempt cross-field validation. Once again, React Proforma makes it all easy.

Let's start by updating our form.

Add the following to your `Form` inside `renderForm`, before the `Submit` button:

```javascript
<div className="field-row">
  <label htmlFor="password2-field">Re-enter Password:</label>
  <Field
    name="password2"
    type="password"
    className="form-field"
    id="password2-field"
  />
</div>
```

**NOTE: The 'name' I used for this new field is 'password2'.**

And update your `initialValues` object:

```javascript
initialValues: {
  name: '',
  email: '',
  password: '',
  password2: ''
}
```

**REMINDER: All form field names must be present in the `initialValues` object, or it won't be included in any of React Proforma's functionality.**

Now we need to add validation to 'password2' to make sure it matches 'password'.

Add the following property to your `validationObject`:

```javascript
password2: (values) => {
  return fieldValidator(values.password2)
    .required()
    .custom(() => {
      if (values.password2 !== values.password) {
        return 'Your passwords must match exactly!';
      }
    })
    .end();
};
```

Here we are making use of the `custom()` method chained to `fieldValidator()`. `custom()` takes a function as it's sole argument, which will be executed by `custom()`. If your function returns a string value, that value will be added to the current error messages for that field.

But we can make things even more concise in this case, by making use of the `.equals()` method:

```javascript
password2: (values) => {
  return fieldValidator(values.password2)
    .required()
    .equals(values.password, 'Your passwords must match exactly!')
    .end();
};
```

[(See the docs for all available chaining methods and their specific signatures.)](#fieldvalidator)

And that's all it takes to perform cross-field validation with React Proforma.

Here's what we've created so far:

![Demo Form 2c](demo/screenshots/demo-form-2-c.png 'Demo Form 2c')

### Displaying Errors

The normal way of displaying errors in React is to write up some conditional checks inside your jsx that looks something like:

```javascript
<div>
  {touched.email && errors.email &&
    errors.email.map((error) => ...) /* return component that displays error */
  }
</div>
```

But that's kind of ridiculous to have to do for every single form field.

**Enter `fieldError()`**

Use it like this:

1. `import { fieldError } from 'react-proforma';`
2. Create a component that will recieve each individual error message as it's **only** prop. For example:

   ```javascript
   function FieldError(props) {
     return <p className="field-error">{props.error}</p>;
   }
   ```

3. Under each field row, add the following:

   ```javascript
   { fieldError('<FIELD NAME>', FieldError) }
   ```

   As in:

   ```jsx
   <div className="field-row">
     <label htmlFor="name-field">Name:</label>
     <Field
       name="name"
       type="text"
       className="form-field"
       id="name-field"
       placeholder="E.g. Billy Bob"
     />
   </div>;
   {fieldError('name', FieldError)} /* <--- */
   ```

**NOTE: You could insert `fieldError()` anywhere of course.**

And just like that we have:

![Demo Form 2d](demo/screenshots/demo-form-2-d.png 'Demo Form 2d')

[**Check out the complete code for this form here.**](/examples/DemoForm2.jsx)

### Wrap-up

There's a **lot** more built into React Proforma, including other pre-wired components ([`Select`](#select), [`Checkbox`](#checkbox), [`Radio`](#radio), [`Textarea`](#textarea)), and [`Reset`](#reset), [using custom components](#using-custom-componentsui-libs) (like from a UI library or created by a css-in-js library) instead of standard React elements, and giving you access to more of your form's functionality through the methods and properties inside the [`ProformaBundle`](#proformabundle).

[Browse the API](#api) to learn about everything that React Proforma offers you, and [check out some examples](/examples).

---

## Typescript

This entire library was written in Typescript, so in addition to being fully typed, I also take full advantage of Typescript's other features wherever possible.

Usage in Typescript is pretty much the same as it is in vanilla JS, with two notable exceptions:

1. The `Proforma` component is a generic class, so you just have to pass in the `type` that represents your form values, and Proforma propogates that around wherever possible:

   ```typescript
   type FormValues = {
     name: string;
     email: string;
     password: string;
     newsletter: boolean;
   };

   /* Skip to component render method */
   render() {
     return (
       <Proforma<FormValues>
         config={{...}}
         handleSubmit={() => {...}}
       >
         {this.renderForm}
       </Proforma>
     );
   }
   ```

   **If you didn't know how to pass in a type variable to a component in JSX before, now you know!**

2. In your `renderForm` method (or whatever function returns your form mark-up), in order to have your `proformaBundle` argument fully typed, you have to import `ProformaBundle`, which is a generic type that expects your `FormValues` again as a type variable. As in:

   ```typescript
   import { ProformaBundle } from 'react-proforma';

   type FormValues = {
     name: string;
     email: string;
     password: string;
     newsletter: boolean;
   };

   /* Skip to renderForm method */
   renderForm(proformaBundle: ProformaBundle<FormValues>) {
     return (
       /* form markup */
     );
   }
   ```

   Or with in-line destructing:

   ```typescript
   renderForm({
     values,
     errors,
     touched,
     handleSubmit,
     handleRest,
     /* whatever else you need from ProformaBundle */
   }: ProformaBundle<FormValues>) {
     return (
       /* form markup */
     );
   }
   ```

---

## Going further

### Using Custom Components/UI LIbs

Very often you will likely want to use custom components or UI library components instead of standard React form elements. React Proforma makes this very easy to use.

Here's an example of how to integrate a css-in-js (e.g. styld-components) component, as well as a Material-UI component, into React Proforma:

   1. Import whatever you need from the respective libraries and React Proforma:

```javascript
import styled from 'styled-components';
import { TextField } from '@material-ui/core';
import { Field } from 'react-proforma';
```

  2. Create your styled-component:

```javascript
const StyledInput = styled.input`
  color: blue;
  font-size: 35px;
  font-weight: 'bold';
  padding: 8px;
  margin-top: 5px;
`;
```

  3. Pass these components into `Field` in the 'component' prop, and add whatever other props you would normally pass to that component:

```javascript
<Field 
  name="email"
  component={TextField}
  type="text"
  required
  label="Email"
  margin="normal"
  style={{ marginTop: '0', width: '100%' }}
/>

<Field
  name="password"
  component={StyledInput}  
  type="text"  
  required
  placeholder="Password field"  
/>
```

[**You can see a complete example here.**](/examples/using-custom-components-ui-lib.jsx)

### Using `Proforma.config.customOnChange`

1. The `customOnChange`, along with you component state, can be used to fulfill special validation requirements.
     - I created [this example](/examples/password-strength-validation-customOnChange.jsx) to show how using the 'customOnChange' object makes password-strength validation easy.
2. You can use `customOnChange` to restrict user input by only allowing a specific kind of input in a field.
      - I created [this example](/examples/restrict-user-input-customOnChange.jsx) to show how React Proforma makes that easy.

TODO

---

## API

### Components

#### Proforma

`Proforma` is the core component of the React Proforma library. It is a React component that you return from your own component's render method (or returned from your functional component). It expects as a single child a function that will return your actual form markup. The child function can be declared in-line as an anonymous function, but I recommend referencing a named function instead, for organization, clarity, and efficiency.

The child function will be executed by `Proforma` with the entire [ProformaBundle](#proformabundle), so you can access it (or any part of it) inside the child function that you pass in.

For example:

**NOTE: The child function does NOT HAVE PARENTHESES next to it. This is a function reference, not a function invocation.**

```javascript
import React from 'react';
import { Proforma } from 'react-proforma';

class MyForm extends React.Component {
  renderForm(proformaBundle) {
    /* extract any piece of the ProformaBundle */
    const {
      values,
      touched,
      errors,
      handleSubmit
    } = proformaBundle;

    return (
      <form onSubmit={handleSubmit}>
        {/* form markup */}
      </form>
    );
  }

  render() {
    return (
      <Proforma
        config={{...}}
        handleSubmit={() => {...}}
      >
        {this.renderForm}
      </Proforma>
    );
  }
}
```

- **Proforma.config**

  - Proforma.config.initialValues: _object_
    - This object defines all of the form field names you wish to include in the Proforma internal functionality (change handling, focus/blur handling, etc.).
    - **If a name key is not on this object, it will not be available in your form!**
    - The 'initialValues' object is also where, as the name implies, you can set the initial value of any form field name. You can either set values to empty strings, a boolean value (for checkboxes), or grab values from your components props. For example:
    ```javascript
    initialvalues: {
      name: this.props.userName || '',
      email: this.props.userEmail || '',
      password: '',
      newsletter: true
    }
    ```
    - If you pass in a value that is neither of type 'boolean' nor of type 'string', the value will default to empty string `''`.
  - Proforma.config.validationObject: _object_

    - This is an optional object that allows you to define the validation you'd like to have performed on any of your form fields.
    - The keys must correspond with whichever form field names you wish to have validated, and the values are functions that accept the current 'values' object of your form as its sole argument. The return value from each function must either be an array of strings (containing the error messages to be placed in the 'errors' object for that field, even if there is only one error message), or null. For example:

      ```javascript
      validationObject: {
        password: (values) => {
          /* 
            Perform check on values.password.
            Return array of error messages , or null.
          */
        };
      }
      ```

    - You can either do this manually, or make use of the [fieldValidator helper function](#fieldvalidator) to streamline this process.
    - NOTE: I make the entire values object available to each `validationObject` property so that you can reference other field name values if you need to.

  - Proforma.config.customOnChangeObject: _object_

    - There might be times when you want to have your own function executed when a form field is changed instead of Proforma's internal change handler method. This need may arise if you want to perform multi-stage validation (.e.g a password strength indicator), or restrict the user's input in a particular form field. [(See some use-cases here.)](#using-customonchange)
    - Each property on the `customOnChange` object should be a name that corresponds with one of your form field names.
    - Each value on the `customOnChange` object should be a function that accepts two arguments:
      1. event: _React.ChangeEvent_ -- the change event emitted by React.
      2. setValues: _function_ -- a function that allows you to set the value of one or more of your form fields. **NOTE**: Since all form fields inside `Proforma` are controlled, **you will have to use `setValues` to update that particular form field yourself**. For example:

    ```javascript
    customOnChangeObject: {
      name: (event, setValues) => {
        const { value } = event.target;

        /*
          Any logic you want to perform on 'value'..
        */
        const upperCaseValue = value.toUpperCase();

        /* IMPORTANT (or UI won't update) */
        setValues({ password: upperCaseValue });
      };
    }
    ```

  - Proforma.config.resetTouchedOnFocus: _boolean_
    - A simple boolean flag that, if true, resets the 'touched' value of each field name back to `false` when that field recieves focus.
    - Defaults to `false`.
  - Proforma.config.validateOnChange: _boolean_
    - A simple boolean flag that, if false, will not run validation as the user types (changes) form values. This means validation will only be run when a field recieves and then loses focus.
    - Defaults to `true`;

- **Proforma.handleSubmit**

  - This function will be executed by React Proforma when your form is submitted.
  - I call `event.preventDefault()` for you, so don't worry about including that in your own `handleSubmit`.
  - I also put the execution of your `handleSubmit` function inside a conditional that prevents a user from submitting the form many times with multiple clicks.
    - NOTE: If your `handleSubmit` function makes use of the 'setSubmitting' function (see below) to set the 'isSubmitting' property to false, and for some reason you've kept the form component on the screen, the user WILL be able to submit the form again unless you make use of the 'submitCount' property (see below) to control a user's ability to re-submit your form.
  - It can be async if you need use of `await` in your function logic.
  - Your `handleSubmit` function will be executed with the following 5 arguments being made available to your function, in this order:
    1. 'values': _object_ -- The 'values' object that represents all the current values of your form at the moment your form is submitted. You can, of course, access into the 'values' object with dot or bracket notation (i.e. values.email, or values['email']).
    2. 'setSubmitting': _function_ -- This is a method that allows you to flip the 'isSubmitting' property inside the [ProformaBundle](#proformabundle). 'isSubmitting' is set to `true` before your `handleSubmit` is executed, but if the submission fails (e.g. your server responded with an error), you can use this method like this: `setSubmitting(false)`. This is useful if you are referencing the `isSubmitting` property inside your form somewhere in a component that displays a different message depending on whether the form is currently submitting or not.
    3. 'setComplete': _function_ -- The same as 'setSubmitting' above, but for is `isComplete` property in the [ProformaBundle](#proformabundle). (NOTE: I do not do anything to `isComplete`, other than set it to an initial value of `false`.) This is useful if you decide you want to keep the form on the screen and just say something like 'Form has been successfully submitted!' rather than redirect the user to some other route. Use it like this: `setComplete(false)`.
    4. 'submitCount': _number_ -- A value representing the number of times your form has been submitted. Starts at zero, and increments by 1 on each call to `ProformaBundle.handleSubmit` from your form.
    5. 'event': _React.FormEvent | React.SyntheticEvent_ -- This is the actual event emitted by React when the form is submitted, should you need it for whatever reason. As mentioned above, I do the `event.preventDefault()` for you, so access the event object for anything other than that.
  - Example handleSubmit function:

  ```javascript
  <Proforma
    config={{...}}
    handleSubmit={async (values, setSubmitting) => {
      /* Post values to server */
      try {
        const response = await axios.post(serverUrl, values);

        if (response.data.message === 'success') {
          /* redirect user somewhere */
        } else {
          console.log('Something went wrong!', response.data.error);
          /* use setSubmitting to flip the 'isSubmitting' property inside ProformaBundle */
          setSubmitting(false);
        }
      } catch (error) {
        console.log('Something went wrong!', error);
        /* use setSubmitting to flip the 'isSubmitting' property inside ProformaBundle */
        setSubmitting(false);
      }
    }}
  >
    {this.renderForm}
  </Proforma>
  ```

#### Form

The Form component comes automatically wired up with Proforma's 'handleSubmit' functinon that you would normally have to wire up yourself by grabbing it from the [PorformaBundle](#proformabundle).

That is, this:

```javascript
class MyForm extends React.Component {
  renderForm(proformaBundle) {
    return (
      <form onSubmit={proformaBundle.handleSubmit}>
        {/* ... */}
      </form>
    );
  }

  render() {
    /* etc. etc. */
  }
}
```

...is equal to this:

```javascript
class MyForm extends React.Component {
  renderForm(proformaBundle) {
    return (
      <Form>
        {/* ... */}
      </Form>
    );
  }

  render() {
    /* etc. etc. */
  }
}
```

Simply import `Form` from React Proforma:

```javascript
import { Form } from 'react-proforma';
```

  - Form.component: _React.ComponentType_ (optional)
    - A custom component you'd like to use instead of having a standard `form` element returned from `Form`. [See here](#using-custom-componentsui-libs) for how to use this. 
  - Form...otherProps
    - Any additional props passed to `Form` will be forwarded onto the resulting React `form` element.

#### Field

This component will be your go-to for all input types that are not checkboxes, radio buttons, selects (dropdowns), or textareas. (I've separated those into their own components.) It comes automatically wired up as a controlled component.

The `Field` component **must** be passed a 'name' prop corresponding with one of the form field names in your 'initialValues' object in your Proforma.config. All other props will be forwarded to the resulting `input` element.

Simply import `Field` from React Proforma:

```javascript
import { Field } from 'react-proforma';
```

Example:

```javascript
<Field
  name="password"
  type="password"
  className="form-field"
  id="password-field"
  style={{ color: 'blue', fontSize: '1.3rem' }}
/>
<Field
  name="amount"
  type="number"
  className="form-field"
  id="amount-field"
  style={{ fontWeight: 'bold' }}
/>
```

- Field\.name: _string_ (required)
  - A string value corresponding with one of the keys on your 'initialValues' object in your Proforma.config.
- Field.type: _string_ (optional -- defaults to "text")
  - The type of input you'd like the resulting `input` element to be.
- Field.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `input` element returned from `Field`. [See here](#using-custom-componentsui-libs) for how to use this.
- Field...otherProps
  - All other props will be forwarded to the resulting `input` or custom component.
- Field.customOnChange: _function_ (CAUTION: RARELY NEDED)
  - This is an escape-hatch prop that allows you to pass in a function that will,when that field is changed, be executed in place of Proforma's internal change handler.
  - I built this in because I came across some libraries that do not conform to React standards, and so require more meticulous change handling. It's here if you need it.
- Field.customValue: _string | boolean_ (CAUTION: RARELY NEEDED)
  - This is another escape-hatch prop that allows you to control the "value" of this input entirely yourself.
  - I built this in because I came across some libraries that do not conform to React standards, and so require more meticulous value management. It's here if you need it.

#### Checkbox

This component is for checkbox inputs. It comes automatically wired up as a controlled component.

The `Checkbox` component **must** be passed a 'name' prop corresponding with one of the form field names in your 'initialValues' object in your Proforma.config. All other props will be forwarded to the resulting `input` element.

**NOTE: The 'initialValue' for a Checkbox input must be a _BOOLEAN_ value, not a string.**

Simply import `Checkbox` from React Proforma:

```javascript
import { Checkbox } from 'react-proforma';
```

Example

```javascript
<Checkbox name="newsletter" id="newsletter-checkbox" />
```

- Checkbox.name: _string_ (required)
  - A string value corresponding with one of the keys on your 'initialValues' object in your Proforma.config.
- Checkbox.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `input` element returned from `Checkbox`. [See here](#using-custom-componentsui-libs) for how to use this.
- Checkbox...otherProps
  - All other props will be forwarded to the resulting `input` or custom component.

#### Radio

This component is for radio button inputs. It comes automatically wired up as a controlled component.

The `Radio` component **must** be passed a 'name' prop corresponding with one of the form field names in your 'initialValues' object in your Proforma.config. All other props will be forwarded to the resulting `input` element.

Simply import `Radio` from React Proforma:

```javascript
import { Radio } from 'react-proforma';
```

Example

```javascript
<label htmlFor="gender-male">Male</label>
<Radio name="gender" value="male" id="gender-male" />

<label htmlFor="gender-female">Female</label>
<Radio name="gender" value="female" id="gender-male" />

<label htmlFor="gender-other">Other</label>
<Radio name="gender" value="other" id="gender-other" />
```

**NOTE: Each radio button above has the same 'name' prop ("gender" in this case). This is required for the radio buttons to be considered part of the same radio grouping.**

**NOTE: Each radio button above has it's own 'value' prop. This make it different from other input types. The 'value' prop should be equal to the value that you'd like your form field name to have when that radio button is checked.**

- Radio.name: _string_ (required)
  - A string value corresponding with one of the keys on your 'initialValues' object in your Proforma.config.
- Radio.value: _string_ (required)
  - A string value representing the 'value' that your form field name will have when that particular radio button is checked.
- Radio.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `input` element returned from `Radio`. [See here](#using-custom-componentsui-libs) for how to use this.
- Radio...otherProps
  - All other props will be forwarded to the resulting `input` or custom component.

#### Select

This component is for select (dropdown) inputs. It comes automatically wired up as a controlled component.

The `Select` component **must** be passed a 'name' prop corresponding with one of the form field names in your 'initialValues' object in your Proforma.config. All other props will be forwarded to the resulting `select` element.

Simply import `Select` from React Proforma:

```javascript
import { Select } from 'react-proforma';
```

Example

```javascript
<Select name="salutation" id="salutation-select" className="form-field">
  <option value="mister">Mr.</option>
  <option value="missus">Mrs.</option>
  <option value="miss">Ms.</option>
</Select>
```

- Select.name: _string_ (required)
  - A string value corresponding with one of the keys on your 'initialValues' object in your Proforma.config.
- Select.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `select` element returned from `Select`. [See here](#using-custom-componentsui-libs) for how to use this.
- Select...otherProps
  - All other props will be forwarded to the resulting `select` or custom component.

#### Textarea

This component is for textarea inputs. It comes automatically wired up as a controlled component.

The `Textarea` component **must** be passed a 'name' prop corresponding with one of the form field names in your 'initialValues' object in your Proforma.config. All other props will be forwarded to the resulting `textarea` element.

Simply import `Textarea` from React Proforma:

```javascript
import { Textarea } from 'react-proforma';
```

Example

```javascript
<Textarea
  name="comment"
  id="comment-input"
  cols="50"
  rows="10"
  maxLength="120"
/>
```

- Textarea.name: _string_ (required)
  - A string value corresponding with one of the keys on your 'initialValues' object in your Proforma.config.
- Textarea.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `textarea` element returned from `Textarea`. [See here](#using-custom-componentsui-libs) for how to use this.
- Textarea...otherProps
  - All other props will be forwarded to the resulting `textarea` or custom component.

#### Submit

This component is meant to be the control for your form submission. It comes automatically wired up to the [ProformaBundle's](#proformabundle)) handleSubmit method and 'isSubmitting' property.

As customization, it accepts 'textNotSubmitting' and 'textSubmitting' as optional props. See props section below for details.

Simply import `Submit` from React Proforma:

```javascript
import { Submit } from 'react-proforma';
```

Example

```javascript
<Submit textSubmitting="Processing form inputs..." />
```

- Submit.textNotSubmitting: _string_ (optional)
  - This is the text that will be displayed when the form is not currently being submitted.
  - Defaults to 'Submit'.
- Submit.textSubmitting
  - This is the text that will be displayed when the form _is_ currently being submitted.
  - Defaults to 'Submitting...'.
- Submit.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `button` element returned from `Submit`. [See here](#using-custom-componentsui-libs) for how to use this.
- Submit...otherProps
  - All other props will be forwarded to the resulting `button` or custom component.

#### Reset

This component is meant to be the control for your form's reset functionality. It comes automatically wired up to the [ProformaBundle's](#proformabundle)) handleReset method.

As customization, it accepts 'text' as an optional prop. See props section below for details.

Simply import `Reset` from React Proforma:

```javascript
import { Reset } from 'react-proforma';
```

Example

```javascript
<Reset text="Click To Reset" />
```

- Reset.text: _string_ (optional)
  - This is the text that will be displayed to the user.
  - Defaults to 'Reset'.
- Reset.component: _React.ComponentType_ (optional)
  - A custom component you'd like to use instead of having a standard `button` element returned from `Reset`. [See here](#using-custom-componentsui-libs) for how to use this.
- Reset...otherProps
  - All other props will be forwarded to the resulting `button` or custom component.

#### Debug

This component is designed for development purposes for you to display and track the current 'values', 'errors', and 'touched' objects for your form.

See what it looks like [inside the 'Normal Usage' guide](#normal-usage).

Import it,

```javascript
import { Debug } from 'react-proforma';
```

and insert it anywhere within your markup:

```javascript
<Debug />
```

### ProformaBundle

- **ProformaBundle.values**: _object_
  - An object whose keys are the form field names you passed in to Proforma in your 'initialValues' object, and whose values are the current field values for each field name.

- **ProformaBundle.touched**: _object_
  - An object whose keys are the form field names you passed in to Proforma in your 'initialValues' object, and whose values are the current 'touched' state, represented by a boolean value, for each field name.

- **ProformaBundle.errors**: _object_
  - An object whose keys are the form field names you passed in to Proforma in your 'initialValues' object, and whose values are the current errors for that field, based on the current value in that field and the 'validationObject' you passed into Proforma.
  - If there are errors, they will be present as an array of string.
  - If there are no errors, the value of that field name's errors will be `null`.

- **ProformaBundle.isSubmitting**: _boolean_  
  - A boolean flag representing whether or not the form is currently submitting.
  - Useful for tailoring your UI text in order to inform that user of the form's current submission status.
  - Controlled by `ProformaBundle.setSubmitting`.

- **ProformaBundle.isComplete**: _boolean_  
  - A boolean flag representing whether or not the form processing is complete.
  - Starts off as `false`, and is only turned `true` by you with a call to `ProformaBundle.setComplete(true)`.
  - There aren't too many cases where you will need this. The only thing I can think of is if you want to keep your form on the screen for some reason after the form has been processed, and you want to tell the user that the form has been successfully processed.

- **ProformaBundle.submitCount**: _number_
  - A value representing the number of times your form has been submitted. Starts at zero, and increments by 1 on each call to `ProformaBundle.handleSubmit` from your form.

- **ProformaBundle.handleChange**: _function_
  - This is Proforma's form input change handler.
  - Use it to manually hook up a form field to the rest of Proforma's functionality.
  - **NOTE**: The input you're attaching 'ProformaBundle.handleChange' to MUST have a 'name' prop passed to it that corresponds with one of your form field names.
  - Only needed if you are not using any of Proforma's own custom components, or if you are facing some very special edge-case.

- **ProformaBundle.handleFocus**: _function_
  - This is Proforma's form input focus handler.
  - Use it to manually hook up a form field to the rest of Proforma's functionality.
  - **NOTE**: The input you're attaching 'ProformaBundle.handleFocus' to MUST have a 'name' prop passed to it that corresponds with one of your form field names.
  - Only needed if you are not using any of Proforma's own custom components, or if you are facing some very special edge-case.

- **ProformaBundle.handleBlur**: _function_
  - This is Proforma's form input focus handler.
  - Use it to manually hook up a form field to the rest of Proforma's functionality.
  - **NOTE**: The input you're attaching 'ProformaBundle.handleBlur' to MUST have a 'name' prop passed to it that corresponds with one of your form field names.
  - Only needed if you are not using any of Proforma's own custom components, or if you are facing some very special edge-case.

- **ProformaBundle.handleSubmit**: _function_
  - This is Proforma's form submission handler.
  - Among other things, this is where Proforma executes _your_ 'handleSubmit' function that you passed to Proforma. 
  - [See Proforma](#proforma) for more information about the 'handleSubmit' function that you pass to Proforma.

- **ProformaBundle.handleReset**: _function_
  - This is Proforma's form reset method.
  - Invoking this method will reset all of your fields back to the initial values defined by your 'initialValues' object passed to the `Proforma` component, as well as resetting the properties on the 'errors' and 'touched' objects back to `null` and `false` respectively.
  - Attach it to an element's `onClick` property, or [import the `Reset` component](#reset), which comes pre-wired up 'ProformaBundle.handleRest'.

- **ProformaBundle.setSubmitting**: _function_
  - Use this function to control the value of 'ProformaBundle.isSubmitting'. (See above).

- **ProformaBundle.setComplete**: _function_
  - Use this function to control the value of 'ProformaBundle.isComplete'. (See above).

### Helper functions

#### fieldValidator

  - A function that exposes an internal class that allows you to easily construct your collection of error messages for a given form field.
  - Accepts a single argument: the value you wish to validate.
    - I.e. values\.name, values.password, values.email, etc.
  - Used inside your 'Proforma.config.validationObject'.
  - **NOTE**: Remember to _return_ the `fieldValidator` chain from the validation function.
  - **NOTE**: Remember to add `.end()` to the end of your chain!
  - Each chained method accepts an **optional argument** where you can customize the error message for that part of the validation. See the list of available methods below for their exact function signatures.
  - Imported from React Proforma:

```javascript
import { fieldValidator } from 'react-proforma';
```
  - Example usage:

```javascript
validationObject: {
  userName: (values) => {
    return fieldValidator(values.userName)
      .required()
      .min(6)
      .max(20)
      .end();
  },
  email: (values) => {
    return fieldValidator(values.email)
      .required()
      .email()
      .end();
  }
}
```

  - List of methods available for chaining to `fieldValidator(value)`:
    - `required(msg?: string)`
      - Requires that this field must be be filled in.
      - Default message: 'This field is required.'
    - `min(length: number, msg?: string)`
      - Sets a minimum number of characters for that field.
      - Default message: 'This field must be at least [length] character(s) long.'
    - `max(length: number, msg?: string)`
      - Sets a maximum number of characters for that field.
      - Default message: 'This field must not be more than [length] character(s) long.'
    - `integer(msg?: string)`
      - Requires that this field's value must be an integer.
      - Default message: 'The value entered must be an integer.'
    - `float(msg?: string)`
      - Requires that this field's value must be a floating point value.
      - Default message: 'The value entered must be a floating point number.'
    - `email(msg?: string, rgx?: RegExp)`
      - Requires that this field must be a valid email address.
      - Default message: 'Please enter a valid email address.'
      - Default regex: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    - `regex(rgx: RegExp, msg? string)`
      - Accepts a regular expression against which to test the value.
      - Default message: 'The value entered does not match the required regular expression pattern.'
    - `equals(comparedString: string, msg?: string)`
      - Accepts a string value against which the field value is to be compared.
      - Default message: 'The value in this field does not equal "[comparedString]".'
    - `custom(fn: () => string | undefined)`
      - Accepts a single function that should return a string value or undefined. If a string value is returned, it will be added to the current collection of error messages.
      - There is no default message, as your desired error message is to be returned from your passed-in function.
    - `end()`
      - **YOU MUST ADD `.end()` TO THE END OF ANY CHAIN** of methods attached to `fieldValidator` in order for the chain to return the collection of error messages.
      - This will always be the last method in your method chain.

#### fieldError

  - This is a function that you can insert anywhere into your form mark-up (under each form field for example) that will help you display the error messages for a specific field.
  - Expects two arguments:
    1. name: _string_ (required) -- the 'name' of the form field whose errors you wish to display (i.e. a name corresponding with one of the properties on your 'initialValues' object).
    2. component: _React.ComponentType_ (required) -- the component of your own design that will be passed each individual error message as its only prop called "error".
  - Import it from React Proforma:

```javascript
import { fieldError } from 'react-proforma';
```

  - Example usage:

```javascript
/* example error display component */
function FieldError(props) {
  return <p style={{ color: 'red' }}>{props.error}</p>;
}

/* then insert the fieldError call somewhere in your mark-up */
<div className="field-row">
  <label htmlFor="password-field">Enter password:</label>
  <Field name="password" type="password" id="password-field"/>
</div>
{fieldError('password', FieldError)}
```

#### fieldValid

  - This is a function similar to 'fieldError', except that it is meant to display a message to the user if a field's value is valid.
  - Expects three arguments:
    1. name: _string_ (required) -- the 'name' of the form field whose errors you wish to display (i.e. a name corresponding with one of the properties on your 'initialValues' object).
    2. component: _React.ComponentType_ (required) -- the component of your own design that will be passed each individual error message as its only prop called "message".
    3. message: _string_ (required) -- the message you wish to display (e.g. 'Good!').
  - Import it from React Proforma:

```javascript
import { fieldValid } from 'react-proforma';
```
  
  - Example usage:

```javascript
/* example valid-input display component */
function FieldValid(props) {
  return <p style={{ color: 'green' }}>{props.error}</p>;
}

/* then insert the fieldValid call somewhere in your mark-up */
<div className="field-row">
  <label htmlFor="password-field">Enter password:</label>
  <Field name="password" type="password" id="password-field"/>
</div>
{fieldValid('password', FieldValid, 'Good stuff!')}
```

**NOTE: 'fieldError' and 'fieldValid' can be used in conjunction with each other. Just place them one above the other, and either error messages or the valid input message will be displayed, depending on the current input in that field:**

```javascript
{fieldError('password', FieldError)}
{fieldValid('password', FieldValid, 'Good stuff!')}
```

---

## Running tests

  1. Clone the Github repo:
  
      `git clone https://github.com/varunj166/react-proforma.git`
  
  2. Install dependencies

      `npm install`
  
  3. Run test suites

      `npm test`

---

## What about React Native?

I've only looked at React Native in passing because web applications are my main focus (and are, in my opinion, the future, especially with the possibilities that PWA's make available to us), but if there is sufficient interest in this library, I could see about enlisting some help to make React Proforma compatible with React Native.

As I understand it, it shouldn't be that difficult, but I wouldn't want to introduce new functionality like that myself without the help of people with much stronger knowledge of React Native.

For now, React Proforma is strictly for React web forms.

---

## What About Formik?

I am of course aware of Formik, seeing as it's the most popular React form helper library out there. And I did work with Formik a bit, but there were design choices that annoyed me, and for something as frequently needed as a form helper library, I didn't want to have to conform to someone else's designs.

That's what inspired me to build React Proforma. Everything about it is exactly how I would have wanted someone else's form helper library to be. And since that wasn't out there, I made it myself.

It works _really_ well for me, and I hope it works well for you, too!

-vJ
