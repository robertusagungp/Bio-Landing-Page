import posthog from 'posthog-js';

// ==========================================
// TYPES & EVENT CONTRACTS
// ==========================================

export type AnalyticsEventName =
  | 'page_view'
  | 'life_score_cta_clicked'
  | 'tool_started'
  | 'tool_question_viewed'
  | 'tool_question_answered'
  | 'tool_question_back'
  | 'tool_completed'
  | 'tool_abandoned'
  | 'risk_education_viewed'
  | 'risk_management_option_clicked'
  | 'financial_protection_viewed'
  | 'protection_gap_opened'
  | 'whatsapp_clicked'
  | 'share_modal_opened'
  | 'share_link_copied'
  | 'share_whatsapp_sent'
  | 'lead_capture_saved'
  | 'catalog_tool_clicked'
  | 'about_viewed';

export interface UtmProperties {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  referrer?: string;
}

export interface StoredLocalEvent {
  id: string;
  eventName: AnalyticsEventName;
  properties: Record<string, any>;
  timestamp: string;
}

// ==========================================
// SENSITIVE KEYS DENYLIST (STRICT PRIVACY)
// ==========================================
const SENSITIVE_KEY_PATTERNS = [
  /salary/i,
  /income_amount/i,
  /expense_amount/i,
  /savings_amount/i,
  /liquid_amount/i,
  /nominal/i,
  /rupiah/i,
  /phone/i,
  /email/i,
  /name/i,
  /medical_condition/i,
  /family_disease/i,
  /answer_value/i,
  /raw_input/i,
];

function sanitizeProperties(props?: Record<string, any>): Record<string, any> {
  if (!props) return {};
  const clean: Record<string, any> = {};

  for (const [key, val] of Object.entries(props)) {
    // Check if key contains sensitive pattern
    const isSensitive = SENSITIVE_KEY_PATTERNS.some((pattern) => pattern.test(key));
    if (isSensitive) {
      continue; // Skip sensitive properties completely
    }

    // Don't log full object/array of user answers
    if (key === 'userProfile' || key === 'answers' || key === 'inputValues') {
      continue;
    }

    clean[key] = val;
  }

  return clean;
}

// ==========================================
// UTM & ATTRIBUTION ENGINE
// ==========================================
const STORAGE_FIRST_UTM = 'agy_first_touch_utm';
const STORAGE_LAST_UTM = 'agy_last_touch_utm';
const STORAGE_LOCAL_EVENTS = 'agy_local_events_log';
const MAX_LOCAL_EVENTS = 200;

export function captureUtmFromUrl(): UtmProperties {
  if (typeof window === 'undefined') return {};

  try {
    const params = new URLSearchParams(window.location.search);
    const utm: UtmProperties = {};

    const source = params.get('utm_source');
    const medium = params.get('utm_medium');
    const campaign = params.get('utm_campaign');
    const content = params.get('utm_content');
    const term = params.get('utm_term');

    if (source) utm.utm_source = source;
    if (medium) utm.utm_medium = medium;
    if (campaign) utm.utm_campaign = campaign;
    if (content) utm.utm_content = content;
    if (term) utm.utm_term = term;
    if (document.referrer) utm.referrer = document.referrer;

    if (Object.keys(utm).length > 0) {
      // First touch (only write once)
      if (!localStorage.getItem(STORAGE_FIRST_UTM)) {
        localStorage.setItem(STORAGE_FIRST_UTM, JSON.stringify(utm));
      }
      // Last touch (update every visit with params)
      localStorage.setItem(STORAGE_LAST_UTM, JSON.stringify(utm));
    }

    return utm;
  } catch (err) {
    console.warn('[Analytics] Failed to capture UTM:', err);
    return {};
  }
}

export function getAttribution(): { firstTouch: UtmProperties; lastTouch: UtmProperties } {
  let firstTouch: UtmProperties = {};
  let lastTouch: UtmProperties = {};

  try {
    const firstStr = localStorage.getItem(STORAGE_FIRST_UTM);
    if (firstStr) firstTouch = JSON.parse(firstStr);

    const lastStr = localStorage.getItem(STORAGE_LAST_UTM);
    if (lastStr) lastTouch = JSON.parse(lastStr);
  } catch {}

  return { firstTouch, lastTouch };
}

