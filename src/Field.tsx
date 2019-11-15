import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

type FieldElementType = React.InputHTMLAttributes<HTMLInputElement>;

interface IFieldProps {
  name: string;
  type?: string;
  component?: React.ComponentType<any>;
  customOnChange?: (args?: any) => any;
  customValue?: any;
  style?: {
    [key: string]: string;
  };
}

function memoCompare<T = any>(
  prevProps: MemoComparePropsType<T>,
  nextProps: MemoComparePropsType<T>
): boolean {
  return prevProps.value === nextProps.value;
}

// ==== STANDARD INPUT ====
const _Field: React.FunctionComponent<IFieldProps & IndexableObjectType> = (
  props
) => {
  const {
    name,
    type,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    ...otherProps
  } = props;

  return (
    <input
      name={name}
      value={value}
      type={type}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...otherProps}
    />
  );
};

const MemoField = React.memo<IFieldProps & IndexableObjectType>(
  _Field,
  memoCompare
);

// ==== COMPONENT INPUT ====
const _ComponentField: React.FunctionComponent<IFieldProps &
  IndexableObjectType> = (props) => {
  const {
    name,
    value,
    type,
    component: Component,
    handleChange,
    handleFocus,
    handleBlur,
    children,
    ...otherProps
  } = props;

  if (Component) {
    if (!children) {
      return (
        <Component
          name={name}
          value={value}
          type={type}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...otherProps}
        />
      );
    } else {
      return (
        <Component
          name={name}
          value={value}
          type={type}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...otherProps}
        >
          {children}
        </Component>
      );
    }
  } else {
    return null;
  }
};

const MemoComponentField = React.memo<IFieldProps & IndexableObjectType>(
  _ComponentField,
  memoCompare
);

/**
 * Component to produce an input form element, either with
 * a standard input tag, or with your own custom component.
 *
 * @param {string} name - name of the form element, which MUST be the same string value as the corresponding value in your "initialValues" object.
 * @param {string=} [type] - input type of the form element (i.e. "text", "password", "email", "date", etc.). Defaults to 'text'. NOTES: 1) For checkboxes and radio button inputs, use the Checkbox and Radio components. 2) input type="file" is read-only, so cannot be a controlled component.
 * @param {React.ComponentType=} [component] - Optional custom component to be used instead of a standard textarea tag.
 * @returns {JSX.Element} JSX.Element
 */
export const Field: React.FunctionComponent<IFieldProps &
  IndexableObjectType> = (props) => {
  const {
    values,
    handleChange: _rPHandleChange,
    handleFocus: _rPHandleFocus,
    handleBlur: _rPHandleBlur
  } = React.useContext<ProformaBundle<any>>(ProformaContext);

  const {
    name,
    type,
    component: Component,
    children,
    customOnChange,
    customValue,
    // strip away and discard the following props if present
    onChange,
    onFocus,
    onBlur,
    handleChange,
    handleFocus,
    handleBlur,
    value,
    // ****************************************************
    ...otherProps
  } = props;

  if (values[name] === undefined || values[name] === null)
    throw new Error(
      'The "name" prop you passed in does not exist on the values object initialized by the "initialState" prop on the config object passed to the Proforma component.'
    );

  if (!name)
    throw new Error(
      'This component will not function without a "name" prop passed to it. Please provide a "name" prop that corresponds with one of the properties on your "initialValues" object.'
    );

  if (type && type === 'file')
    throw new Error(
      'Input type="file" is read-only, and so cannot be a controlled component.'
    );

  if (!Component) {
    return (
      <MemoField
        name={name}
        type={type || 'text'}
        value={values[name]}
        handleChange={_rPHandleChange}
        handleFocus={_rPHandleFocus}
        handleBlur={_rPHandleBlur}
        {...otherProps}
      />
    );
  } else {
    if (!children) {
      return (
        <MemoComponentField
          component={Component}
          name={name}
          type={type || 'text'}
          value={customValue || values[name]}
          handleChange={customOnChange || _rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        />
      );
    } else {
      return (
        <MemoComponentField
          component={Component}
          name={name}
          type={type || 'text'}
          value={customValue || values[name]}
          handleChange={customOnChange || _rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        >
          {children}
        </MemoComponentField>
      );
    }
  }
};
