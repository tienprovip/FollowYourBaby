import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { cn } from '@/lib/cn';

interface AuthScreenProps {
  children: React.ReactNode;
  contentClassName?: string;
}

export function AuthScreen({ children, contentClassName }: AuthScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF9F7]">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <DecorativeBackground />
        <ScrollView
          className="flex-1"
          contentContainerClassName={cn('px-6 pt-6 pb-8', contentClassName)}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function DecorativeBackground() {
  return (
    <View pointerEvents="none" className="absolute inset-0 overflow-hidden">
      <View className="absolute -top-12 -left-10 h-44 w-44 rounded-full bg-brand-pink-50" />
      <View className="absolute top-16 -right-14 h-36 w-36 rounded-full bg-brand-lavender-50" />
      <View className="absolute bottom-20 -left-16 h-40 w-40 rounded-full bg-brand-peach" />
      <Text className="absolute left-9 top-24 text-brand-pink-200 text-2xl">♥</Text>
      <Text className="absolute right-12 top-36 text-brand-lavender-200 text-xl">♥</Text>
      <Text className="absolute right-9 bottom-44 text-brand-pink-100 text-3xl">♥</Text>
    </View>
  );
}

interface BackButtonProps {
  label?: string;
  onPress: () => void;
}

export function BackButton({ label = 'Quay lại', onPress }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={12}
      className="mb-5 h-9 w-9 items-center justify-center"
    >
      <Ionicons name="chevron-back" size={28} color="#1F2B5B" />
    </Pressable>
  );
}

interface AuthHeaderProps {
  title: string;
  subtitle: React.ReactNode;
  align?: 'left' | 'center';
}

export function AuthHeader({ title, subtitle, align = 'center' }: AuthHeaderProps) {
  const isCenter = align === 'center';

  return (
    <View className={cn('mb-7', isCenter ? 'items-center' : 'items-start')}>
      <Text
        className={cn(
          'text-brand-navy text-3xl font-bold leading-10',
          isCenter ? 'text-center' : 'text-left',
        )}
      >
        {title}
      </Text>
      <Text
        className={cn(
          'mt-2 text-base leading-6 text-brand-navy/70',
          isCenter ? 'text-center' : 'text-left',
        )}
      >
        {subtitle}
      </Text>
    </View>
  );
}

interface AuthTabsProps {
  onPhonePress: () => void;
}

export function AuthTabs({ onPhonePress }: AuthTabsProps) {
  return (
    <View className="mb-5 flex-row border-b border-brand-pink-100">
      <View className="flex-1 items-center border-b-2 border-brand-pink-500 pb-3">
        <Text className="text-sm font-semibold text-brand-pink-500">Email</Text>
      </View>
      <Pressable
        onPress={onPhonePress}
        accessibilityRole="button"
        accessibilityLabel="Đăng ký bằng số điện thoại"
        className="flex-1 items-center pb-3"
      >
        <Text className="text-sm font-semibold text-brand-navy/60">
          Số điện thoại
        </Text>
      </Pressable>
    </View>
  );
}

export function MailIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 6h16v12H4V6Z"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="m4 7 8 6 8-6"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function LockIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M7 10V8a5 5 0 0 1 10 0v2"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
      <Path
        d="M6 10h12v10H6V10Z"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="M12 14v2"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

export function UserIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      <Path
        d="M5 20a7 7 0 0 1 14 0"
        stroke="#7A8499"
        strokeWidth={2.2}
        strokeLinecap="round"
      />
    </Svg>
  );
}

function GoogleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z" />
      <Path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z" />
      <Path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z" />
      <Path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z" />
    </Svg>
  );
}

function AppleLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill="#000000"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      />
    </Svg>
  );
}

function FacebookLogo() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24">
      <Path
        fill="#1877F2"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </Svg>
  );
}

const SOCIAL_LOGOS: Record<string, React.ReactNode> = {
  google:   <GoogleLogo />,
  apple:    <AppleLogo />,
  facebook: <FacebookLogo />,
};

interface SocialButtonProps {
  label: string;
  provider: 'google' | 'apple' | 'facebook';
  onPress: () => void;
}

