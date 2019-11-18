import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { fieldValid } from '../fieldValid';
import { ProformaContextProvider } from '../ProformaContext';

const testId = 'test-id';
const testField = 'testField';
const message = 'valid message';
const errorMessages = ['Error message 1', 'Error message 2'];

describe('fieldValid', () => {
  afterEach(cleanup);

  const CustomComponent: React.FunctionComponent<{ message: string }> = (
    props
  ) => {
    return (
      <p data-testid={testId} style={{ color: 'green' }}>
        {props.message}
      </p>
    );
  };

  it('Renders without errors -- touched true', () => {
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
        {fieldValid(testField, CustomComponent, message)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.getAllByTestId(testId)).toHaveLength(1);
    expect(result.getByText(message)).toBeInTheDocument();
    expect(result.getByText(message)).toHaveStyle('color: green');
  });

  it('Returns null if field is not touched', () => {
    const tree = (
      <ProformaContextProvider
        value={{
          errors: {
            [testField]: null
          },
          touched: {
            [testField]: false
          }
        }}
      >
        {fieldValid(testField, CustomComponent, message)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.container).toBeEmpty();
  });

  it('Returns null if there are error message', () => {
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
        {fieldValid(testField, CustomComponent, message)}
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.container).toBeEmpty();
  });

  it('Throws an error if a name arg is not provided', () => {
    const name = (null as unknown) as string;
    expect(() => fieldValid(name, CustomComponent, message)).toThrowError();
  });

  it('Throws an error if a component arg is not provided', () => {
    const component = (null as unknown) as React.ComponentType<any>;
    expect(() => fieldValid(testField, component, message)).toThrowError();
  });

  it('Throws an error if a message arg is not provided', () => {
    const _message = (null as unknown) as string;
    expect(() =>
      fieldValid(testField, CustomComponent, _message)
    ).toThrowError();
  });
});
