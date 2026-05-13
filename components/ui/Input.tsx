import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input field type — drives keyboard and secureTextEntry */
  type?: 'text' | 'email' | 'numeric' | 'password';
  /** Label displayed above the input */
  label?: string;
  /** Error message shown below the input */
  error?: string;
  /** Helper text shown below the input (hidden when error is present) */
  helperText?: string;
  /** Element rendered inside the left edge of the input */
  prefixIcon?: React.ReactNode;
  /** Element rendered inside the right edge of the input */
  suffixIcon?: React.ReactNode;
  /** NativeWind className for the outer wrapper */
  className?: string;
  /** NativeWind className for the TextInput itself */
  inputClassName?: string;
}

const keyboardTypeMap: Record<
  NonNullable<InputProps['type']>,
  TextInputProps['keyboardType']
> = {
  text: 'default',
  email: 'email-address',
  numeric: 'numeric',
  password: 'default',
};

const Input = forwardRef<TextInput, InputProps>(
  (
    {
      type = 'text',
      label,
      error,
      helperText,
      prefixIcon,
      suffixIcon,
      className,
      inputClassName,
      accessibilityLabel,
      placeholder,
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const hasError = Boolean(error);

    return (
      <View className={cn('w-full', className)}>
        {label && (
          <Text className="text-slate-700 text-sm font-semibold mb-1">
            {label}
          </Text>
        )}

        <View
          className={cn(
            'flex-row items-center bg-white border rounded-xl px-3 min-h-[44px]',
            hasError ? 'border-red-500' : 'border-rose-200',
          )}
        >
          {prefixIcon && (
            <View className="mr-2 opacity-60">{prefixIcon}</View>
          )}

          <TextInput
            ref={ref}
            accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
            accessibilityHint={error ?? helperText}
            keyboardType={keyboardTypeMap[type]}
            secureTextEntry={isPassword && !showPassword}
            autoCapitalize={type === 'email' ? 'none' : 'sentences'}
            autoCorrect={type !== 'email' && type !== 'password'}
            placeholder={placeholder}
            placeholderTextColor="#94a3b8"
            className={cn(
              'flex-1 text-base text-slate-900 py-2',
              inputClassName,
            )}
            {...rest}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setShowPassword((p) => !p)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="ml-2 p-1"
            >
              <Text className="text-rose-400 text-sm">
                {showPassword ? 'Ẩn' : 'Hiện'}
              </Text>
            </Pressable>
          ) : (
            suffixIcon && <View className="ml-2 opacity-60">{suffixIcon}</View>
          )}
        </View>

        {hasError ? (
          <Text className="text-red-500 text-xs mt-1" accessibilityRole="alert">
            {error}
          </Text>
        ) : helperText ? (
          <Text className="text-slate-400 text-xs mt-1">{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

export default Input;
