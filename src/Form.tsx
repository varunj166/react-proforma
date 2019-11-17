import React from 'react';
import { IndexableObjectType, ProformaBundle } from './types';
import { ProformaContext } from './ProformaContext';

interface IFormProps {
  component?: React.ComponentType<any>;
  style?: {
    [key: string]: string;
  };
}

/**
 * Attaches the internal "handleSubmit" method from the Proforma component and adds it to a
 * form element's (default or your own custom form's) onSubmit prop, returning
 * the form. Place all form elements inside the Form component as children.
 *
 * @param {React.ComponentType=} [component] - Custom component (Note: must still be a form element)
 * @param {string=} [action] - Action to be passed to form element.
 * @param {string=} [method] - Method to be passed to form element
 * @returns {JSX.Element | null} - JSX.Element or null (null if no children are provided)
 */
export const Form: React.FunctionComponent<IFormProps & IndexableObjectType> = (
  props
) => {
  const { handleSubmit } = React.useContext<ProformaBundle<any>>(
    ProformaContext
  );

  const {
    children,
    component: Component,
    // strip away and discard the following props if present
    onSubmit,
    onChange,
    onInput,
    onReset,
    // ****************************************************
    ...otherProps
  } = props;

  if (!children)
    throw new Error(
      'The Form component must contain child form elements to be of any use. Please add form elements to your form.'
    );

  if (!Component) {
    return (
      <form onSubmit={handleSubmit} {...otherProps}>
        {children}
      </form>
    );
  }

  return (
    <Component onSubmit={handleSubmit} {...otherProps}>
      {children}
    </Component>
  );
};
