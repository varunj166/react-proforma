import React from 'react';
import { ProformaBundle, MemoComparePropsType } from './types';
import { ProformaContextConsumer } from './ProformaContext';

type FieldValidComponentType = React.ComponentType<{ message: string }>;

interface IMemoFieldValidProps {
  component: FieldValidComponentType;
  message: string;
}

function memoCompare(
  prevProps: MemoComparePropsType<IMemoFieldValidProps>,
  nextProps: MemoComparePropsType<IMemoFieldValidProps>
): boolean {
  return prevProps.message === nextProps.message;
}

const _FieldValid: React.FunctionComponent<IMemoFieldValidProps> = (props) => {
  const { component: Component, message } = props;

  return <Component message={message} />;
};

const MemoFieldValid = React.memo<IMemoFieldValidProps>(
  _FieldValid,
  memoCompare
);

function getContextConsumerProcessor(
  name: string,
  component: FieldValidComponentType,
  message: string
) {
  return function processContextConsumer({
    values,
    touched,
    errors
  }: ProformaBundle<any>) {
    // necessary for type guard to work
    const _touched = touched[name];
    const _errors = errors[name];

    if (_touched === true && _errors === null) {
      return <MemoFieldValid component={component} message={message} />;
    }

    return null;
  };
}

/**
 * Takes a component that you provide and returns that component, passing in the message (which you provide here) as a prop called "message".
 * The message will display if there are no errors in that field, based on the validationObject you provide.
 * Whether the message is displayed only if that field has been touched is dependent on the fourth argument to this function, which defaults to true.
 * (Set it to false if you want to display the message even if the field hasn't been touched).
 * The component you provide must accept a single prop named "message", which you can use to display the message however you like inside the component.
 *
 * @param {string} name - A form element name that corresponds with a property on your "initialValues" object.
 * @param {React.ComponentType<{ error: string }>} component - Any component that accepts a single string prop called "message", which you use to display the message inside your component.
 * @param {string} message - The message you wish to display if there are no errors.
 * @returns {JSX.Element} JSX.Element
 */

export function fieldValid(
  name: string,
  component: FieldValidComponentType,
  message: string
) {
  if (!name)
    throw new Error(
      '"fieldValid" will not function without a "name" argument passed to it. Please provide a "name" argument that corresponds with one of the properties on your "initialValues" object.'
    );

  if (!component)
    throw new Error(
      '"fieldValid" will not function without a "component" argument passed to it. Please provide one.'
    );

  if (!message)
    throw new Error(
      '"fieldValid" will not function without a "message" argument passed to it. Please provide one.'
    );

  return (
    <ProformaContextConsumer>
      {getContextConsumerProcessor(name, component, message)}
    </ProformaContextConsumer>
  );
}
