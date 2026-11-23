import { useRef } from 'react';

/**
 * Detects a double-tap / double-click in a cross-platform, reliable way.
 *
 * Mobile browsers do NOT reliably fire `dblclick` (a double-tap often triggers
 * zoom instead), and `onTouchEnd` can be inconsistent across devices (iOS
 * Safari in particular). The most reliable approach is to feed `onClick`
 * events into this hook: iOS Safari fires a `click` for every tap and desktop
 * fires a `click` for every click, so two rapid clicks/taps are detected as a
 * double-tap.
 *
 * Returns a handler. Call it with the tapped item; `onDoubleTap` fires when the
 * same item is tapped/clicked twice within `delay` ms.
 *
 * Usage:
 *   const handleTap = useDoubleTap((patient) => openPopup(patient));
 *   <div onClick={() => { select(patient); handleTap(patient); }} />
 */
export function useDoubleTap<T>(onDoubleTap: (item: T) => void, delay = 350) {
  const lastTap = useRef<{ item: T | null; time: number }>({
    item: null,
    time: 0,
  });

  return (item: T) => {
    const now = Date.now();
    if (lastTap.current.item === item && now - lastTap.current.time < delay) {
      // Reset so a third tap starts a new gesture.
      lastTap.current = { item: null, time: 0 };
      onDoubleTap(item);
    } else {
      lastTap.current = { item, time: now };
    }
  };
}