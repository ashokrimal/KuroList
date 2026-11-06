/**
 * KuroList Haptics Utility
 * Provides subtle tactile vibration feedback for mobile Android / PWA interactions
 * Uses the Web Vibration API with graceful fallback when unsupported.
 */

export type HapticType = 'tab' | 'light' | 'selection' | 'medium' | 'double' | 'success' | 'warning';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  // Ultra-crisp 10ms click, ideal for Android Material bottom nav tab switches
  tab: 10,
  // Subtle 8ms tap for quick stepper or counter interactions
  light: 8,
  // 12ms tick for list/filter selections
  selection: 12,
  // 22ms vibration for drawer opens / modal confirmations
  medium: 22,
  // Quick double tap [8ms buzz, 35ms pause, 8ms buzz] when tapping already-active tab or refreshing
  double: [8, 35, 8],
  // Success pattern
  success: [10, 40, 14],
  // Warning pattern
  warning: [15, 50, 15]
};

let lastHapticTime = 0;

/**
 * Triggers subtle vibration feedback if the device and browser support it.
 * Debounced by 40ms to prevent stuttering on rapid multi-touch.
 */
export function triggerHaptic(type: HapticType = 'tab'): boolean {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Prevent double triggers within 40ms
  const now = Date.now();
  if (now - lastHapticTime < 40) {
    return false;
  }
  lastHapticTime = now;

  try {
    if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
      const pattern = HAPTIC_PATTERNS[type] ?? 10;
      return navigator.vibrate(pattern);
    }
  } catch {
    // Silently handle any browser security restrictions or iframe sandbox rules
  }

  return false;
}
