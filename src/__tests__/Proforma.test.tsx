import React from 'react';
import {
	render,
	cleanup,
	fireEvent,
	waitForElement,
	waitForDomChange,
	getAllByTestId
} from '@testing-library/react';
import { Proforma } from '../Proforma';
import { ProformaBundle } from '../types';
import { waitForPromise } from '../test-utils';

// const mockConsoleError = jest.spyOn(console, 'error');
// mockConsoleError.mockImplementation(() => {});

type ValuesType = {
	checkbox: boolean;
	radio: string;
	textarea: string;
	select: string;
	field: string;
};

const initialValues: ValuesType = {
	checkbox: true,
	radio: 'radio value 1',
	textarea: 'textarea value',
	select: 'select value',
	field: 'field value'
};

const errorMessages = ['Error message 1', 'Error message 2'];

const testId = 'test-id';
const testText = 'test text';

describe('Proforma component', () => {
	afterEach(cleanup);

	// afterAll(() => {
	// 	mockConsoleError.mockRestore();
	// });

	it('Renders without errors', () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={() => {}}
			>
				{() => (
					<form data-testid={testId}>
						<input data-testid={testId} />
						<button data-testid={testId}>Submit</button>
					</form>
				)}
			</Proforma>
		);

		const result = render(tree);

		expect(result.getAllByTestId(testId)).toHaveLength(3);
		expect(result.container.querySelector('form')).toBeInTheDocument();
		expect(result.container.querySelector('input')).toBeInTheDocument();
		expect(result.getByText('Submit')).toBeInTheDocument();
	});

	it('Updates touched [onFocus -> onBlur]', async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={() => {}}
			>
				{({
					handleChange,
					handleFocus,
					handleBlur,
					values,
					touched
				}: ProformaBundle<ValuesType>) => (
					<form>
						<input
							type="text"
							name="field"
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							value={values['field']}
							data-testid={testId}
						/>
						{touched['field'] === true && <p>{testText}</p>}
					</form>
				)}
			</Proforma>
		);

		const result = render(tree);

		fireEvent.focus(result.getByTestId(testId));
		fireEvent.blur(result.getByTestId(testId));

		const newPara = await waitForElement(() => result.getByText(testText));

		expect(newPara).toBeInTheDocument();
  });
  
  it('Uses config.resetTouchedOnFocus to reset the touched boolean value onFocus', async () => {
    const tree = (
			<Proforma<ValuesType>
				config={{
          initialValues: initialValues,
          resetTouchedOnFocus: true
				}}
				handleSubmit={() => {}}
			>
				{({
					handleChange,
					handleFocus,
					handleBlur,
					values,
					touched
				}: ProformaBundle<ValuesType>) => (
					<form>
						<input
							type="text"
							name="field"
							onChange={handleChange}
							onFocus={handleFocus}
							onBlur={handleBlur}
							value={values['field']}
							data-testid={testId}
						/>
						{touched['field'] === false && <p>{testText}</p>}
					</form>
				)}
			</Proforma>
		);

    const result = render(tree);
    
    fireEvent.focus(result.getByTestId(testId));
    
    const newPara = await waitForElement(() => result.getByText(testText));

		expect(newPara).toBeInTheDocument();
  });

	it("Executes user's handleSubmit function when form is submitted", () => {
		const mockHandleSubmit = jest.fn();

		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={mockHandleSubmit}
			>
				{({ handleSubmit }: ProformaBundle<ValuesType>) => (
					<form data-testid={testId} onSubmit={handleSubmit}>
						<input />
						<button>Submit</button>
					</form>
				)}
			</Proforma>
		);

		const result = render(tree);

		fireEvent.submit(result.getByTestId(testId));

		expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
	});

	it("Validates onChange based on user's validationObject and stores result in errors object", async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues,
					validationObject: {
						field: (values) => {
							const { field } = values;
							const errors: string[] = [];

							if (field.length < 100) {
								errors.push(errorMessages[0]);
							}
							if (!/falafel/.test(field)) {
								errors.push(errorMessages[1]);
							}

							if (errors.length > 0) {
								return errors;
							}

							return null;
						}
					}
				}}
				handleSubmit={() => {}}
			>
				{({ handleChange, values, errors }: ProformaBundle<ValuesType>) => (
					<form>
						<input
							type="text"
							name="field"
							onChange={handleChange}
							value={values['field']}
						/>
						{errors['field'] &&
							errors['field'].map((error, index) => (
								<p key={index} data-testid={testId}>
									{error}
								</p>
							))}
					</form>
				)}
			</Proforma>
		);

		const result = render(tree);

		fireEvent.change(result.getByDisplayValue(initialValues.field), {
			target: { value: testText }
		});

		const errorParas = await waitForElement(() =>
			result.getAllByTestId(testId)
		);

		// There should now be two errors in the errors.field array
		expect(errorParas).toHaveLength(2);
		expect(errorParas[0].textContent).toEqual(errorMessages[0]);
		expect(errorParas[1].textContent).toEqual(errorMessages[1]);
	});

	it('Executes users customOnChangeObject if present in config object', () => {
		const mock = jest.fn();

		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues,
					customOnChangeObject: {
						field: () => {
							mock();
						}
					}
				}}
				handleSubmit={() => {}}
			>
				{({ handleChange, values }: ProformaBundle<ValuesType>) => (
					<form>
						<input
							type="text"
							name="field"
							onChange={handleChange}
							value={values['field']}
						/>
					</form>
				)}
			</Proforma>
		);

		const result = render(tree);

		fireEvent.change(result.getByDisplayValue(initialValues.field), {
			target: { value: testText }
		});

		expect(mock).toHaveBeenCalledTimes(1);
	});

	it('Exposes a setValues method that can be used to manually set the value(s) of a field', async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
          initialValues: initialValues,
          validationObject: {
            field: (values) => {
              return ['error message'];
            }
          }
				}}
				handleSubmit={() => {}}
			>
				{({ handleChange, values, setValues }: ProformaBundle<ValuesType>) => (
					<div>
						<form>
							<input
								type="text"
								name="field"
								onChange={handleChange}
								value={values['field']}
							/>
							<input
								type="radio"
								name="radio"
								onChange={handleChange}
								value={'radio value 2'}
								checked={values['radio'] === 'radio value 2'}
							/>
						</form>
						<button
							onClick={() =>
								setValues({ field: testText, radio: 'radio value 2' })
							}
							data-testid={testId}
						>
							test
						</button>
					</div>
				)}
			</Proforma>
		);

		const result = render(tree);

		expect(result.getByDisplayValue(initialValues.field)).toBeInTheDocument();
		expect(
			result.container.querySelector('input[type="radio"]')
		).not.toBeChecked();

		fireEvent.click(result.getByTestId(testId));

		const updatedTextInput = await waitForElement(() =>
			result.getByDisplayValue(testText)
		);

		expect(result.container.querySelector('input[type="radio"]')).toBeChecked();
		expect(updatedTextInput).toBeInTheDocument();
	});

	it('Exposes a handleReset method that can be used to reset the field values back to their initial values', async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={() => {}}
			>
				{({
					handleChange,
					values,
					handleReset
				}: ProformaBundle<ValuesType>) => (
					<div>
						<form>
							<input
								type="text"
								name="field"
								onChange={handleChange}
								value={values['field']}
							/>
							<input
								type="text"
								name="textarea"
								onChange={handleChange}
								value={values['textarea']}
							/>
						</form>
						<button
							onClick={(event) => handleReset(event)}
							data-testid={testId}
						>
							test
						</button>
					</div>
				)}
			</Proforma>
		);

		const result = render(tree);

		expect(result.getByDisplayValue(initialValues.field)).toBeInTheDocument();
		expect(
			result.getByDisplayValue(initialValues.textarea)
		).toBeInTheDocument();

		// change values first
		fireEvent.change(result.getByDisplayValue(initialValues.field), {
			target: { value: 'aaaaa' }
		});
		fireEvent.change(result.getByDisplayValue(initialValues.textarea), {
			target: { value: 'bbbbb' }
		});

		// const updatedInputs = await Promise.all([
		// 	waitForElement(() => result.getByDisplayValue('aaaaa')),
		// 	waitForElement(() => result.getByDisplayValue('bbbbb'))
		// ]);
		const updatedInputA = await waitForElement(() =>
			result.getByDisplayValue('aaaaa')
		);
		const updatedInputB = await waitForElement(() =>
			result.getByDisplayValue('bbbbb')
		);

		// check to make sure inputs updated after change event
		expect(updatedInputA).toBeInTheDocument();
		expect(updatedInputB).toBeInTheDocument();

		// click button to execute handleReset
		fireEvent.click(result.getByTestId(testId));

		// const resetInput = await Promise.all([
		// 	waitForElement(() => result.getByDisplayValue(initialValues.field)),
		// 	waitForElement(() => result.getByDisplayValue(initialValues.textarea))
		// ]);
		const resetInputA = await waitForElement(() =>
			result.getByDisplayValue(initialValues.field)
		);
		const resetInputB = await waitForElement(() =>
			result.getByDisplayValue(initialValues.textarea)
		);

		expect(resetInputA).toBeInTheDocument();
		expect(resetInputB).toBeInTheDocument();
	});

	it('Exposes a setSubmitting method that controls the isSubmitting property', async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={() => {}}
			>
				{({ setSubmitting, isSubmitting }: ProformaBundle<ValuesType>) => (
					<div>
						<form>
							<input />
							<button>Submit</button>
						</form>
						<p>{isSubmitting ? 'true' : 'false'}</p>
						<button onClick={() => setSubmitting(true)} data-testid={testId}>
							test
						</button>
					</div>
				)}
			</Proforma>
		);

		const result = render(tree);

		// isSubmitting starts as false
		expect(result.getByText('false')).toBeInTheDocument();

		fireEvent.click(result.getByTestId(testId));

		const truePara = await waitForElement(() => result.getByText('true'));

		expect(truePara).toBeInTheDocument();
	});

	it('Exposes a setComplete method that controls the isComplete property', async () => {
		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={() => {}}
			>
				{({ setComplete, isComplete }: ProformaBundle<ValuesType>) => (
					<div>
						<form>
							<input />
							<button>Submit</button>
						</form>
						<p>{isComplete ? 'true' : 'false'}</p>
						<button onClick={() => setComplete(true)} data-testid={testId}>
							test
						</button>
					</div>
				)}
			</Proforma>
		);

		const result = render(tree);

		// isComplete starts as false
		expect(result.getByText('false')).toBeInTheDocument();

		fireEvent.click(result.getByTestId(testId));

		const truePara = await waitForElement(() => result.getByText('true'));

		expect(truePara).toBeInTheDocument();
	});

	it('Exposes a submitCount property that tracks the number of times a form has been submitted', async () => {
		const mockHandleSubmit = jest.fn();

		const tree = (
			<Proforma<ValuesType>
				config={{
					initialValues: initialValues
				}}
				handleSubmit={mockHandleSubmit}
			>
				{({ handleSubmit, submitCount }: ProformaBundle<ValuesType>) => (
					<div>
						<form onSubmit={handleSubmit} data-testid={testId}>
							<input />
							<button>Submit</button>
						</form>
						<p>{submitCount.toString()}</p>
					</div>
				)}
			</Proforma>
		);

		const result = render(tree);

		fireEvent.submit(result.getByTestId(testId));

		const submitCountPara = await waitForElement(() => result.getByText('1'));

		expect(submitCountPara).toBeInTheDocument();
		expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
	});

	describe('Views testing', () => {
		afterEach(cleanup);
		it('Updates view when checkbox is clicked', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<input
								type="checkbox"
								name="checkbox"
								onChange={handleChange}
								checked={values['checkbox']}
								data-testid={testId}
							/>
							{values['checkbox'] === false && <p>{testText}</p>}
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			expect(result.getByTestId(testId)).toBeInTheDocument();

			// click to uncheck checkbox (sets value to false)
			fireEvent.click(result.getByTestId(testId));

			// Displays when checkbox value is false
			const newPara = await waitForElement(() => result.getByText(testText));

			expect(result.getByTestId(testId)).not.toBeChecked();
			expect(newPara).toBeInTheDocument();
		});

		it('Updates view when input field is changed (type = "text")', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<input
								type="text"
								name="field"
								onChange={handleChange}
								value={values['field']}
								data-testid={testId}
							/>
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			fireEvent.change(result.getByTestId(testId), {
				target: { value: testText }
			});

			const updatedInput = await waitForElement(() =>
				result.getByDisplayValue(testText)
			);

			expect(updatedInput).toBeInTheDocument();
		});

		it('Updates view when input field is changed (type = "password")', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<input
								type="password"
								name="field"
								onChange={handleChange}
								value={values['field']}
								data-testid={testId}
							/>
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			fireEvent.change(result.getByTestId(testId), {
				target: { value: testText }
			});

			const updatedInput = await waitForElement(() =>
				result.getByDisplayValue(testText)
			);

			expect(updatedInput).toBeInTheDocument();
		});

		it('Updates view when input field is changed (type = "radio")', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<input
								type="radio"
								name="radio"
								value="radio value 1"
								onChange={handleChange}
								checked={values['radio'] === 'radio value 1'}
							/>
							<input
								type="radio"
								name="radio"
								value="radio value 2"
								onChange={handleChange}
								checked={values['radio'] === 'radio value 2'}
								data-testid={testId}
							/>
							{values['radio'] === 'radio value 2' && <p>{testText}</p>}
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			expect(
				result.container.querySelector('[value="radio value 1"]')
			).toBeChecked();

			fireEvent.click(result.getByTestId(testId));

			// wait for testText para
			const testPara = await waitForElement(() => result.getByText(testText));

			expect(testPara).toBeInTheDocument();
			expect(result.getByTestId(testId)).toBeChecked();
		});

		it('Updates view when textarea is changed', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<textarea
								name="textarea"
								onChange={(event: any) => handleChange(event)}
								value={values['textarea']}
								data-testid={testId}
							/>
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			fireEvent.change(result.getByTestId(testId), {
				target: { value: testText }
			});

			const updatedTextarea = await waitForElement(() =>
				result.getByDisplayValue(testText)
			);

			expect(updatedTextarea).toBeInTheDocument();
		});

		it('Updates view when select element is changed', async () => {
			const tree = (
				<Proforma<ValuesType>
					config={{
						initialValues: initialValues
					}}
					handleSubmit={() => {}}
				>
					{({ handleChange, values }: ProformaBundle<ValuesType>) => (
						<form>
							<select
								name="select"
								onChange={(event: any) => handleChange(event)}
								value={values['select']}
								data-testid={testId}
							>
								<option value="option1">Option 1</option>
								<option value={testText}>{testText}</option>
								<option value="option3">Option 3</option>
							</select>
						</form>
					)}
				</Proforma>
			);

			const result = render(tree);

			fireEvent.change(result.getByTestId(testId), {
				target: { value: testText }
			});

			const updatedSelect = await waitForElement(() =>
				result.getByDisplayValue(testText)
			);

			expect(updatedSelect).toBeInTheDocument();
		});
	});
});
