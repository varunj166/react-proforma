import React from 'react';
import { IndexableObjectType, IConfigObject, ProformaBundle } from './types';
import { generateStateObject, validator } from './helpers';
import { ProformaContextProvider } from './ProformaContext';

interface IProps<V> {
  config: IConfigObject<V>;
  handleSubmit: (
    values: V,
    setSubmitting: (setTo: boolean) => any,
    setComplete: (setTo: boolean) => any,
    event: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>
  ) => any;
}

export type ProformaStateType<V> = Pick<
  ProformaBundle<V>,
  | 'values'
  | 'touched'
  | 'errors'
  | 'isSubmitting'
  | 'isComplete'
  | 'submitCount'
>;

/**
 * The core component of the React Proforma library. It takes in a config object and a handleSubmit
 * function as props, expects a function (that renders your form) as a child, and then executes that
 * function while providing it all of the methods and properties that make up the
 * ProformaBundle (see docs for complete contents of the bundle). You can either hook up
 * your form elements yourself using the appropriate pieces of the ProformaBundle, or you can rely
 * on the custom form elements offered by the React Proforma library that come pre-hooked-up to the
 * Proforma internal functionality (see docs for complete list of custom form elements).
 *
 * @param {Object} config - Core configuration object for React Proforma. See docs for complete config options.
 * @param {Object} config.initialValues - an object containing the initial values for your form data. The name for each piece of form data MUST exist on this object, or it will not be included in any of the internal processing.
 * @param {Object=} [config.validationObject] - an object containing any validation you wish to have performed on any (or all) form data. See docs for more information.
 * @param {Object=} [config.customOnChangeObject] - an object containing the names of any field that you wish to have a custom onChange operation performed. If present for a given name, the provided onChange function will be executed instead of the internal React Proforma change handler. See docs for more information.
 * @param {boolean=} [config.resetTouchedOnFocus=false] - boolean flag that, if set to true, causes the "touched" status for fields to reset whenever the field has focus. Defaults to false.
 * @param {boolean=} [config.validateOnChange=true] - boolean flat that, if set to false, will not run validation for fields on change. Defaults to true.
 * @param {Function} handleSubmit - The function to be executed when your form is submitted. The function will be executed with the following arguments:
 * <br/>(1) values - an object containing the current form values.
 * <br/>(2) setSubmitting - a function that enables you to change the submission status of your form, with signature: (setTo: boolean) => void
 * <br/>(3) setComplete - a function that enables you to change the completion status of your form, with signature: (setTo: boolean) => void
 * <br/>(4) event - the original form submission React event.
 * @returns {JSX.Element | null} - JSX.Element or null (null if no children are provided)
 */
export class Proforma<V> extends React.PureComponent<
  IProps<V>,
  ProformaStateType<V>
