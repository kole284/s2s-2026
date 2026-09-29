import { useCallback, useEffect, useRef, useState } from "react";

import { useMediaQuery } from "@/hooks/useMediaQuery";

import {
  HOVER_MEDIA_QUERY,
  isLeavingTowardPreview,
} from "./partnerPreviewLayout";

// Isto ponašanje kao kartica u traci partnera: otvara se na prelazak mišem
// (ili fokus sa tastature), a kad miš krene ka kartici, čeka da stigne do linka.
const PREVIEW_HIDE_DELAY_MS = 2000;

export const useSponsorPreview = () => {
  const canHover = useMediaQuery(HOVER_MEDIA_QUERY);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const hideTimerRef = useRef<number | null>(null);

  const cancelHide = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const hide = useCallback(() => {
    cancelHide();
    setAnchor(null);
  }, [cancelHide]);

  useEffect(() => cancelHide, [cancelHide]);

  // Kartica je fixed, pa se zatvara na scroll i kad prozor izgubi fokus.
  useEffect(() => {
    if (!anchor) return;

    window.addEventListener("scroll", hide, { passive: true });
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("scroll", hide);
      window.removeEventListener("blur", hide);
    };
  }, [anchor, hide]);

  const open = (element: HTMLElement) => {
    cancelHide();

    if (canHover) {
      setAnchor(element.getBoundingClientRect());
    }
  };

  const leave = (clientY: number) => {
    cancelHide();

    if (!anchor || !isLeavingTowardPreview(anchor, clientY)) {
      hide();
      return;
    }

    hideTimerRef.current = window.setTimeout(hide, PREVIEW_HIDE_DELAY_MS);
  };

  return { anchor, open, leave, hide, cancelHide };
};
