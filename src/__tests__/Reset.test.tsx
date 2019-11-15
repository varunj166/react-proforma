import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Reset } from '../Reset';
import { ProformaContextProvider } from '../ProformaContext';

const testText = 'test text';

describe('Reset component', () => {
  afterEach(cleanup);

  it('Renders without errors', () => {
    const result = render(<Reset />);
    // console.log(result.debug());

    expect(result.getByRole('button')).toBeInTheDocument();
  });

  it('Executes handleReset function from context when clicked', () => {
    const mockHandleReset = jest.fn();

    const tree = (
      <ProformaContextProvider
        value={{
          handleReset: mockHandleReset
        }}
      >
        <Reset />
      </ProformaContextProvider>
    );

    const result = render(tree);

    // click reset button
    fireEvent.click(result.getByText('Reset'));

    expect(mockHandleReset).toHaveBeenCalledTimes(1);
  });

  describe('Without custom component', () => {
    afterEach(cleanup);

    it('Renders button with default text', () => {
      const result = render(<Reset />);

      expect(result.getByText('Reset')).toBeInTheDocument();
    });

    it('Renders button with custom text', () => {
      const result = render(<Reset text={testText} />);

      expect(result.getByText(testText)).toBeInTheDocument();
    });

    it('Passes extra props to final component', () => {
      const result = render(<Reset text={testText} test-prop="test-prop" />);

      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
    });
  });

  describe('With custom component', () => {
    afterEach(cleanup);

    const CustomComponent: React.FunctionComponent = ({
      children,
      ...otherProps
    }) => (
      <div data-testid="custom-component" {...otherProps}>
        {children}
      </div>
    );

    it('Renders component with default text', () => {
      const result = render(<Reset component={CustomComponent} />);

      // console.log(result.debug());

      expect(result.getByTestId('custom-component')).toBeInTheDocument();
      expect(result.getByText('Reset')).toBeInTheDocument();
    });

    it('Renders component with custom text', () => {
      const result = render(
        <Reset component={CustomComponent} text={testText} />
      );

      // console.log(result.debug());

      expect(result.getByTestId('custom-component')).toBeInTheDocument();
      expect(result.getByText(testText)).toBeInTheDocument();
    });

    it('Passes extra props to final component', () => {
      const result = render(
        <Reset
          component={CustomComponent}
          text={testText}
          test-prop="test-prop"
        />
      );

      // console.log(result.debug());

      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
    });
  });
});
