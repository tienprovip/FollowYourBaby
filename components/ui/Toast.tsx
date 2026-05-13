import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';
import { Animated, Easing, Text, View } from 'react-native';
import { cn } from '@/lib/cn';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ToastVariant = 'success' | 'info' | 'warning' | 'error';

export interface ToastMessage {
  id: string;
  variant: ToastVariant;
  message: string;
  /** Auto-dismiss duration in ms. Default 3000 */
  duration?: number;
}

interface ToastContextValue {
  show: (
    message: string,
    variant?: ToastVariant,
    duration?: number,
  ) => void;
}

// ---------------------------------------------------------------------------
// Internal styling maps
// ---------------------------------------------------------------------------

const containerVariants: Record<ToastVariant, string> = {
  success: 'bg-mint-500',
  info: 'bg-soft-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

const icons: Record<ToastVariant, string> = {
  success: '✓',
  info: 'ℹ',
  warning: '!',
  error: '✕',
};

// ---------------------------------------------------------------------------
// Single toast item
// ---------------------------------------------------------------------------

interface ToastItemProps {
  item: ToastMessage;
  onHide: (id: string) => void;
}

function ToastItem({ item, onHide }: ToastItemProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => onHide(item.id));
    }, item.duration ?? 3000);

    return () => clearTimeout(timer);
  }, [item.id, item.duration, opacity, translateY, onHide]);

  return (
    <Animated.View
      style={{ opacity, transform: [{ translateY }] }}
      className={cn(
        'flex-row items-center rounded-xl px-4 py-3 mb-2 shadow-md',
        containerVariants[item.variant],
      )}
      accessibilityRole="alert"
      accessibilityLabel={item.message}
    >
      <Text className="text-white font-bold mr-2">{icons[item.variant]}</Text>
      <Text className="text-white text-sm flex-1">{item.message}</Text>
    </Animated.View>
  );
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
}

/**
 * Wrap your root layout with ToastProvider then call `useToast()` anywhere.
 */
function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counter = useRef(0);

  const show = useCallback(
    (message: string, variant: ToastVariant = 'info', duration = 3000) => {
      counter.current += 1;
      const id = `toast-${counter.current}`;
      setToasts((prev) => [...prev, { id, variant, message, duration }]);
    },
    [],
  );

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* Toast container — top of screen */}
      <View
        className="absolute top-12 left-4 right-4 z-50"
        pointerEvents="none"
        accessibilityRole="none"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} item={t} onHide={hide} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

/** Returns the `show` function for imperatively displaying toasts. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

export { ToastProvider };
export default ToastProvider;
