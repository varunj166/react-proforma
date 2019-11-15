import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

type TextareaElementType = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

interface ITextareaProps {
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

// ==== STANDARD TEXTAREA ====
const _Textarea: React.FunctionComponent<ITextareaProps &
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
    <textarea
      name={name}
      value={value}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...otherProps}
    />
  );
};

const MemoTextarea = React.memo<ITextareaProps & IndexableObjectType>(
  _Textarea,
  memoCompare
);

// ==== COMPONENT TEXTAREA ====
const _ComponentTextarea: React.FunctionComponent<ITextareaProps &
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

const MemoComponentTextarea = React.memo<ITextareaProps & IndexableObjectType>(
  _ComponentTextarea,
  memoCompare
);

/**
 * Component to produce a textarea form element, either with
 * a standard textarea tag, or with your own custom component.
 *
 * @param {string} name - name of the form element, which MUST be the same string value as the corresponding value in your "initialValues" object.
 * @param {React.ComponentType=} [component] - Optional custom component to be used instead of a standard textarea tag.
 * @returns {JSX.Element} JSX.Element
 */
export const Textarea: React.FunctionComponent<ITextareaProps &
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
      <MemoTextarea
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
        <MemoComponentTextarea
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
        <MemoComponentTextarea
          component={Component}
          name={name}
          value={values[name]}
          handleChange={_rPHandleChange}
          handleFocus={_rPHandleFocus}
          handleBlur={_rPHandleBlur}
          {...otherProps}
        >
          {children}
        </MemoComponentTextarea>
      );
    }
  }
};
