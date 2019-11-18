import { fieldValidator } from '../FieldValidator';

const goodEmails = [
  'email@email.com',
  'email@email.ca',
  '1_email@e.co',
  '_1email@em.co',
  'email.email@email.com',
  '%+-24email@email.com',
  'email@email.comasdfasdfasdfm'
];

const badEmails = ['email@', 'email@.com', 'email', ' email@email.com'];

const testErrorMessage = 'test error message';

describe('FieldValidator class', () => {
  it('Chains methods', () => {
    expect(
      fieldValidator('test')
        .email()
        .max(5)
        .min(1)
        .end()
    ).toBeTruthy();
  });

  describe('Min length validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('test')
        .min(10)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('test')
        .min(10, testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('test')
        .min(1)
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Max length validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('testtesttesttesttest')
        .max(10)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('testtesttesttesttest')
        .max(10, testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('test')
        .max(10)
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Required validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('')
        .required()
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('')
        .required(testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('test')
        .required()
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Integer validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('test')
        .integer()
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('test')
        .integer(testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('99')
        .integer()
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Float validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('test')
        .float()
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('test')
        .float(testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('99.99')
        .float()
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Email validator', () => {
    it('Correctly evaluates good email addresses', () => {
      let result: string[] | null;
      for (let i = 0; i < goodEmails.length; i++) {
        result = fieldValidator(goodEmails[i])
          .email()
          .end();

        expect(result).toBeNull();
        expect(Array.isArray(result)).toBeFalsy();
      }
    });

    it('Correctly evaluates bad email addresses', () => {
      let result: string[] | null;
      for (let i = 0; i < badEmails.length; i++) {
        result = fieldValidator(badEmails[i])
          .email()
          .end();

        expect(Array.isArray(result)).toBe(true);
        if (Array.isArray(result)) {
          expect(result.length).toBeTruthy();
        }
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator(badEmails[0])
        .email(testErrorMessage)
        .end();

      expect(result).toEqual([testErrorMessage]);
    });
  });

  describe('Regex validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('test')
        .regex(/testtest/)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('test')
        .regex(/testtest/, testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input (RegExp class)', () => {
      const result = fieldValidator('test')
        .regex(new RegExp(/test/), testErrorMessage)
        .end();
      expect(result).toBeNull();
    });

    it('Returns no error message with a valid input (regex literal)', () => {
      const result = fieldValidator('test')
        .regex(/test/, testErrorMessage)
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Equals validator', () => {
    it('Returns a default error message', () => {
      const result = fieldValidator('test')
        .equals('testtest')
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
    });

    it('Returns a custom error message', () => {
      const result = fieldValidator('test')
        .equals('testtest', testErrorMessage)
        .end();
      expect(Array.isArray(result)).toBe(true);
      if (Array.isArray(result)) {
        expect(result.length).toEqual(1);
      }
      expect(result).toEqual([testErrorMessage]);
    });

    it('Returns no error message with a valid input', () => {
      const result = fieldValidator('test')
        .equals('test')
        .end();
      expect(result).toBeNull();
    });
  });

  describe('Custom validator', () => {
    const values = {
      field1: 'hello',
      field2: 'falafel',
      field3: '35'
    };

    it('Performs custom validation and returns error message', () => {
      const result = fieldValidator('test')
        .custom(() => {
          if (values.field1 !== values.field2) {
            return testErrorMessage;
          }
        })
        .end();

      expect(result).toEqual([testErrorMessage]);
    });
  });
});
