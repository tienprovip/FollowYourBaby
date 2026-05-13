import React from 'react';
import {
  Control,
  Controller,
  FieldPath,
  FieldValues,
  RegisterOptions,
} from 'react-hook-form';
import Input, { InputProps } from './Input';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  /** react-hook-form control object */
  control: Control<TFieldValues>;
  /** Field name registered in the form */
  name: TName;
  /** Validation rules passed to react-hook-form */
  rules?: RegisterOptions<TFieldValues, TName>;
}

/**
 * Thin wrapper around Input that integrates with react-hook-form Controller.
 * Propagates validation errors automatically.
 */
function FormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  rules,
  ...inputProps
}: FormFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <Input
          {...inputProps}
          value={value as string}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
        />
      )}
    />
  );
}

export default FormField;
