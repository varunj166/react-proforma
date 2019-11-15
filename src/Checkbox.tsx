import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

type CheckboxElementType = React.InputHTMLAttributes<HTMLInputElement>;

interface ICheckboxProps {
  name: string;
  component?: React.ComponentType<any>;
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

// ==== STANDARD CHECKBOX ====
const _Checkbox: React.FunctionComponent<ICheckboxProps &
  IndexableObjectType> = (props) => {
  const {
    name,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    ...otherProps
  } = props;

  return (
    <input
      type="checkbox"
      name={name}
      checked={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...otherProps}
    />
  );
};

const MemoCheckbox = React.memo<ICheckboxProps & IndexableObjectType>(
  _Checkbox,
  memoCompare
);

// ==== COMPONENT CHECKBOX ====
const _ComponentCheckbox: React.FunctionComponent<ICheckboxProps &
  IndexableObjectType> = (props) => {
  const {
    name,
    value,
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
          type="checkbox"
          checked={value}
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
          type="checkbox"
          checked={value}
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

const MemoComponentCheckbox = React.memo<ICheckboxProps & IndexableObjectType>(
  _ComponentCheckbox,
  memoCompare
);

/**
 * Component to produce a checkbox form element, either with
 * a standard input tag, or with your own custom component.
 *
 * @param {string} name - name of the form element, which MUST be the same string value as the corresponding value in your "initialValues" object.
 * @param {React.ComponentType=} [component] - Optional custom component to be used instead of a standard input tag.
 * @returns {JSX.Element} JSX.Element
 */
export const Checkbox: React.FunctionComponent<ICheckboxProps &
  IndexableObjectType> = (props) => {
  const {
    values,
    handleChange: _rPHandleChange,
    handleFocus: _rPHandleFocus,
    handleBlur: _rPHandleBlur
  } = React.useContext<ProformaBundle<any>>(ProformaContext);

  const {
    name,
    component: Component,
    children,
    // strip away and discard the following props if present
    onChange,
    onFocus,
    onBlur,
    handleChange,
    handleFocus,
    handleBlur,
    value,
    checked,
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

  if (!Component) {
    return (
      <MemoCheckbox
        name={name}
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
        <MemoComponentCheckbox
          component={Component}
          name={name}
          value={values[name]}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        />
      );
    } else {
      return (
        <MemoComponentCheckbox
          component={Component}
          name={name}
          value={values[name]}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        >
          {children}
        </MemoComponentCheckbox>
      );
    }
  }
};
