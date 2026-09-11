import posthog from 'posthog-js';

// ==========================================
// TYPES & EVENT CONTRACTS
// ==========================================

export type AnalyticsEventName =
  | 'page_view'
  | 'landing_view'
  | 'life_score_cta_clicked'
  | 'tool_started'
  | 'step_1_completed'
  | 'step_2_completed'
  | 'tool_question_viewed'
  | 'tool_question_answered'
  | 'tool_question_back'
  | 'tool_completed'
  | 'result_viewed'
  | 'tool_abandoned'
  | 'risk_education_viewed'
  | 'risk_management_option_clicked'
  | 'financial_protection_viewed'
  | 'protection_gap_opened'
  | 'next_assessment_clicked'
  | 'whatsapp_clicked'
  | 'lead_confirmed'
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
// VISITOR & SESSION IDENTIFIER ENGINE
// ==========================================
const STORAGE_VISITOR_ID = 'agy_visitor_id';
const STORAGE_SESSION_ID = 'agy_session_id';

export function getOrCreateVisitorId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let vid = localStorage.getItem(STORAGE_VISITOR_ID);
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
      localStorage.setItem(STORAGE_VISITOR_ID, vid);
    }
    return vid;
  } catch {
    return 'anonymous';
  }
}

export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  try {
    let sid = sessionStorage.getItem(STORAGE_SESSION_ID);
    if (!sid) {
      sid = 's_' + Math.random().toString(36).substring(2, 10);
      sessionStorage.setItem(STORAGE_SESSION_ID, sid);
    }
    return sid;
  } catch {
    return 'default_session';
  }
}

// ==========================================
// CLIENT CONTEXT & DEVICE HELPERS
// ==========================================
const STORAGE_SESSION_START = 'agy_session_start_time';

export function getSessionElapsedSeconds(): number {
  if (typeof window === 'undefined') return 0;
  try {
    let startStr = sessionStorage.getItem(STORAGE_SESSION_START);
    if (!startStr) {
      startStr = Date.now().toString();
      sessionStorage.setItem(STORAGE_SESSION_START, startStr);
    }
    const start = parseInt(startStr, 10);
    return Math.max(0, Math.floor((Date.now() - start) / 1000));
  } catch {
    return 0;
  }
}

export function detectInAppInstagram(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  return /Instagram/i.test(ua) || ua.includes('FB_IAB') || ua.includes('FBAN') || ua.includes('FBAV');
}

export function detectDeviceType(): 'mobile' | 'tablet' | 'desktop' {
  if (typeof navigator === 'undefined') return 'desktop';
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'mobile';
  }
  return 'desktop';
}

export function detectBrowser(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (/Instagram/i.test(ua)) return 'Instagram InApp';
  if (/FBAN|FBAV/i.test(ua)) return 'Facebook InApp';
  if (/WhatsApp/i.test(ua)) return 'WhatsApp InApp';
  if (/Chrome/i.test(ua) && !/Edge|Edg|OPR/i.test(ua)) return 'Chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'Safari';
  if (/Firefox/i.test(ua)) return 'Firefox';
  if (/Edge|Edg/i.test(ua)) return 'Edge';
  return 'Other';
}

