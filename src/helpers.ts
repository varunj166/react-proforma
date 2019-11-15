import { IndexableObjectType, IValidationObject } from './types';

export function generateStateObject<V>(initState: V & IndexableObjectType) {
  const keys = Object.keys(initState);
  const stateObj = keys.reduce<any>(
    (result, key) => {
      result.values[key] =
        initState[key] === false ? false : initState[key] || '';
      result.touched[key] = false;
      result.errors[key] = null;
      return result;
    },
    {
      values: {},
      touched: {},
      errors: {},
      isSubmitting: false,
      isComplete: false,
      submitCount: 0
    }
  );
  return stateObj;
}

export function validator<V>(
  name: string,
  values: V,
  validationObject: IValidationObject<V>
): string[] | null {
  const errors = validationObject[name](values);
  if (Array.isArray(errors)) {
    for (let error of errors) {
      if (typeof error !== 'string') {
        throw new Error(
          `The validation object for field with name ${name} returned an array that contains a non-string value. The returned array of errors must contain only strings.`
        );
      }
    }
  }
  return errors;
}
