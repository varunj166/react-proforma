import { generateStateObject, validator } from '../helpers';

describe('generateStateObject function', () => {
  it('Returns correct state object (1)', () => {
    const initialValues = {
      field1: 'hello',
      field2: 99,
      field3: true
    };
    const expectedState = {
      values: {
        field1: 'hello',
        field2: '',
        field3: true
      },
      touched: {
        field1: false,
        field2: false,
        field3: false
      },
      errors: {
        field1: null,
        field2: null,
        field3: null
      },
      isSubmitting: false,
      isComplete: false,
      submitCount: 0
    };

    expect(generateStateObject<typeof initialValues>(initialValues)).toEqual(
      expectedState
    );
  });

  it('Returns correct state object(2)', () => {
    const initialValues = {
      field1: '',
      field2: null,
      field3: null
    };
    const expectedState = {
      values: {
        field1: '',
        field2: '',
        field3: ''
      },
      touched: {
        field1: false,
        field2: false,
        field3: false
      },
      errors: {
        field1: null,
        field2: null,
        field3: null
      },
      isSubmitting: false,
      isComplete: false,
      submitCount: 0
    };

    expect(generateStateObject<typeof initialValues>(initialValues)).toEqual(
      expectedState
    );
  });
});

describe('validator function', () => {
  const values = {
    field1: 'hello',
    field2: 'falafel',
    field3: '35'
  };

  const validationObject = {
    field1: (vals: typeof values) => {
      return ['error message field1'];
    },
    field2: (vals: typeof values) => {
      return null;
    },
    field3: (vals: typeof values) => {
      return [
        'error message 1 field3',
        'error message 2 field3',
        'error messag 3 field 3'
      ];
    }
  };

  it('Returns correct errors array for field1', () => {
    expect(
      validator<typeof values>('field1', values, validationObject)
    ).toEqual([...validationObject.field1(values)]);
  });

  it('Returns correct errors array for field2', () => {
    expect(
      validator<typeof values>('field2', values, validationObject)
    ).toBeNull();
  });

  it('Returns correct errors array for field3', () => {
    expect(
      validator<typeof values>('field3', values, validationObject)
    ).toEqual([...validationObject.field3(values)]);
  });
});
