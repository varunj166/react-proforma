import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

type SelectElementType = React.SelectHTMLAttributes<HTMLSelectElement>;

interface ISelectProps {
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

// ==== STANDARD SELECT ====
const _Select: React.FunctionComponent<ISelectProps & IndexableObjectType> = (
  props
) => {
  const {
    name,
    value,
    handleChange,
    handleFocus,
    handleBlur,
    children,
    ...otherProps
  } = props;

  return (
    <select
      name={name}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...otherProps}
    >
      {children}
    </select>
  );
};

const MemoSelect = React.memo<ISelectProps & IndexableObjectType>(
  _Select,
  memoCompare
);

// ==== COMPONENT SELECT ====
const _ComponentSelect: React.FunctionComponent<ISelectProps &
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
          value={value}
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

const MemoComponentSelect = React.memo<ISelectProps & IndexableObjectType>(
  _ComponentSelect,
  memoCompare
);

/**
 * Component to produce a select (drop down) form element, either with
 * a standard select tag, or with your own custom component.
 *
 * @param {string} name - name of the form element, which MUST be the same string value as the corresponding value in your "initialValues" object.
 * @param {React.ComponentType=} [component] - Optional custom component to be used instead of a standard select tag.
 * @returns {JSX.Element} JSX.Element
 */
export const Select: React.FunctionComponent<ISelectProps &
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
    // ****************************************************
    ...otherProps
  } = props;

  if (!values[name] && values[name] !== false)
    throw new Error(
      'The "name" prop you passed in does not exist on the values object initialized by the "initialState" prop on the config object passed to the Proforma component.'
    );

  if (!name)
    throw new Error(
      'This component will not function without a "name" prop passed to it. Please provide a "name" prop that corresponds with one of the properties on your "initialValues" object.'
    );

  if (!Component) {
    if (!children) {
      throw new Error(
        'You must pass in child elements (menu options) to use the Select component.'
      );
    }

    return (
      <MemoSelect
        name={name}
        value={values[name]}
        handleChange={_rPHandleChange}
        handleFocus={_rPHandleFocus}
        handleBlur={_rPHandleBlur}
        {...otherProps}
      >
        {children}
      </MemoSelect>
    );
  } else {
    if (!children) {
      return (
        <MemoComponentSelect
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
        <MemoComponentSelect
          component={Component}
          name={name}
          value={values[name]}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        >
          {children}
        </MemoComponentSelect>
      );
    }
  }
};