// ==========================================
// LOCAL EVENT LOGGER (FOR OWNER DASHBOARD)
// ==========================================
function saveLocalEvent(eventName: AnalyticsEventName, properties: Record<string, any>) {
  if (typeof window === 'undefined') return;

  try {
    const currentLogsStr = localStorage.getItem(STORAGE_LOCAL_EVENTS);
    const logs: StoredLocalEvent[] = currentLogsStr ? JSON.parse(currentLogsStr) : [];

    const newEntry: StoredLocalEvent = {
      id: Math.random().toString(36).substring(2, 9),
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };

    logs.unshift(newEntry);

    // Keep only last MAX_LOCAL_EVENTS
    if (logs.length > MAX_LOCAL_EVENTS) {
      logs.length = MAX_LOCAL_EVENTS;
    }

    localStorage.setItem(STORAGE_LOCAL_EVENTS, JSON.stringify(logs));
  } catch (err) {
    // Non-critical
  }
}

export function getLocalAnalyticsEvents(): StoredLocalEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_LOCAL_EVENTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearLocalAnalyticsEvents(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_LOCAL_EVENTS);
}

// ==========================================
// MAIN ANALYTICS CLIENT
// ==========================================
class AnalyticsClient {
  private isPosthogInitialized = false;
  private isDebug = false;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Capture UTM on boot
    captureUtmFromUrl();

    // Check debug flag from Vite env or localStorage
    const debugEnv = import.meta.env.VITE_ANALYTICS_DEBUG;
    this.isDebug = debugEnv === 'true' || localStorage.getItem('agy_analytics_debug') === 'true';

    // Check PostHog keys
    const apiKey = import.meta.env.VITE_POSTHOG_KEY;
    const apiHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.i.posthog.com';

    if (apiKey && apiKey !== 'YOUR_POSTHOG_KEY') {
      try {
        posthog.init(apiKey, {
          api_host: apiHost,
          capture_pageview: false, // We track SPA pageviews explicitly
          capture_pageleave: true,
          autocapture: false, // No uncontrolled DOM clicks
          disable_session_recording: false,
          persistence: 'localStorage+cookie',
        });
        this.isPosthogInitialized = true;
        if (this.isDebug) {
          console.info('[Analytics] PostHog initialized successfully');
        }
      } catch (err) {
        console.warn('[Analytics] PostHog initialization failed:', err);
      }
    } else if (this.isDebug) {
      console.info('[Analytics] Running in local/dev mode (no PostHog key set). Events stored locally.');
    }
  }

  public track(eventName: AnalyticsEventName, properties?: Record<string, any>) {
    const safeProps = sanitizeProperties(properties);
    const { firstTouch, lastTouch } = getAttribution();

    const mergedProps = {
      ...safeProps,
      first_touch_source: firstTouch.utm_source || 'direct',
      first_touch_medium: firstTouch.utm_medium,
      first_touch_campaign: firstTouch.utm_campaign,
      last_touch_source: lastTouch.utm_source || 'direct',
      last_touch_medium: lastTouch.utm_medium,
      last_touch_campaign: lastTouch.utm_campaign,
      client_time: new Date().toISOString(),
      screen_width: typeof window !== 'undefined' ? window.innerWidth : undefined,
    };

    // 1. Console log in debug mode
    if (this.isDebug) {
      console.log(`📊 [Analytics] %c${eventName}`, 'color: #0d9488; font-weight: bold;', mergedProps);
    }

    // 2. Local buffer for Owner Dashboard
    saveLocalEvent(eventName, mergedProps);

    // 3. PostHog dispatch if configured
    if (this.isPosthogInitialized) {
      try {
        posthog.capture(eventName, mergedProps);
      } catch (err) {
        console.warn('[Analytics] PostHog capture error:', err);
      }
    }
  }

  public page(pageName: string, properties?: Record<string, any>) {
    this.track('page_view', {
      page: pageName,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...properties,
    });
  }

  public enableDebug(enabled: boolean = true) {
    this.isDebug = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('agy_analytics_debug', enabled ? 'true' : 'false');
    }
    console.info(`[Analytics] Debug mode set to: ${enabled}`);
  }
}

export const analytics = new AnalyticsClient();
