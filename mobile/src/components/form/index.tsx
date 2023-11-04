import {Formik, FormikHelpers} from 'formik';
import React, {ReactNode} from 'react';

interface Props<T> {
  initialValues: any;
  validationSchema: any;
  onSubmit(value: T, formikHelpers: FormikHelpers<T>): void;
  children: ReactNode;
}

const Form = <T extends object>(props: Props<T>) => {
  const {initialValues, validationSchema, onSubmit, children} = props;
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}>
      {children}
    </Formik>
  );
};

export default Form;
