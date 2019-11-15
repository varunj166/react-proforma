import React from 'react';
import { render, cleanup } from '@testing-library/react';
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
});
