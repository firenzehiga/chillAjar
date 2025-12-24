/**
 * useLockBodyScroll
 * Disable page (body) scrolling while a modal or overlay is open.
 * Implements a simple reference-counting mechanism on document.body.dataset
 * so multiple modals can request the lock without clobbering each other.
 *
 * Usage:
 *   import useLockBodyScroll from '@/hooks/utils/useLockBodyScroll';
 *   function MyModal({ open }) {
 *     useLockBodyScroll(open);
 *     return open ? <div>modal</div> : null;
 *   }
 */
import { useEffect } from "react";

function getScrollbarWidth() {
  return window.innerWidth - document.documentElement.clientWidth;
}

export default function useLockBodyScroll(active = true) {
  useEffect(() => {
    if (!active || typeof document === "undefined") return;

    const body = document.body;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight || "";

    // reference count stored on data attribute
    const current = Number(body.dataset.lockScrollCount || 0) + 1;
    body.dataset.lockScrollCount = String(current);

    if (current === 1) {
      const scrollBarWidth = getScrollbarWidth();
      body.style.overflow = "hidden";
      if (scrollBarWidth > 0) body.style.paddingRight = `${scrollBarWidth}px`;
    }

    return () => {
      const next = Math.max(0, Number(body.dataset.lockScrollCount || 1) - 1);
      body.dataset.lockScrollCount = String(next);
      if (next === 0) {
        body.style.overflow = prevOverflow || "";
        body.style.paddingRight = prevPaddingRight || "";
        delete body.dataset.lockScrollCount;
      }
    };
  }, [active]);
}
