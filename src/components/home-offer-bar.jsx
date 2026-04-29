"use client";

import { useEffect, useState } from "react";

const EXIT_DURATION_MS = 350;
const SHOW_DELAY_MS = 1500;
const VISIBLE_DURATION_MS = 10000;

export default function HomeOfferBar() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = window.setTimeout(() => {
      setIsMounted(true);
      window.requestAnimationFrame(() => {
        setIsVisible(true);
      });
    }, SHOW_DELAY_MS);

    return () => {
      window.clearTimeout(showTimer);
    };
  }, []);

  useEffect(() => {
    if (!isMounted || !isVisible) {
      return undefined;
    }

    const hideTimer = window.setTimeout(() => {
      setIsVisible(false);
    }, VISIBLE_DURATION_MS);

    return () => {
      window.clearTimeout(hideTimer);
    };
  }, [isMounted, isVisible]);

  useEffect(() => {
    if (!isMounted || isVisible) {
      return undefined;
    }

    const unmountTimer = window.setTimeout(() => {
      setIsMounted(false);
    }, EXIT_DURATION_MS);

    return () => {
      window.clearTimeout(unmountTimer);
    };
  }, [isMounted, isVisible]);

  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`offer-float-shell ${isVisible ? "offer-float-shell-open" : "offer-float-shell-closed"}`}
      role="status"
      aria-live="polite"
    >
      <div className="offer-float">
        <div className="offer-float-content">
          <p className="offer-float-kicker">Special bundle deal</p>
          <p className="offer-float-copy">
            Bring home restaurant flavour tonight with bundle pricing:
            {" "}6 sauces for {"\u00A3"}28.20 or 12 sauces for {"\u00A3"}47.50.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-xs btn-ghost"
          onClick={() => setIsVisible(false)}
          aria-label="Close offer message"
        >
          x
        </button>
      </div>
    </div>
  );
}
