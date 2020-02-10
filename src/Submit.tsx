import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

interface ISubmitProps {
  component?: React.ComponentType<any>;
  textNotSubmitting?: string;
  textSubmitting?: string;
  style?: {
    [key: string]: string;
  };
}

function memoCompare<T = any>(
  prevProps: MemoComparePropsType<T>,
  nextProps: MemoComparePropsType<T>
): boolean {
  return prevProps.isSubmitting === nextProps.isSubmitting;
}

function _handleClick(
  event: React.SyntheticEvent<HTMLElement>,
  handleSubmit: (
    event: React.FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>
  ) => void
) {
  event.preventDefault();
  handleSubmit(event);
}

// ==== STANDARD BUTTON ====
const _SubmitButton: React.FunctionComponent<ISubmitProps &
  IndexableObjectType> = (props) => {
  const {
    textNotSubmitting,
    textSubmitting,
    isSubmitting,
    children,
    handleSubmit,
    ...otherProps
  } = props;

  if (!children) {
    return (
      <button
        type="submit"
        onClick={(event) => _handleClick(event, handleSubmit)}
        {...otherProps}
      >
        {!isSubmitting ? textNotSubmitting : textSubmitting}
      </button>
    );
  }
  return (
    <button
      type="submit"
      onClick={(event) => _handleClick(event, handleSubmit)}
      {...otherProps}
    >
      {!isSubmitting ? textNotSubmitting : textSubmitting}
      {children}
    </button>
  );
};

const MemoSubmitButton = React.memo<ISubmitProps & IndexableObjectType>(
  _SubmitButton,
  memoCompare
);

// ==== COMPONENT BUTTON ====
const _ComponentSubmitButton: React.FunctionComponent<ISubmitProps &
  IndexableObjectType> = (props) => {
  const {
    textNotSubmitting,
    textSubmitting,
    isSubmitting,
    children,
    handleSubmit,
    component: Component,
    ...otherProps
  } = props;

  if (Component) {
    if (!children) {
      return (
        <Component
          type="submit"
          role="button"
          onClick={(event: React.SyntheticEvent<HTMLElement>) =>
            _handleClick(event, handleSubmit)
          }
          {...otherProps}
        >
          {!isSubmitting ? textNotSubmitting : textSubmitting}
        </Component>
      );
    }
    return (
      <Component
        type="submit"
        role="button"
        onClick={(event: React.SyntheticEvent<HTMLElement>) =>
          _handleClick(event, handleSubmit)
        }
        {...otherProps}
      >
        {!isSubmitting ? textNotSubmitting : textSubmitting}
        {children}
      </Component>
    );
  } else {
    return null;
  }
};

const MemoComponentSubmitButton = React.memo<
  ISubmitProps & IndexableObjectType
>(_ComponentSubmitButton, memoCompare);

/**
 * When placed inside a form element (or React Proforma's Form component),
 * will submit the form data. Its display text will change from "Submit" to
 * "Submitting..." by default when the form is submitted, but these are configurable.
 *
 * @param {React.ComponentType=} [component] - Custom component to be used instead of a standard button.
 * @param {string=} [textNotSubmitting] - Text to be displayed when the form is not in a submitting state.
 * @param {string=} [textSubmitting] - Text to be displayed when the form is in a submitting state.
 * @returns {JSX.Element} JSX.Element
 */
export const Submit: React.FunctionComponent<ISubmitProps &
  IndexableObjectType &
  React.ComponentProps<'button'>> = (props) => {
  // console.log('Button component re-rendering.');
  const {
    isSubmitting: _rPIsSubmitting,
    handleSubmit: _rPHandleSubmit
  } = React.useContext<ProformaBundle<any>>(ProformaContext);
  const {
    children,
    component: Component,
    textNotSubmitting,
    textSubmitting,
    // strip away and discard the following props if present
    role,
    type,
    isSubmitting,
    onClick,
    handleSubmit,
    // ****************************************************
    ...otherProps
  } = props;

  if (!Component) {
    if (!children) {
      return (
        <MemoSubmitButton
          textNotSubmitting={textNotSubmitting || 'Submit'}
          textSubmitting={textSubmitting || 'Submitting...'}
          isSubmitting={_rPIsSubmitting}
          handleSubmit={_rPHandleSubmit}
          {...otherProps}
        />
      );
    }
    return (
      <MemoSubmitButton
        textNotSubmitting={textNotSubmitting || 'Submit'}
        textSubmitting={textSubmitting || 'Submitting...'}
        isSubmitting={_rPIsSubmitting}
        handleSubmit={_rPHandleSubmit}
        {...otherProps}
      >
        {children}
      </MemoSubmitButton>
    );
  }

  if (!children) {
    return (
      <MemoComponentSubmitButton
        component={Component}
        textNotSubmitting={textNotSubmitting || 'Submit'}
        textSubmitting={textSubmitting || 'Submitting...'}
        isSubmitting={_rPIsSubmitting}
        handleSubmit={_rPHandleSubmit}
        {...otherProps}
      />
    );
  }
  return (
    <MemoComponentSubmitButton
      component={Component}
      textNotSubmitting={textNotSubmitting || 'Submit'}
      textSubmitting={textSubmitting || 'Submitting...'}
      isSubmitting={_rPIsSubmitting}
      handleSubmit={_rPHandleSubmit}
      {...otherProps}
    >
      {children}
    </MemoComponentSubmitButton>
  );
};