> {
  proformaBundle: ProformaBundle<V>;

  constructor(props: IProps<V>) {
    super(props);
    if (!this.props.config)
      throw new Error(
        'You must provide a "config" prop to the Proforma component.'
      );
    if (!this.props.config.initialValues)
      throw new Error(
        'You must provide an initialValues object to the config prop.'
      );
    if (!this.props.handleSubmit)
      console.warn(
        'You have not provided a handleSubmit function prop to the Proforma component. React Proforma will still work. However, when your form is submitted, nothing will happen.'
      );
    this.state = generateStateObject<V>(this.props.config.initialValues);

    // Forced to use bind approach because class property syntax brings
    // class property methods to top of constructor before prop error checking
    // can be run.
    this.validateField = this.validateField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.setValues = this.setValues.bind(this);
    this.setSubmitting = this.setSubmitting.bind(this);
    this.setComplete = this.setComplete.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.computeProformaBundle = this.computeProformaBundle.bind(this);

    this.proformaBundle = {
      values: { ...this.state.values },
      touched: { ...this.state.touched },
      errors: { ...this.state.errors },
      isSubmitting: this.state.isSubmitting,
      isComplete: this.state.isComplete,
      handleChange: this.handleChange,
      handleFocus: this.handleFocus,
      handleBlur: this.handleBlur,
      handleSubmit: this.handleSubmit,
      handleReset: this.handleReset,
      setSubmitting: this.setSubmitting,
      setValues: this.setValues,
      setComplete: this.setComplete,
      submitCount: this.state.submitCount
    };
  }
  // state: ProformaStateType<V> = generateStateObject<V>(
  //   this.props.config.initialValues
  // );

  validateField(name: string) {
    const { validationObject } = this.props.config;
    if (validationObject && validationObject[name]) {
      this.setState((prevState) => ({
        errors: {
          ...prevState.errors,
          [name]: validator<V>(name, prevState.values, validationObject)
        }
      }));
    }
  }

  handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // Check for customOnChangeObject from user
    const { customOnChangeObject } = this.props.config;
    if (customOnChangeObject && customOnChangeObject[name]) {
      // execute user's onChange function
      customOnChangeObject[name](event, this.setValues);
      return;
    }

    this.setState(
      (prevState) => ({
        values: {
          ...prevState.values,
          [name]: value
        }
      }),
      () => {
        if (
          this.props.config.validateOnChange === undefined ||
          this.props.config.validateOnChange === true
        ) {
          this.validateField(name);
        }
      }
    );
  }

  handleFocus(event: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) {
    if (this.props.config.resetTouchedOnFocus) {
      const target = event.target;
      const name = target.name;

      if (name) {
        this.setState((prevState) => ({
          touched: {
            ...prevState.touched,
            [name]: false
          }
        }));
      }
    }
  }

  handleBlur(event: React.FocusEvent<HTMLInputElement | HTMLButtonElement>) {
    const target = event.target;
    const name = target.name;

    if (name) {
      this.setState(
        (prevState) => ({
          touched: {
            ...prevState.touched,
            [name]: true
          }
        }),
        () => {
          this.validateField(name);
        }
      );
    }
  }

  setValues(setToObj: IndexableObjectType) {
    if (typeof setToObj !== 'object') return;
    const keys = Object.keys(setToObj);
    const tmpObj: IndexableObjectType = {};
    for (let key of keys) {
      if (key in this.state.values) {
        tmpObj[key] = setToObj[key];
      }
    }
    if (Object.keys(tmpObj).length > 0) {
      this.setState(
        (prevState) => ({
          values: {
            ...prevState.values,
            ...tmpObj
          }
        }),
        () => {
          if (
            this.props.config.validateOnChange === undefined ||
            this.props.config.validateOnChange === true
          ) {
            if (this.props.config.validationObject) {
              const { validationObject } = this.props.config;

              // Create errors object to insert into state.errors
              const errorsToInsert: IndexableObjectType = {};
              let errors: string[] | null | undefined;
              for (let key of keys) {
                if (validationObject[key]) {
                  errors = validator<V>(
                    key,
                    this.state.values,
                    validationObject
                  );
                  if (errors !== undefined) {
                    errorsToInsert[key] = errors;
                  }
                }
              }

              // If errorsToInsert is not empty, update state.errors
              if (Object.keys(errorsToInsert).length > 0) {
                this.setState((prevState) => ({
                  errors: {
                    ...prevState.errors,
                    ...errorsToInsert
                  }
                }));
              }
            }
          }
        }
      );
    }
  }

  setSubmitting(setTo: boolean) {
    this.setState({ isSubmitting: setTo });
  }

  setComplete(setTo: boolean) {
    this.setState({ isComplete: setTo });
  }

  handleSubmit(
    event: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>
  ) {
    event.preventDefault();
    if (this.state.isSubmitting === false) {
      this.setState(
        (prevState) => ({
          isSubmitting: true,
          submitCount: prevState.submitCount + 1
        }),
        () => {
          if (this.props.handleSubmit) {
            this.props.handleSubmit(
              this.state.values,
              this.setSubmitting,
              this.setComplete,
              event
            );
          }
        }
      );
    }
  }

  handleReset(event: React.SyntheticEvent<HTMLElement>) {
    // if (event.target === event.currentTarget) {
    event.preventDefault();
    event.stopPropagation();
    this.setState({
      ...generateStateObject<V>(this.props.config.initialValues)
    });
    // }
  }

  computeProformaBundle() {
    const {
      values,
      touched,
      errors,
      isSubmitting,
      isComplete,
      submitCount
    } = this.state;
    this.proformaBundle.values = { ...values };
    this.proformaBundle.touched = { ...touched };
    this.proformaBundle.errors = { ...errors };
    this.proformaBundle.isSubmitting = isSubmitting;
    this.proformaBundle.isComplete = isComplete;
    this.proformaBundle.submitCount = submitCount;
  }

  render() {
    this.computeProformaBundle();
    const { children } = this.props;

    if (!children) return null;

    if (typeof children === 'function') {
      // children exists and is a function. Execute it, passing in the ProformaBundle.
      return (
        <ProformaContextProvider value={this.proformaBundle}>
          {children(this.proformaBundle)}
        </ProformaContextProvider>
      );
    } else {
      // Same, but children is not a function (will still work if user uses React Proforma custom form elements
      return (
        <ProformaContextProvider value={this.proformaBundle}>
          {children}
        </ProformaContextProvider>
      );
    }
  }
}
