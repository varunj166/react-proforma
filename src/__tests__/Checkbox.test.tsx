import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Checkbox } from '../Checkbox';
import { ProformaContextProvider } from '../ProformaContext';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

const testText = 'test text';

describe('Checkbox component', () => {
  afterEach(cleanup);

  // afterAll(() => {
  // 	mockConsoleError.mockRestore();
  // });

  describe('Standard Checkbox', () => {
    afterEach(cleanup);

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: true
            }
          }}
        >
          <Checkbox name="test" data-testid="test" test-prop="test-prop" />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toBeChecked();
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
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
              test: true
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Checkbox name="test" data-testid="test" test-prop="test-prop" />
        </ProformaContextProvider>
      );

      const result = render(tree);

      // fireEvent.change(result.getByTestId('test'), {
      // 	target: { checked: false }
      // });
      fireEvent.click(result.getByTestId('test'));
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });

  describe('With custom component', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = (props) => {
      return <input type="checkbox" {...props} />;
    };

    it('Renders without errors', () => {
      const tree = (
        <ProformaContextProvider
          value={{
            values: {
              test: true
            }
          }}
        >
          <Checkbox
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toBeChecked();
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('input')).toBeInTheDocument();
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
              test: true
            },
            handleChange: mockChangeHandler,
            handleFocus: mockFocusHandler,
            handleBlur: mockFocusHandler
          }}
        >
          <Checkbox
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          />
        </ProformaContextProvider>
      );

      const result = render(tree);

      // fireEvent.change(result.getByTestId('test'), {
      // 	target: { checked: false }
      // });
      fireEvent.click(result.getByTestId('test'));
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });
});
