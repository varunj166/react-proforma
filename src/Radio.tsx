import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

type RadioElementType = React.InputHTMLAttributes<HTMLInputElement>;

interface IRadioProps {
  name: string;
  value: string;
  component?: React.ComponentType<any>;
  style?: {
    [key: string]: string;
  };
}

function memoCompare<T = any>(
  prevProps: MemoComparePropsType<T>,
  nextProps: MemoComparePropsType<T>
): boolean {
  return prevProps.values[prevProps.name] === nextProps.values[prevProps.name];
}

// ==== STANDARD CHECKBOX ====
const _Radio: React.FunctionComponent<IRadioProps & IndexableObjectType> = (
  props
) => {
  const {
    name,
    value,
    values,
    handleChange,
    handleFocus,
    handleBlur,
    ...otherProps
  } = props;

  return (
    <input
      type="radio"
      name={name}
      value={value}
      checked={values[name] === value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...otherProps}
    />
  );
};

const MemoRadio = React.memo<IRadioProps & IndexableObjectType>(
  _Radio,
  memoCompare
);

// ==== COMPONENT CHECKBOX ====
const _ComponentRadio: React.FunctionComponent<IRadioProps &
  IndexableObjectType> = (props) => {
  const {
    name,
    value,
    values,
    component: Component,
    handleFocus,
    handleBlur,
    handleChange,
    children,
    ...otherProps
  } = props;

  if (Component) {
    if (!children) {
      return (
        <Component
          type="radio"
          name={name}
          value={value}
          checked={values[name] === value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          {...otherProps}
        />
      );
    } else {
      return (
        <Component
          type="radio"
          name={name}
          value={value}
          checked={values[name] === value}
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

const MemoComponentRadio = React.memo<IRadioProps & IndexableObjectType>(
  _ComponentRadio,
  memoCompare
);

/**
 * Component to produce a radio button form element, either with
 * a standard input tag, or with your own custom component.
 *
 * @param {string} name - name of the form element, which MUST be the same string value as the corresponding value in your "initialValues" object.
 * @param {string} value - the value to be assigned to this radio button. Note that radio buttons belonging to the same grouping should have the same "name" attribute, and then different "value" attributes for each.
 * @param {React.ComponentType=} [component] - Optional custom component to be used instead of a standard input tag.
 * @returns {JSX.Element} JSX.Element
 */
export const Radio: React.FunctionComponent<IRadioProps &
  IndexableObjectType> = (props) => {
  const {
    values: _rPValues,
    handleChange: _rPHandleChange,
    handleFocus: _rPHandleFocus,
    handleBlur: _rPHandleBlur
  } = React.useContext<ProformaBundle<any>>(ProformaContext);

  const {
    name,
    value,
    component: Component,
    children,
    // strip away and discard the following props if present
    onChange,
    onFocus,
    onBlur,
    handleChange,
    handleFocus,
    handleBlur,
    checked,
    type,
    values,
    // ****************************************************
    ...otherProps
  } = props;

  if (_rPValues[name] === undefined || _rPValues[name] === null)
    throw new Error(
      'The "name" prop you passed in does not exist on the values object initialized by the "initialState" prop on the config object passed to the Proforma component.'
    );

  if (!name)
    throw new Error(
      'This component will not function without a "name" prop passed to it. Please provide a "name" prop that corresponds with one of the properties on your "initialValues" object.'
    );

  if (!Component) {
    return (
      <MemoRadio
        name={name}
        value={value}
        values={_rPValues}
        handleChange={_rPHandleChange}
        handleFocus={_rPHandleFocus}
        handleBlur={_rPHandleBlur}
        {...otherProps}
      />
    );
  } else {
    if (!children) {
      return (
        <MemoComponentRadio
          component={Component}
          name={name}
          value={value}
          values={_rPValues}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        />
      );
    } else {
      return (
        <MemoComponentRadio
          component={Component}
          name={name}
          value={value}
          values={_rPValues}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        >
          {children}
        </MemoComponentRadio>
      );
    }
  }
};
