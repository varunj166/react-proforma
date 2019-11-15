import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Radio } from '../Radio';
import { ProformaContextProvider } from '../ProformaContext';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

const testText = 'test text';

describe('Radio component', () => {
  afterEach(cleanup);

  // afterAll(() => {
  // 	mockConsoleError.mockRestore();
  // });

  describe('Standard Radio button', () => {
    afterEach(cleanup);

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: 'radio2'
            }
          }}
        >
          <Radio
            value="radio1"
            name="test"
            data-testid="test1"
            test-prop="test-prop"
          />
          <Radio
            value="radio2"
            name="test"
            data-testid="test2"
            test-prop="test-prop"
          />
          <Radio
            value="radio3"
            name="test"
            data-testid="test3"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test1')).toBeInTheDocument();
      expect(result.getByTestId('test2')).toBeInTheDocument();
      expect(result.getByTestId('test3')).toBeInTheDocument();
      expect(result.getByTestId('test2')).toBeChecked();
      expect(
        result.container.querySelectorAll('[test-prop="test-prop"]')
      ).toHaveLength(3);
      expect(result.container.querySelectorAll('input')).toHaveLength(3);
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
              test: 'radio2'
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Radio
            value="radio1"
            name="test"
            data-testid="test1"
            test-prop="test-prop"
          />
          <Radio
            value="radio2"
            name="test"
            data-testid="test2"
            test-prop="test-prop"
          />
          <Radio
            value="radio3"
            name="test"
            data-testid="test3"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      // fireEvent.change(result.getByTestId('test'), {
      // 	target: { checked: false }
      // });
      fireEvent.click(result.getByTestId('test3'));
      fireEvent.focus(result.getByTestId('test2'));
      fireEvent.blur(result.getByTestId('test2'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });

  describe('With custom component', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = (props) => {
      return <input type="radio" {...props} />;
    };

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: 'radio3'
            }
          }}
        >
          <Radio
            component={CustomComponent}
            value="radio1"
            name="test"
            data-testid="test1"
            test-prop="test-prop"
          />
          <Radio
            component={CustomComponent}
            value="radio2"
            name="test"
            data-testid="test2"
            test-prop="test-prop"
          />
          <Radio
            component={CustomComponent}
            value="radio3"
            name="test"
            data-testid="test3"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test1')).toBeInTheDocument();
      expect(result.getByTestId('test2')).toBeInTheDocument();
      expect(result.getByTestId('test3')).toBeInTheDocument();
      expect(result.getByTestId('test3')).toBeChecked();
      expect(
        result.container.querySelectorAll('[test-prop="test-prop"]')
      ).toHaveLength(3);
      expect(result.container.querySelectorAll('input')).toHaveLength(3);
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
              test: 'radio2'
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Radio
            component={CustomComponent}
            value="radio1"
            name="test"
            data-testid="test1"
            test-prop="test-prop"
          />
          <Radio
            component={CustomComponent}
            value="radio2"
            name="test"
            data-testid="test2"
            test-prop="test-prop"
          />
          <Radio
            component={CustomComponent}
            value="radio3"
            name="test"
            data-testid="test3"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      // fireEvent.change(result.getByTestId('test'), {
      // 	target: { checked: false }
      // });
      fireEvent.click(result.getByTestId('test3'));
      fireEvent.focus(result.getByTestId('test2'));
      fireEvent.blur(result.getByTestId('test2'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });
});
