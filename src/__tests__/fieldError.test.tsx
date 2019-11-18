import React from 'react';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement
} from '@testing-library/react';
import { fieldError } from '../fieldError';
import { ProformaContextProvider } from '../ProformaContext';

const testId = 'test-id';
const testField = 'testField';
const errorMessages = ['Error message 1', 'Error message 2'];

describe('fieldError', () => {
  afterEach(cleanup);

  const CustomComponent: React.FunctionComponent<{ error: string }> = (
    props
  ) => {
    return (
      <p data-testid={testId} style={{ color: 'red' }}>
        {props.error}
      </p>
    );
  };

  it('Renders without errors -- touched true', () => {
    const tree = (
      <ProformaContextProvider
        value={{
          errors: {
            [testField]: errorMessages
          },
          touched: {
            [testField]: true
          }
        }}
      >
        {fieldError(testField, CustomComponent)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.getAllByTestId(testId)).toHaveLength(errorMessages.length);
    expect(result.getByText(errorMessages[0])).toBeInTheDocument();
    expect(result.getByText(errorMessages[0])).toHaveStyle('color: red');
    expect(result.getByText(errorMessages[1])).toBeInTheDocument();
    expect(result.getByText(errorMessages[1])).toHaveStyle('color: red');
  });

  it('Returns null if field is not touched', () => {
    const tree = (
      <ProformaContextProvider
        value={{
          errors: {
            [testField]: errorMessages
          },
          touched: {
            [testField]: false
          }
        }}
      >
        {fieldError(testField, CustomComponent)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.container).toBeEmpty();
  });

  it('Returns null if there are no error messages', () => {
    const tree = (
      <ProformaContextProvider
        value={{
          errors: {
            [testField]: null
          },
          touched: {
            [testField]: true
          }
        }}
      >
        {fieldError(testField, CustomComponent)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.container).toBeEmpty();
  });

  it('Throws an error if a name arg is not provided', () => {
    const name = (null as unknown) as string;
    expect(() => fieldError(name, CustomComponent)).toThrowError();
  });

  it('Throws an error if a component arg is not provided', () => {
    const component = (null as unknown) as React.ComponentType<any>;
    expect(() => fieldError(name, component)).toThrowError();
  });

  it('Performs memoization to determine what array of components to return', async () => {
    const newErrorMessages = [
      'Error message 3',
      'Error message 4',
      'Error message 5'
    ];

    let _values = {
      values: {
        [testField]: ''
      },
      errors: {
        [testField]: errorMessages
      },
      touched: {
        [testField]: true
      }
    };

    function switchValues() {
      _values = {
        ..._values,
        errors: {
          [testField]: newErrorMessages
        }
      };
    }

    const tree = (
      <ProformaContextProvider value={_values}>
        <button data-testid={testId} onClick={() => switchValues()}>
          click me
        </button>
        {fieldError(testField, CustomComponent)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    fireEvent.click(result.getByText('click me'));

    const updatedErrorComponents = await waitForElement(() =>
      result.getAllByTestId(testId)
    );

    expect(updatedErrorComponents).toHaveLength(3);
  });
});
