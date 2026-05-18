import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { cn } from '@/lib/cn';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Input field type - drives keyboard and secureTextEntry */
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
          <Text className="mb-1.5 text-sm font-semibold text-brand-navy">
            {label}
          </Text>
        )}

        <View
          className={cn(
            'min-h-[56px] flex-row items-center rounded-input border bg-white px-5 py-0',
            hasError ? 'border-red-400' : 'border-brand-pink-200',
          )}
        >
          {prefixIcon && (
            <View className="mr-3 opacity-60">{prefixIcon}</View>
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
            placeholderTextColor="#B0B8CC"
            style={styles.input}
            className={cn('h-[22px] flex-1 text-brand-navy', inputClassName)}
            {...rest}
          />

          {isPassword ? (
            <Pressable
              onPress={() => setShowPassword((p) => !p)}
              accessibilityRole="button"
              accessibilityLabel={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              className="ml-3 min-h-[56px] justify-center px-1"
            >
              <Text className="text-sm text-brand-pink">
                {showPassword ? 'Ẩn' : 'Hiện'}
              </Text>
            </Pressable>
          ) : (
            suffixIcon && <View className="ml-3 opacity-60">{suffixIcon}</View>
          )}
        </View>

        {hasError ? (
          <Text className="mt-1 text-xs text-red-500" accessibilityRole="alert">
            {error}
          </Text>
        ) : helperText ? (
          <Text className="mt-1 text-xs text-brand-navy/50">{helperText}</Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    lineHeight: 22,
    height: 22,
    padding: 0,
    paddingVertical: 0,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});

export default Input;
