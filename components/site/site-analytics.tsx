"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/react";

const OPT_OUT_KEY = "portfolio_analytics_opt_out";

function beforeSend(event: BeforeSendEvent): BeforeSendEvent | null {
  if (typeof window === "undefined") return event;
  try {
    if (window.localStorage.getItem(OPT_OUT_KEY) === "1") return null;
  } catch {
    /* storage unavailable */
  }
  return event;
}

export function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
