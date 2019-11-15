import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Field } from '../Field';
import { ProformaContextProvider } from '../ProformaContext';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

const testText = 'test text';
const testValue1 = 'testValue1';

describe('Field component', () => {
  afterEach(cleanup);

  // afterAll(() => {
  // 	mockConsoleError.mockRestore();
  // });

  describe('Standard Field', () => {
    afterEach(cleanup);

    it('Renders without errors -- no type specified', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Field name="test" data-testid="test" test-prop="test-prop" />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(
        result.container.querySelector('[type="text"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
      expect(result.getByDisplayValue(testValue1)).toBeInTheDocument();
    });

    it('Renders without errors -- type specified', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Field
            name="test"
            type="email"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(
        result.container.querySelector('[type="email"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
      expect(result.getByDisplayValue(testValue1)).toBeInTheDocument();
    });

    it('Executes handlers from context', () => {
      const mockChangeHandler = jest
        .fn()
        .mockImplementationOnce(
          (event: React.ChangeEvent<HTMLTextAreaElement>) =>
            event.preventDefault()
        );

      const mockFocusHandler = jest
        .fn()
        .mockImplementation((event: React.FocusEvent<HTMLInputElement>) => {});

      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Field name="test" data-testid="test" test-prop="test-prop" />
        </ProformaContextProvider>
      );

      const result = render(tree);

      fireEvent.change(result.getByTestId('test'), {
        target: { value: testText }
      });
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });

  describe('With custom component', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = (props) => {
      return <input {...props} />;
    };

    it('Renders without errors -- no type specified', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Field
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(
        result.container.querySelector('[type="text"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
      expect(result.getByDisplayValue(testValue1)).toBeInTheDocument();
    });

    it('Renders without errors -- type specified', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Field
            component={CustomComponent}
            type="password"
            name="test"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(
        result.container.querySelector('[type="password"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
      expect(result.getByDisplayValue(testValue1)).toBeInTheDocument();
    });

    it('Executes handlers from context', () => {
      const mockChangeHandler = jest
        .fn()
        .mockImplementationOnce((event: React.ChangeEvent<HTMLInputElement>) =>
          event.preventDefault()
        );

      const mockFocusHandler = jest
        .fn()
        .mockImplementation((event: React.FocusEvent<HTMLInputElement>) => {});

      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Field
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      fireEvent.change(result.getByTestId('test'), {
        target: { value: testText }
      });
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });
});