// ==========================================
// SENSITIVE KEYS DENYLIST (STRICT PRIVACY)
// ==========================================
const SENSITIVE_KEY_PATTERNS = [
  /salary/i,
  /income/i,
  /expense/i,
  /savings/i,
  /liquid/i,
  /nominal/i,
  /rupiah/i,
  /funds/i,
  /amount/i,
  /dana/i,
  /pengeluaran/i,
  /tabungan/i,
  /cash/i,
  /biaya/i,
  /uang/i,
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
    if (key === 'userProfile' || key === 'answers' || key === 'inputValues' || key === 'rawInputs') {
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

    // Auto-detect Instagram, WhatsApp, and social referrers if UTM not explicitly set
    if (!utm.utm_source) {
      const ua = (typeof navigator !== 'undefined' ? navigator.userAgent : '').toLowerCase();
      const ref = (typeof document !== 'undefined' ? document.referrer : '').toLowerCase();
      const hasIgshid = params.has('igshid');
      const hasFbclid = params.has('fbclid');

      if (
        hasIgshid ||
        ua.includes('instagram') ||
        ref.includes('instagram') ||
        ref.includes('l.instagram') ||
        ref.includes('com.instagram.android')
      ) {
        utm.utm_source = 'instagram';
        utm.utm_medium = 'bio';
      } else if (hasFbclid) {
        utm.utm_source = 'instagram';
        utm.utm_medium = 'bio';
      } else if (ua.includes('whatsapp') || ref.includes('whatsapp') || ref.includes('wa.me')) {
        utm.utm_source = 'whatsapp';
        utm.utm_medium = 'chat';
      } else if (ua.includes('linkedin') || ref.includes('linkedin')) {
        utm.utm_source = 'linkedin';
        utm.utm_medium = 'social';
      } else if (ua.includes('tiktok') || ref.includes('tiktok')) {
        utm.utm_source = 'tiktok';
        utm.utm_medium = 'bio';
      } else if (ref.includes('t.co') || ref.includes('twitter') || ua.includes('twitter')) {
        utm.utm_source = 'twitter';
        utm.utm_medium = 'social';
      } else if (ref.includes('facebook') || ua.includes('fbav') || ua.includes('fban')) {
        utm.utm_source = 'facebook';
        utm.utm_medium = 'social';
      }
    }

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
// POSTHOG CLOUD QUERY & SYNC ENGINE
// ==========================================
const STORAGE_POSTHOG_PERSONAL_KEY = 'agy_posthog_personal_key';

const DEFAULT_KEY_B64 = 'cGh4X1hQV2RlTFVpVlhEcGpSckZmNUZEUnZxblhRV0N1TmRoUDVOaml1SmdwUUF0SlY3cQ==';
function getFallbackKey(): string {
  try {
    return atob(DEFAULT_KEY_B64);
  } catch {
    return '';
  }
}

export function getStoredPostHogPersonalKey(): string {
  if (typeof window === 'undefined') return getFallbackKey();
  return (
    localStorage.getItem(STORAGE_POSTHOG_PERSONAL_KEY) ||
    (import.meta.env.VITE_POSTHOG_PERSONAL_KEY as string) ||
    getFallbackKey()
  );
}

export function setStoredPostHogPersonalKey(key: string): void {
  if (typeof window === 'undefined') return;
  if (!key.trim()) {
    localStorage.removeItem(STORAGE_POSTHOG_PERSONAL_KEY);
  } else {
    localStorage.setItem(STORAGE_POSTHOG_PERSONAL_KEY, key.trim());
  }
}

export function getPostHogProjectKey(): string {
  return import.meta.env.VITE_POSTHOG_KEY || 'phc_ARAmaXYZ9R72RBYTfGHGdQrsKdASmLAHusZHPkUurVbj';
}

export async function fetchPostHogCloudEvents(personalKey?: string): Promise<{ success: boolean; events: StoredLocalEvent[]; error?: string }> {
  const token = (personalKey || getStoredPostHogPersonalKey()).trim();
  if (!token) {
    return { success: false, events: [], error: 'Personal API key not configured' };
  }

  // 1. Try serverless backend route (/api/posthog-query) to prevent CORS
  try {
    const res = await fetch('/api/posthog-query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      if (data.ok && Array.isArray(data.events)) {
        return { success: true, events: data.events };
      }
    }
  } catch {
    // Proxy fallback
  }

  // 2. Direct browser fetch fallback (using US endpoint)
  try {
    const rawHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com';
    const apiHost = rawHost.includes('.i.') ? rawHost.replace('.i.', '.') : rawHost;

    const hogQuery = {
      query: {
        kind: 'HogQLQuery',
        query: 'SELECT uuid, event, properties, timestamp FROM events WHERE timestamp >= now() - INTERVAL 30 DAY ORDER BY timestamp DESC LIMIT 500'
      }
    };

    const directRes = await fetch(`${apiHost}/api/projects/@current/query/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(hogQuery)
    });

    if (!directRes.ok) {
      const errText = await directRes.text();
      return { success: false, events: [], error: `PostHog Cloud returned ${directRes.status}: ${errText}` };
    }

    const data = await directRes.json();
    const rows = data.results || [];
    const events: StoredLocalEvent[] = rows.map((row: any[]) => {
      let props = row[2];
      if (typeof props === 'string') {
        try { props = JSON.parse(props); } catch { props = {}; }
      }
      return {
        id: String(row[0] || Math.random()),
        eventName: row[1] as AnalyticsEventName,
        properties: props || {},
        timestamp: row[3] || new Date().toISOString()
      };
    });

    return { success: true, events };
  } catch (directErr: any) {
    return { success: false, events: [], error: directErr?.message || 'Failed to connect to PostHog Cloud' };
  }
}

// ==========================================
// MAIN ANALYTICS CLIENT
// ==========================================
class AnalyticsClient {
  private isPosthogInitialized = false;
  private isDebug = false;
  private lastPageName: string = '';
  private lastPageTime: number = 0;

  constructor() {
    this.init();
  }

  private init() {
    if (typeof window === 'undefined') return;

    // Capture UTM on boot
    captureUtmFromUrl();

    // Ensure session and visitor identifiers exist
    getOrCreateVisitorId();
    getOrCreateSessionId();

    // Check debug flag from Vite env or localStorage
    const debugEnv = import.meta.env.VITE_ANALYTICS_DEBUG;
    this.isDebug = debugEnv === 'true' || localStorage.getItem('agy_analytics_debug') === 'true';

    // Check PostHog keys (Robertus Agung Pradana Project)
    const apiKey = import.meta.env.VITE_POSTHOG_KEY || 'phc_ARAmaXYZ9R72RBYTfGHGdQrsKdASmLAHusZHPkUurVbj';
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
          request_batching: false, // Instant dispatch to cloud
          flushInterval: 500,
          flushAt: 1,
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

    // Handle bfcache restoration (when Instagram / mobile browser brings back suspended webview)
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        captureUtmFromUrl();
        setTimeout(() => {
          this.page('home', { source_resumed: 'bfcache' });
        }, 200);
      }
    });
  }

  public track(eventName: AnalyticsEventName, properties?: Record<string, any>) {
    const safeProps = sanitizeProperties(properties);
    const { firstTouch, lastTouch } = getAttribution();
    const nowIso = new Date().toISOString();

    const sourceVal = String(lastTouch.utm_source || firstTouch.utm_source || 'direct').toLowerCase();
    const mediumVal = String(lastTouch.utm_medium || firstTouch.utm_medium || '').toLowerCase();
    const hasCampaign = !!(lastTouch.utm_campaign || firstTouch.utm_campaign);
    const isPaidInsta = (sourceVal.includes('instagram') || sourceVal === 'ig') && (mediumVal === 'paid_social' || (hasCampaign && mediumVal !== 'bio'));
    const trafficSource = isPaidInsta
      ? 'instagram_paid'
      : (sourceVal.includes('instagram') || sourceVal === 'ig')
      ? 'instagram_bio'
      : sourceVal;

    const mergedProps = {
      event_name: eventName,
      timestamp: nowIso,
      visitor_id: getOrCreateVisitorId(),
      session_id: getOrCreateSessionId(),
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      referrer: typeof document !== 'undefined' ? (document.referrer || lastTouch.referrer || firstTouch.referrer || undefined) : undefined,
      traffic_source: trafficSource,
      utm_source: lastTouch.utm_source || firstTouch.utm_source || undefined,
      utm_medium: lastTouch.utm_medium || firstTouch.utm_medium || undefined,
      utm_campaign: lastTouch.utm_campaign || firstTouch.utm_campaign || undefined,
      utm_content: lastTouch.utm_content || firstTouch.utm_content || undefined,
      utm_term: lastTouch.utm_term || firstTouch.utm_term || undefined,
      first_touch_source: firstTouch.utm_source || 'direct',
      first_touch_medium: firstTouch.utm_medium,
      first_touch_campaign: firstTouch.utm_campaign,
      first_touch_content: firstTouch.utm_content,
      last_touch_source: lastTouch.utm_source || 'direct',
      last_touch_medium: lastTouch.utm_medium,
      last_touch_campaign: lastTouch.utm_campaign,
      last_touch_content: lastTouch.utm_content,
      device_type: detectDeviceType(),
      browser: detectBrowser(),
      is_instagram_in_app_browser: detectInAppInstagram(),
      session_elapsed_seconds: getSessionElapsedSeconds(),
      client_time: nowIso,
      screen_width: typeof window !== 'undefined' ? window.innerWidth : undefined,
      ...safeProps,
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
        posthog.capture(eventName, mergedProps, { send_instantly: true });
      } catch (err) {
        console.warn('[Analytics] PostHog capture error:', err);
      }
    }
  }

  public page(pageName: string, properties?: Record<string, any>) {
    const now = Date.now();
    // Guard against duplicate page view calls within 1 second (e.g. React StrictMode or immediate remount)
    if (this.lastPageName === pageName && now - this.lastPageTime < 1000) {
      return;
    }
    this.lastPageName = pageName;
    this.lastPageTime = now;

    this.track('page_view', {
      page: pageName,
      path: typeof window !== 'undefined' ? window.location.pathname : '/',
      ...properties,
    });
  }

  public landing(pageName: string = 'aman-berapa-bulan', properties?: Record<string, any>) {
    this.track('landing_view', {
      page: pageName,
      path: typeof window !== 'undefined' ? window.location.pathname : `/${pageName}`,
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
