import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Select } from '../Select';
import { ProformaContextProvider } from '../ProformaContext';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

const testText = 'test text';
const testValue1 = 'testValue1';

describe('Select component', () => {
  afterEach(cleanup);

  // afterAll(() => {
  // 	mockConsoleError.mockRestore();
  // });

  describe('Standard select', () => {
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
          <Select name="test" data-testid="test" test-prop="test-prop">
            <option value="testValue1">testValue1</option>
            <option value="testValue2">testValue2</option>
            <option value="testValue3">testValue3</option>
            <option value="testValue4">testValue4</option>
          </Select>
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('select')).toBeInTheDocument();
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
          <Select name="test" data-testid="test" test-prop="test-prop">
            <option value="testValue1">testValue1</option>
            <option value="testValue2">testValue2</option>
            <option value="testValue3">testValue3</option>
            <option value="testValue4">testValue4</option>
          </Select>
        </ProformaContextProvider>
      );

      const result = render(tree);

      fireEvent.change(result.getByTestId('test'));
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });

  describe('With custom component (with children)', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = (props) => {
      const { children, ...otherProps } = props;
      return <select {...otherProps}>{children}</select>;
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
          <Select
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          >
            <option value="testValue1">testValue1</option>
            <option value="testValue2">testValue2</option>
            <option value="testValue3">testValue3</option>
            <option value="testValue4">testValue4</option>
          </Select>
        </ProformaContextProvider>
      );

      const result = render(tree);

      expect(result.getByTestId('test')).toBeInTheDocument();
      expect(result.getByTestId('test')).toHaveValue(testValue1);
      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
      expect(result.container.querySelector('select')).toBeInTheDocument();
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
          <Select
            component={CustomComponent}
            name="test"
            data-testid="test"
            test-prop="test-prop"
          >
            <option value="testValue1">testValue1</option>
            <option value="testValue2">testValue2</option>
            <option value="testValue3">testValue3</option>
            <option value="testValue4">testValue4</option>
          </Select>
        </ProformaContextProvider>
      );

      const result = render(tree);

      fireEvent.change(result.getByTestId('test'));
      fireEvent.focus(result.getByTestId('test'));
      fireEvent.blur(result.getByTestId('test'));

      expect(mockChangeHandler).toBeCalledTimes(1);
      expect(mockFocusHandler).toBeCalledTimes(2);
    });
  });

  describe('With custom component (no children)', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = (props) => {
      return (
        <select {...props}>
          <option value="testValue1">testValue1</option>
          <option value="testValue2">testValue2</option>
          <option value="testValue3">testValue3</option>
          <option value="testValue4">testValue4</option>
        </select>
      );
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
          <Select
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
      expect(result.container.querySelector('select')).toBeInTheDocument();
      expect(result.getByDisplayValue(testValue1)).toBeInTheDocument();
    });
  });
});