export function SocialButton({ label, provider, onPress }: SocialButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Tiếp tục với ${label}`}
      className="min-h-[46px] w-full flex-row items-center justify-center rounded-input border border-brand-pink-100 bg-white px-3 active:bg-brand-pink-50"
    >
      <View className="mr-2">{SOCIAL_LOGOS[provider]}</View>
      <Text className="text-sm font-semibold text-brand-navy">{label}</Text>
    </Pressable>
  );
}

interface DividerProps {
  label: string;
}

export function Divider({ label }: DividerProps) {
  return (
    <View className="my-6 flex-row items-center">
      <View className="h-px flex-1 bg-brand-pink-100" />
      <Text className="mx-3 text-sm text-brand-navy/45">{label}</Text>
      <View className="h-px flex-1 bg-brand-pink-100" />
    </View>
  );
}

interface SuccessPanelProps {
  title: string;
  message: string;
}

export function SuccessPanel({ title, message }: SuccessPanelProps) {
  return (
    <View className="mt-8 items-center rounded-card border border-brand-mint/50 bg-white px-5 py-6">
      <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-brand-mint/40">
        <Text className="text-3xl text-green-600">✓</Text>
      </View>
      <Text className="mb-2 text-center text-base font-bold text-brand-navy">
        {title}
      </Text>
      <Text className="text-center text-sm leading-5 text-brand-navy/70">
        {message}
      </Text>
    </View>
  );
}

interface IllustrationProps {
  variant: 'mother' | 'envelope' | 'lock';
}

export function AuthIllustration({ variant }: IllustrationProps) {
  if (variant === 'envelope') {
    return <EnvelopeIllustration />;
  }

  if (variant === 'lock') {
    return <LockIllustration />;
  }

  return <MotherIllustration />;
}

function MotherIllustration() {
  return (
    <View className="mb-7 items-center">
      <Svg width={236} height={218} viewBox="0 0 236 218">
        <Circle cx="118" cy="112" r="94" fill="#FFF0F3" />
        <Circle cx="55" cy="61" r="10" fill="#FFD9E3" />
        <Circle cx="183" cy="72" r="8" fill="#FFD9E3" />
        <Path
          d="M46 172c26-20 114-25 151 0 8 6 6 20-5 23H52c-12-3-15-16-6-23Z"
          fill="#FFFDF7"
        />
        <Path
          d="M82 86c1-31 22-52 50-48 27 4 43 28 37 58-5 26-28 43-55 39-22-3-33-22-32-49Z"
          fill="#875548"
        />
        <Circle cx="126" cy="83" r="35" fill="#FFD7C4" />
        <Path
          d="M93 86c6-26 26-43 55-45 14 11 19 27 16 44-25-6-47-14-71 1Z"
          fill="#7A463B"
        />
        <Path
          d="M88 178c6-45 18-69 48-69s45 25 50 69H88Z"
          fill="#FF8FA8"
        />
        <Ellipse cx="136" cy="164" rx="34" ry="38" fill="#FFAFC1" />
        <Circle cx="162" cy="134" r="25" fill="#BFDFFF" />
        <Circle cx="164" cy="126" r="15" fill="#FFD7C4" />
        <Path
          d="M153 123c5-11 21-12 28-2-6-2-16 1-28 2Z"
          fill="#7A463B"
        />
        <Path
          d="M116 103c4 9 17 9 22 0"
          stroke="#875548"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M91 142c20 9 48 13 75 3"
          stroke="#E85A78"
          strokeWidth="12"
          strokeLinecap="round"
          fill="none"
        />
        <Path
          d="M45 123c9-12 18-1 9 8-5 5-9 8-9 8s-4-3-9-8c-9-9 0-20 9-8Z"
          fill="#FF9FBA"
        />
        <Path
          d="M197 117c8-10 16-1 8 7-4 4-8 7-8 7s-4-3-8-7c-8-8 0-17 8-7Z"
          fill="#FFBDCE"
        />
      </Svg>
    </View>
  );
}

function EnvelopeIllustration() {
  return (
    <View className="mb-7 items-center">
      <Svg width={220} height={176} viewBox="0 0 220 176">
        <Circle cx="110" cy="91" r="72" fill="#FFF0F3" />
        <Path
          d="M66 96h88c6 0 11 5 11 11v46H55v-46c0-6 5-11 11-11Z"
          fill="#FF8FA8"
        />
        <Path d="M55 108 110 145l55-37v47H55v-47Z" fill="#FF6B8A" />
        <Path d="M55 154 100 123c6-4 14-4 20 0l45 31H55Z" fill="#FFBDCE" />
        <Rect x="78" y="55" width="64" height="72" rx="8" fill="#FFFFFF" />
        <Path
          d="M91 82h38M91 101h38"
          stroke="#B79CFF"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Path
          d="M75 75c8-10 16-1 8 7-4 4-8 7-8 7s-4-3-8-7c-8-8 0-17 8-7ZM166 65c7-9 14-1 7 6-4 4-7 6-7 6s-3-2-7-6c-7-7 0-15 7-6Z"
          fill="#FF9FBA"
        />
        <Circle cx="157" cy="132" r="18" fill="#B79CFF" />
        <Path
          d="m148 132 7 7 13-16"
          stroke="#FFFFFF"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

function LockIllustration() {
  return (
    <View className="mb-7 items-center">
      <Svg width={220} height={176} viewBox="0 0 220 176">
        <Ellipse cx="110" cy="142" rx="80" ry="17" fill="#FFE8ED" />
        <Path
          d="M73 108c0-24 17-42 37-42s37 18 37 42"
          stroke="#D882C5"
          strokeWidth="13"
          strokeLinecap="round"
          fill="none"
        />
        <Rect x="66" y="98" width="88" height="62" rx="18" fill="#FF8FA8" />
        <Rect x="84" y="113" width="52" height="30" rx="13" fill="#B79CFF" />
        <Path
          d="M110 124v12"
          stroke="#FFFFFF"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <Circle cx="110" cy="122" r="7" fill="#FFFFFF" />
        <Path
          d="M53 96c8-10 16-1 8 7-4 4-8 7-8 7s-4-3-8-7c-8-8 0-17 8-7ZM166 92c7-9 14-1 7 6-4 4-7 6-7 6s-3-2-7-6c-7-7 0-15 7-6Z"
          fill="#FFD9E3"
        />
        <G opacity="0.65">
          <Circle cx="72" cy="64" r="7" fill="#AEE6C8" />
          <Circle cx="154" cy="61" r="6" fill="#B79CFF" />
        </G>
      </Svg>
    </View>
  );
}
