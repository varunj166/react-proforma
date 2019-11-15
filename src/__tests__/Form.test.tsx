import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import { Form } from '../Form';
import { ProformaContextProvider } from '../ProformaContext';

describe('Form component', () => {
  afterEach(cleanup);

  it('Renders without errors', () => {
    const tree = (
      <Form>
        <input type="text" />
      </Form>
    );
    const result = render(tree);

    expect(result.container.querySelector('form')).toBeInTheDocument();
  });

  it('Executes handleSubmit from context when form is submitted', () => {
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
        <Form>
          <input type="text" />
          <button type="submit">Submit</button>
        </Form>
      </ProformaContextProvider>
    );

    const result = render(tree);

    fireEvent.click(result.getByText('Submit'));

    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('Renders a custom component when one is provided', () => {
    const CustomComponent: React.FunctionComponent = ({
      children,
      ...otherProps
    }) => (
      <form {...otherProps} data-testid="custom-component">
        {children}
      </form>
    );

    const tree = (
      <Form component={CustomComponent}>
        <input type="text" />
        <button type="submit">Submit</button>
      </Form>
    );

    const result = render(tree);

    expect(result.getByTestId('custom-component')).toBeInTheDocument();
  });

  it('Passes extra props to final component', () => {
    const tree = (
      <Form test-prop="test-prop">
        <input type="text" />
        <button type="submit">Submit</button>
      </Form>
    );

    const result = render(tree);

    expect(
      result.container.querySelector('[test-prop="test-prop"]')
    ).toBeInTheDocument();
  });
});
