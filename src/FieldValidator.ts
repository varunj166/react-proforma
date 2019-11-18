class FieldValidator {
  private errors: string[] = [];

  constructor(private _value: string) {}

  private _push(msg: string) {
    this.errors.push(msg);
  }

  min(length: number, msg?: string) {
    if (!length || isNaN(length))
      throw new Error('".min()" method: Missing or invalid arguments.');
    if (length >= 1) {
      const _msg =
        msg ||
        `This field must be at least ${length} ${
          length <= 1 ? 'character' : 'characters'
        } long.`;
      if (this._value.length < length) this._push(_msg);
    }
    return this;
  }

  max(length: number, msg?: string) {
    if (!length || isNaN(length))
      throw new Error('".max()" method: Missing or invalid arguments.');
    if (length >= 1) {
      const _msg =
        msg ||
        `This field must not be more than ${length} ${
          length <= 1 ? 'character' : 'characters'
        } long.`;
      if (this._value.length > length) this._push(_msg);
    }
    return this;
  }

  required(msg?: string) {
    const _msg = msg || 'This field is required.';
    if (this._value.length === 0) this._push(_msg);
    return this;
  }

  integer(msg?: string) {
    const _msg = msg || 'The value entered must be an integer.';
    const intTest = parseInt(this._value);
    if (isNaN(intTest)) this._push(_msg);
    return this;
  }

  float(msg?: string) {
    const _msg = msg || 'The value entered must be a floating point number.';
    const floatTest = parseFloat(this._value);
    if (isNaN(floatTest)) this._push(_msg);
    return this;
  }

  email(msg?: string, rgx?: RegExp) {
    const _msg = msg || 'Please enter a valid email address.';
    // const emailRegex =
    // 	rgx || /^[A-Z0-9._%+-]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    const emailRegex =
      rgx ||
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(this._value)) this._push(_msg);
    return this;
  }

  regex(rgx: RegExp, msg?: string) {
    if (!rgx || !rgx.test)
      throw new Error('".regex()" method: Missing or invalid arguments.');
    const _msg =
      msg ||
      'The value entered does not match the required regular expression pattern.';
    if (!rgx.test(this._value)) this._push(_msg);
    return this;
  }

  equals(comparedString: string, msg?: string) {
    if (!comparedString || !(typeof comparedString === 'string'))
      throw new Error('".equals()" method: Missing or invalid arguments.');
    const _msg =
      msg || `The value in this field does not equal "${comparedString}".`;
    if (this._value !== comparedString) this._push(_msg);
    return this;
  }

  custom(fn: () => string | undefined) {
    if (!fn || !(typeof fn === 'function'))
      throw new Error('".custom()" method: Missing or invalid arguments.');
    const returnedError = fn();
    if (typeof returnedError === 'string') this._push(returnedError);
    return this;
  }

  end() {
    if (this.errors.length > 0) return this.errors;
    return null;
  }
}

/**
 * @function
 * Exposes the FieldValidator class which allows you to chain validation methods together and
 * produce an array of error messages that are attached to the "errors" object inside the
 * "ProformaBag" of properties and methods. To be used inside the "validationObject" prop
 * passed to the Proforma component. See README for more detailed examples.
 * @example
 * <Proforma
 * 	config={{
 * 		{...}
 * 		validationObject: {
 * 			field_one: (values) => {
 * 				return fieldValidator(values.field_one)
 * 					.required()
 * 					.min(5)
 * 					.max(25)
 * 					.end();
 * 			},
 * 			email: (values) => {
 * 				return fieldValidator(values.email)
 * 					.required()
 * 					.email('Please enter a valid email address!')
 * 					.end();
 * 			}
 * 		}
 * 	}}
 * >
 * 	{...}
 * </Proforma>
 *
 * @param {string} value - the value to be validatated (e.g. values.name, values.email, values.password, etc.)
 * @returns {FieldValidator} FieldValidator class instance
 */
export function fieldValidator(value: string) {
  return new FieldValidator(value);
}
