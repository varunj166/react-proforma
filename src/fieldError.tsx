import React from 'react';
import { ProformaBundle, MemoComparePropsType } from './types';
import { ProformaContextConsumer } from './ProformaContext';
import memoize, { EqualityFn as EqualityFnType } from 'memoize-one';

type FieldErrorComponentType = React.ComponentType<{ error: string }>;
type MapErrorsArgsType = [string[], FieldErrorComponentType];

interface IMemoFieldErrorProps {
  component: FieldErrorComponentType;
  error: string;
}

function memoCompare(
  prevProps: MemoComparePropsType<IMemoFieldErrorProps>,
  nextProps: MemoComparePropsType<IMemoFieldErrorProps>
): boolean {
  return prevProps.error === nextProps.error;
}

const _FieldError: React.FunctionComponent<IMemoFieldErrorProps> = (props) => {
  const { component: Component, error } = props;

  return <Component error={error} />;
};

const MemoFieldError = React.memo<IMemoFieldErrorProps>(
  _FieldError,
  memoCompare
);

// ==== MEMOIZING THE ARRAY MAPPING ====
const equalityFn: EqualityFnType = (newArgs, lastArgs) => {
  const newErrors: string[] = newArgs[0];
  const lastErrors: string[] = lastArgs[0];

  if (newErrors.length !== lastErrors.length) return false;

  for (let i = 0, n = newErrors.length; i < n; i++) {
    if (newErrors[i] !== lastErrors[i]) return false;
  }

  return true;
};

function getErrorMappingFn(component: FieldErrorComponentType) {
  return function errorMappingFn(error: string, index: number) {
    return <MemoFieldError key={index} component={component} error={error} />;
  };
}

function mapErrors(errors: string[], component: FieldErrorComponentType) {
  return errors.map(getErrorMappingFn(component));
}

const memoMapErrors = memoize(mapErrors, equalityFn);

function getContextConsumerProcessor(
  name: string,
  component: FieldErrorComponentType
) {
  return function processContextConsumer({
    touched,
    errors
  }: ProformaBundle<any>) {
    // necessary for type guard to work
    const _errors = errors[name];
    const _touched = touched[name];

    if (_touched === true && _errors !== null) {
      return memoMapErrors(_errors, component);
    }

    return null;
  };
}

/**
 * Takes a component that you provide and returns an array of your component, each of which has been provided the error message as a prop "error".
 * The errors will be displayed only if that field has been touched, and there are errors to display (based on the validationObject you provided).
 * This means the component you provide must accept a single prop named "error", which you can use to display the error message however you like inside the component.
 *
 * @param {string} name - A form element name that corresponds with a property on your "initialValues" object.
 * @param {React.ComponentType<{ error: string }>} component - Any component that accepts a single string prop called "error", which you use to display the error message inside your component.
 * @returns {JSX.Element} JSX.Element
 */
export function fieldError(name: string, component: FieldErrorComponentType) {
  if (!name)
    throw new Error(
      '"fieldError" will not function without a "name" argument passed to it. Please provide a "name" argument that corresponds with one of the properties on your "initialValues" object.'
    );

  if (!component)
    throw new Error(
      '"fieldError" will not function without a "component" argument passed to it. Please provide one.'
    );

  return (
    <ProformaContextConsumer>
      {getContextConsumerProcessor(name, component)}
    </ProformaContextConsumer>
  );
}
