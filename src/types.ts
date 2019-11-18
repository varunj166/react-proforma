import { ChangeEvent, FocusEvent, FormEvent } from 'react';

export type IndexableObjectType<T = any> = {
  [key: string]: T;
};

export type WithIndexableObjectType<T, K = any> = T & IndexableObjectType<K>;

export type TouchedType<V> = {
  [key in keyof V]: boolean;
};

export type ErrorsType<V> = {
  [key in keyof V]: null | string[];
};

export type MemoComparePropsType<T> = Readonly<
  React.PropsWithChildren<T & IndexableObjectType<any>>
>;

// T extends keyof V tells typescript that (value: T) will be one of the properties of object V
type ValidationFunctionType<V> = <T extends keyof V>(
  value: T
) => string[] | null;
type SetValuesType = (setToObj: IndexableObjectType) => void;

export interface IValidationObject<V> {
  [key: string]: (values: V) => string[] | null;
}

interface ICustomOnChangeObject {
  [key: string]: (
    event: ChangeEvent<HTMLInputElement>,
    setValues: SetValuesType
  ) => void;
}

export interface IConfigObject<V> {
  initialValues: V;
  validationObject?: IValidationObject<V>;
  customOnChangeObject?: ICustomOnChangeObject;
  resetTouchedOnFocus?: boolean;
  validateOnChange?: boolean;
}

export type ProformaConfigObject<V> = IConfigObject<V>;

export interface ProformaBundle<V> {
  values: V;
  touched: TouchedType<V>;
  errors: ErrorsType<V>;
  isSubmitting: boolean;
  isComplete: boolean;
  submitCount: number;
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  handleFocus: (
    event: FocusEvent<HTMLInputElement | HTMLButtonElement>
  ) => void;
  handleBlur: (event: FocusEvent<HTMLInputElement | HTMLButtonElement>) => void;
  handleSubmit: (
    event: FormEvent<HTMLFormElement> | React.SyntheticEvent<HTMLElement>
  ) => void;
  handleReset: (event: React.SyntheticEvent<HTMLElement>) => void;
  setValues: SetValuesType;
  setSubmitting: (setTo: boolean) => void;
  setComplete: (setTo: boolean) => void;
}
