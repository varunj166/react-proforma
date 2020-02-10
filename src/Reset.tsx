import React from 'react';
import {
  IndexableObjectType,
  ProformaBundle,
  MemoComparePropsType
} from './types';
import { ProformaContext } from './ProformaContext';

export interface IResetProps {
  component?: React.ComponentType<any>;
  text?: string;
}

interface IMemoResetProps {
  text: string;
  handleReset: (event: React.SyntheticEvent<HTMLElement>) => void;
  component?: React.ComponentType<any>;
}

function memoCompare<T = any>(
  prevProps: MemoComparePropsType<T>,
  nextProps: MemoComparePropsType<T>
): boolean {
  return prevProps.text === nextProps.text;
}

// ==== STANDARD BUTTON ====
const _ResetButton: React.FunctionComponent<IMemoResetProps &
  IndexableObjectType> = (props) => {
  const { text, children, handleReset, ...otherProps } = props;

  if (!children) {
    return (
      <button onClick={handleReset} type="reset" {...otherProps}>
        {text}
      </button>
    );
  }
  return (
    <button onClick={handleReset} type="reset" {...otherProps}>
      {text}
      {children}
    </button>
  );
};

const MemoResetButton = React.memo<IMemoResetProps & IndexableObjectType>(
  _ResetButton,
  memoCompare
);

// ==== COMPONENT BUTTON ====
const _ComponentResetButton: React.FunctionComponent<IMemoResetProps &
  IndexableObjectType> = (props) => {
  const {
    text,
    children,
    handleReset,
    component: Component,
    ...otherProps
  } = props;

  if (Component) {
    if (!children) {
      return (
        <Component
          onClick={handleReset}
          type="reset"
          role="button"
          {...otherProps}
        >
          {text}
        </Component>
      );
    }
    return (
      <Component
        onClick={handleReset}
        type="reset"
        role="button"
        {...otherProps}
      >
        {text}
        {children}
      </Component>
    );
  } else {
    return null;
  }
};

const MemoComponentResetButton = React.memo<
  IMemoResetProps & IndexableObjectType
>(_ComponentResetButton, memoCompare);

/**
 * Reset component executes the handleReset private method inside
 * the Proforma class. handleReset re-generates the internal
 * state object using the initialValues prop passed
 * to the Proforma component.
 *
 * @param {React.ComponentType=} [component] - Custom component to be used instead of a standard button.
 * @param {string=} [text=Reset] - Text to be displayed inside the button/custom component instead of "Reset". Note: your
 * custom component accesses this text through {props.children} inside your component's render.
 * @returns {JSX.Element} JSX.Element
 */
export const Reset: React.FunctionComponent<IResetProps &
  IndexableObjectType &
  React.ComponentProps<'input'>> = (props) => {
  // console.log('Button component re-rendering.');
  const { handleReset: _rPHandleReset } = React.useContext<ProformaBundle<any>>(
    ProformaContext
  );
  const {
    children,
    component: Component,
    text,
    // strip away and discard the following props if present
    role,
    handleReset,
    onClick,
    type,
    // ****************************************************
    ...otherProps
  } = props;

  if (!Component) {
    if (!children) {
      return (
        <MemoResetButton
          handleReset={_rPHandleReset}
          text={text || 'Reset'}
          {...otherProps}
        />
      );
    }
    return (
      <MemoResetButton
        handleReset={_rPHandleReset}
        text={text || 'Reset'}
        {...otherProps}
      >
        {children}
      </MemoResetButton>
    );
  }

  if (!children) {
    return (
      <MemoComponentResetButton
        handleReset={_rPHandleReset}
        component={Component}
        text={text || 'Reset'}
        {...otherProps}
      />
    );
  }
  return (
    <MemoComponentResetButton
      handleReset={_rPHandleReset}
      component={Component}
      text={text || 'Reset'}
      {...otherProps}
    >
      {children}
    </MemoComponentResetButton>
  );
};
