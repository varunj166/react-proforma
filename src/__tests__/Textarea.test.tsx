import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Textarea } from '../Textarea';
import { ProformaContextProvider } from '../ProformaContext';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

const testText = 'test text';
const testValue1 = 'testValue1';

describe('Textarea component', () => {
  afterEach(cleanup);

  // afterAll(() => {
  // 	mockConsoleError.mockRestore();
  // });

  describe('Standard Textarea', () => {
    afterEach(cleanup);

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Textarea name="test" data-testid="test" test-prop="test-prop" />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('textarea')).toBeInTheDocument();
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
          <Textarea name="test" data-testid="test" test-prop="test-prop" />
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
      return <textarea {...props} />;
    };

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: testValue1
            }
          }}
        >
          <Textarea
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
      expect(result.container.querySelector('textarea')).toBeInTheDocument();
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
          <Textarea
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
