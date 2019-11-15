import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Submit } from '../Submit';
import { ProformaContextProvider } from '../ProformaContext';

const testText = 'test text';

describe('Submit component', () => {
  afterEach(cleanup);

  it('Renders without errors', () => {
    const result = render(<Submit />);
    // console.log(result.debug());

    expect(result.getByRole('button')).toBeInTheDocument();
  });

  it('Executes handleSubmit from context when clicked', () => {
    const mockHandleSubmit = jest
      .fn()
      .mockImplementationOnce((event: React.FormEvent<HTMLFormElement>) =>
        event.preventDefault()
      );

    const tree = (
      <ProformaContextProvider
        value={{
          handleSubmit: mockHandleSubmit
        }}
      >
        <Submit />
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.getByText('Submit')).toBeInTheDocument();

    // click Submit button
    fireEvent.click(result.getByText('Submit'));

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('Displays "Submitting..." when context provider has value of isSubmitting: true', () => {
    const tree = (
      <ProformaContextProvider
        value={{
          isSubmitting: true
        }}
      >
        <Submit />
      </ProformaContextProvider>
    );

    const result = render(tree);

    expect(result.getByText('Submitting...')).toBeInTheDocument();
  });

  describe('Without custom component', () => {
    afterEach(cleanup);

    it('Renders button with default text', () => {
      const result = render(<Submit />);

      expect(result.getByText('Submit')).toBeInTheDocument();
    });

    it('Renders button with custom text', () => {
      const result = render(<Submit textNotSubmitting={testText} />);

      expect(result.getByText(testText)).toBeInTheDocument();
    });

    it('Passes extra props to final component', () => {
      const result = render(<Submit test-prop="test-prop" />);

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
      const result = render(<Submit component={CustomComponent} />);

      // console.log(result.debug());

      expect(result.getByTestId('custom-component')).toBeInTheDocument();
      expect(result.getByText('Submit')).toBeInTheDocument();
    });

    it('Renders component with custom text', () => {
      const result = render(
        <Submit component={CustomComponent} textNotSubmitting={testText} />
      );

      // console.log(result.debug());

      expect(result.getByTestId('custom-component')).toBeInTheDocument();
      expect(result.getByText(testText)).toBeInTheDocument();
    });

    it('Passes extra props to final component', () => {
      const result = render(
        <Submit component={CustomComponent} test-prop="test-prop" />
      );

      // console.log(result.debug());

      expect(
        result.container.querySelector('[test-prop="test-prop"]')
      ).toBeInTheDocument();
    });
  });
});
