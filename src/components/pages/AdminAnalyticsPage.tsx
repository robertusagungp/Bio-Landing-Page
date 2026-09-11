import React, { useState, useMemo, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  CheckCircle2, 
  TrendingUp, 
  MessageCircle, 
  ArrowLeft, 
  Lock, 
  RefreshCw, 
  Trash2, 
  Filter, 
  ExternalLink, 
  PieChart, 
  Info, 
  Copy, 
  Check, 
  Radio, 
  Sparkles, 
  Smartphone, 
  Key, 
  Cloud,
  Activity,
  Clock
} from 'lucide-react';
import { 
  getLocalAnalyticsEvents, 
  clearLocalAnalyticsEvents, 
  StoredLocalEvent,
  getPostHogProjectKey,
  getStoredPostHogPersonalKey,
  setStoredPostHogPersonalKey,
  fetchPostHogCloudEvents
} from '../../utils/analytics';

interface AdminAnalyticsPageProps {
  onBackToHome: () => void;
}

export const AdminAnalyticsPage: React.FC<AdminAnalyticsPageProps> = ({ onBackToHome }) => {
  const [pin, setPin] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('agy_admin_authenticated') === 'true';
  });
  const [authError, setAuthError] = useState(false);

  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'all'>('all');
  const [refreshKey, setRefreshKey] = useState(0);

  // Cloud Sync States
  const [personalKey, setPersonalKey] = useState<string>(() => getStoredPostHogPersonalKey());
  const [personalKeyInput, setPersonalKeyInput] = useState<string>(personalKey);
  const [isCloudLoading, setIsCloudLoading] = useState<boolean>(false);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [cloudEvents, setCloudEvents] = useState<StoredLocalEvent[] | null>(null);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('');
  const [showKeyConfig, setShowKeyConfig] = useState<boolean>(false);
  const [copiedBioLink, setCopiedBioLink] = useState<boolean>(false);
  const [copiedAdLink, setCopiedAdLink] = useState<boolean>(false);
  const [resetCutoff, setResetCutoff] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    const stored = localStorage.getItem('agy_analytics_reset_cutoff');
    return stored ? parseInt(stored, 10) : 0;
  });

  const projectKey = getPostHogProjectKey();
  const instagramBioUrl = 'https://bio-landing-page-seven.vercel.app/?utm_source=instagram&utm_medium=bio';
  const instagramPaidAdUrl = 'https://bio-landing-page-seven.vercel.app/aman-berapa-bulan?utm_source=instagram&utm_medium=paid_social&utm_campaign=financial_runway&utm_content=reel_01';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default PIN: 1740 or 'admin' or 'robert'
    if (pin === '1740' || pin === 'admin' || pin === 'robert') {
      setIsAuthenticated(true);
      sessionStorage.setItem('agy_admin_authenticated', 'true');
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('agy_admin_authenticated');
    setIsAuthenticated(false);
  };

  // Sync from PostHog Cloud if personal API key is available
  useEffect(() => {
    if (!isAuthenticated || !personalKey) {
      setCloudEvents(null);
      return;
    }

    let isMounted = true;
    setIsCloudLoading(true);
    setCloudError(null);

    fetchPostHogCloudEvents(personalKey)
      .then((res) => {
        if (!isMounted) return;
        setIsCloudLoading(false);
        if (res.success) {
          setCloudEvents(res.events);
          setCloudError(null);
          setLastSyncedTime(new Date().toLocaleTimeString('id-ID'));
        } else {
          setCloudError(res.error || 'Gagal mengambil data dari PostHog Cloud');
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setIsCloudLoading(false);
        setCloudError(err?.message || 'Gagal menghubungi PostHog');
      });

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, personalKey, refreshKey]);

  // Real-time Auto Refresh Polling (every 5 seconds)
  useEffect(() => {
    if (!isAuthenticated || !personalKey) return;
    const interval = setInterval(() => {
      setRefreshKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAuthenticated, personalKey]);

  const handleSavePersonalKey = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = personalKeyInput.trim();
    setStoredPostHogPersonalKey(cleanKey);
    setPersonalKey(cleanKey);
    setRefreshKey((k) => k + 1);
  };

  const handleClearPersonalKey = () => {
    setStoredPostHogPersonalKey('');
    setPersonalKey('');
    setPersonalKeyInput('');
    setCloudEvents(null);
    setCloudError(null);
    setRefreshKey((k) => k + 1);
  };

  const handleCopyBioLink = () => {
    navigator.clipboard.writeText(instagramBioUrl);
    setCopiedBioLink(true);
    setTimeout(() => setCopiedBioLink(false), 2500);
  };

  // Pure real events: Prefer PostHog Cloud events if loaded, otherwise local device storage
  const events = useMemo(() => {
    if (cloudEvents && cloudEvents.length > 0) {
      return cloudEvents;
    }
    return getLocalAnalyticsEvents();
  }, [cloudEvents, refreshKey]);

  // Filter events by time range and reset cutoff
  const filteredEvents = useMemo(() => {
    const now = Date.now();
    let cutoff = resetCutoff;
    if (timeRange === 'today') cutoff = Math.max(cutoff, now - 24 * 3600 * 1000);
    else if (timeRange === '7d') cutoff = Math.max(cutoff, now - 7 * 24 * 3600 * 1000);
    else if (timeRange === '30d') cutoff = Math.max(cutoff, now - 30 * 24 * 3600 * 1000);

    return events.filter((ev) => new Date(ev.timestamp).getTime() > cutoff);
  }, [events, timeRange, resetCutoff]);

  // High level KPIs (100% Real Data, starts at 0)
  const kpis = useMemo(() => {
    // Exclude internal admin dashboard views from public metrics
    const publicPageViews = filteredEvents.filter(
      (e) => (e.eventName === 'page_view' || e.eventName === '$pageview' || e.eventName === 'landing_view') && 
             e.properties?.page !== 'admin_analytics' && 
             e.properties?.page !== 'admin'
    );

    // Unique visitors deduplicated by visitor_id, session_id, or distinct_id
    const uniqueVisitorIds = new Set(
      publicPageViews
        .map((e) => e.properties?.visitor_id || e.properties?.session_id || e.properties?.distinct_id)
        .filter(Boolean)
    );

    const uniqueVisitors = uniqueVisitorIds.size;
    const pageViews = publicPageViews.length;

    const landingViews = filteredEvents.filter(
      (e) => e.eventName === 'landing_view' || 
             (e.eventName === 'page_view' && (e.properties?.page === 'aman-berapa-bulan' || e.properties?.path === '/aman-berapa-bulan'))
    ).length;

    const toolStarts = filteredEvents.filter((e) => e.eventName === 'tool_started').length;
    const step1Completions = filteredEvents.filter((e) => e.eventName === 'step_1_completed').length;
    const step2Completions = filteredEvents.filter((e) => e.eventName === 'step_2_completed').length;
    const toolCompletions = filteredEvents.filter((e) => e.eventName === 'tool_completed').length;
    const resultViews = filteredEvents.filter((e) => e.eventName === 'result_viewed').length;
    const nextAssessmentClicks = filteredEvents.filter((e) => e.eventName === 'next_assessment_clicked').length;
    const waClicks = filteredEvents.filter((e) => e.eventName === 'whatsapp_clicked').length;
    const riskEdViews = filteredEvents.filter(
      (e) => e.eventName === 'risk_management_option_clicked' || e.eventName === 'financial_protection_viewed'
    ).length;
    const protectionOpens = filteredEvents.filter((e) => e.eventName === 'protection_gap_opened').length;

    const completionRate = toolStarts > 0 ? Math.round((Math.max(toolCompletions, resultViews) / toolStarts) * 100) : 0;
    const waConversionRate = uniqueVisitors > 0 ? ((waClicks / uniqueVisitors) * 100).toFixed(1) : '0.0';

    return {
      uniqueVisitors,
      pageViews,
      landingViews,
      toolStarts,
      step1Completions,
      step2Completions,
      toolCompletions,
      resultViews,
      nextAssessmentClicks,
      completionRate,
      waClicks,
      waConversionRate,
      riskEdViews,
      protectionOpens,
    };
  }, [filteredEvents]);

  // Helper to extract normalized source channel from event properties
  const getEventSource = (props?: Record<string, any>): string => {
    if (!props) return 'direct';
    
    // Explicit traffic_source property check
    const explicitSource = String(props.traffic_source || '').toLowerCase();
    if (explicitSource === 'instagram_paid') return 'instagram_paid';
    if (explicitSource === 'instagram_bio') return 'instagram_bio';

    // 1. Check UTM and campaign attribution
    const utmSource = String(props.utm_source || props.last_touch_source || props.first_touch_source || '').toLowerCase();
    const utmMedium = String(props.utm_medium || props.last_touch_medium || props.first_touch_medium || '').toLowerCase();
    const utmCampaign = String(props.utm_campaign || props.last_touch_campaign || props.first_touch_campaign || '').toLowerCase();

    const isInstagram = utmSource.includes('instagram') || utmSource === 'ig' || utmSource.includes('ig_') || utmSource === 'insta';
    if (isInstagram) {
      if (utmMedium === 'paid_social' || (utmCampaign && utmMedium !== 'bio')) {
        return 'instagram_paid';
      }
      return 'instagram_bio';
    }

    if (utmSource.includes('whatsapp') || utmSource.includes('wa.me') || utmSource === 'wa') {
      return 'whatsapp';
    }
    if (utmSource.includes('linkedin')) return 'linkedin';
    if (utmSource.includes('tiktok')) return 'tiktok';
    if (utmSource.includes('twitter') || utmSource.includes('t.co')) return 'twitter';
    if (utmSource.includes('facebook') || utmSource.includes('fb')) return 'facebook';

    // 2. Check referrer headers
    const ref = String(props.$referrer || props.referrer || props.initial_referrer || '').toLowerCase();
    if (ref.includes('instagram') || ref.includes('l.instagram.com') || ref.includes('com.instagram.android')) {
      if (utmMedium === 'paid_social' || utmCampaign) return 'instagram_paid';
      return 'instagram_bio';
    }
    if (ref.includes('whatsapp') || ref.includes('wa.me')) return 'whatsapp';
    if (ref.includes('linkedin')) return 'linkedin';
    if (ref.includes('tiktok')) return 'tiktok';
    if (ref.includes('twitter') || ref.includes('t.co')) return 'twitter';
    if (ref.includes('facebook')) return 'facebook';

    // 3. Check browser, user agent, and URL parameters from PostHog
    const browser = String(props.$browser || '').toLowerCase();
    const rawUa = String(props.$raw_user_agent || props.user_agent || '').toLowerCase();
    const currentUrl = String(props.$current_url || '').toLowerCase();
    if (browser.includes('instagram') || rawUa.includes('instagram') || currentUrl.includes('instagram')) {
      if (utmMedium === 'paid_social' || currentUrl.includes('paid_social') || utmCampaign) return 'instagram_paid';
      return 'instagram_bio';
    }

    if (utmSource && utmSource !== 'direct' && utmSource !== 'undefined') return utmSource;
    return 'direct';
  };

  // Traffic Source Breakdown
  const trafficSources = useMemo(() => {
    const map: Record<string, { visitors: number; starts: number; waClicks: number }> = {};

    filteredEvents.forEach((ev) => {
      if ((ev.eventName === 'page_view' || ev.eventName === '$pageview') && 
          (ev.properties?.page === 'admin_analytics' || ev.properties?.page === 'admin')) {
        return;
      }
      const src = getEventSource(ev.properties);

      if (!map[src]) {
        map[src] = { visitors: 0, starts: 0, waClicks: 0 };
      }
      if (ev.eventName === 'page_view' || ev.eventName === '$pageview' || ev.eventName === 'landing_view') map[src].visitors++;
      if (ev.eventName === 'tool_started') map[src].starts++;
      if (ev.eventName === 'whatsapp_clicked') map[src].waClicks++;
    });

    return Object.entries(map).sort((a, b) => b[1].visitors - a[1].visitors);
  }, [filteredEvents]);

  // Tool Performance Breakdown
  const toolStats = useMemo(() => {
    const map: Record<string, { starts: number; completions: number; wa: number }> = {
      'runway_calculator': { starts: 0, completions: 0, wa: 0 },
      'life_readiness': { starts: 0, completions: 0, wa: 0 },
      'lifestyle_age': { starts: 0, completions: 0, wa: 0 },
      'emergency_checker': { starts: 0, completions: 0, wa: 0 },
      'medical_simulator': { starts: 0, completions: 0, wa: 0 },
      'financial_health': { starts: 0, completions: 0, wa: 0 },
      'family_readiness': { starts: 0, completions: 0, wa: 0 },
      'health_checklist': { starts: 0, completions: 0, wa: 0 },
      'protection_gap': { starts: 0, completions: 0, wa: 0 },
    };

    filteredEvents.forEach((ev) => {
      const tool = (ev.properties?.tool_name || ev.properties?.source_tool || '').toLowerCase().replace(/[- ]/g, '_');
      if (map[tool]) {
        if (ev.eventName === 'tool_started') map[tool].starts++;
        if (ev.eventName === 'tool_completed' || ev.eventName === 'result_viewed') map[tool].completions++;
        if (ev.eventName === 'whatsapp_clicked') map[tool].wa++;
      }
    });

    return Object.entries(map).map(([id, stat]) => {
      const rate = stat.starts > 0 ? Math.round((stat.completions / stat.starts) * 100) : 0;
      return { id, ...stat, rate };
    }).sort((a, b) => b.starts - a.starts);
  }, [filteredEvents]);

  // Campaign & Content Performance Breakdown (UTM Campaign & Content)
  const campaignStats = useMemo(() => {
    const map: Record<string, { visitors: number; starts: number; waClicks: number; content: Set<string> }> = {};

    filteredEvents.forEach((ev) => {
      const camp = ev.properties?.utm_campaign || ev.properties?.last_touch_campaign || ev.properties?.first_touch_campaign;
      if (!camp) return;
      const content = ev.properties?.utm_content || ev.properties?.last_touch_content || '';
      
      if (!map[camp]) {
        map[camp] = { visitors: 0, starts: 0, waClicks: 0, content: new Set() };
      }
      if (content) map[camp].content.add(content);
      if (ev.eventName === 'page_view' || ev.eventName === '$pageview' || ev.eventName === 'landing_view') map[camp].visitors++;
      if (ev.eventName === 'tool_started') map[camp].starts++;
      if (ev.eventName === 'whatsapp_clicked') map[camp].waClicks++;
    });

    return Object.entries(map).map(([camp, stat]) => ({
      campaign: camp,
      visitors: stat.visitors,
      starts: stat.starts,
      waClicks: stat.waClicks,
      contents: Array.from(stat.content).join(', ') || '-',
    })).sort((a, b) => b.visitors - a.visitors);
  }, [filteredEvents]);

  // Recent Live Activity Stream (Public events only, excluding admin noise)
  const recentActivities = useMemo(() => {
    return filteredEvents
      .filter((ev) => {
        if (ev.properties?.page === 'admin_analytics' || ev.properties?.page === 'admin') return false;
        if (ev.eventName.startsWith('$')) return false; // hide posthog internal telemetry
        return true;
      })
      .slice(0, 15);
  }, [filteredEvents]);

  // Dedicated Conversion Funnel Data (starts from 0)
  const landingBase = Math.max(kpis.uniqueVisitors, kpis.landingViews);
  const completedCount = Math.max(kpis.toolCompletions, kpis.resultViews);
  const funnelSteps = [
    { 
      label: '1. Pengunjung Landing / Hub (Total Visitors)', 
      count: landingBase, 
      pct: landingBase > 0 ? 100 : 0 
    },
    { 
      label: '2. Mulai Isi Kalkulator / Tool (Tool Started)', 
      count: kpis.toolStarts, 
      pct: landingBase > 0 ? Math.round((kpis.toolStarts / landingBase) * 100) : 0,
    },
    { 
      label: '3. Input Lengkap (Step Completed)', 
      count: Math.max(kpis.step1Completions, kpis.step2Completions, completedCount), 
      pct: kpis.toolStarts > 0 ? Math.round((Math.max(kpis.step1Completions, kpis.step2Completions, completedCount) / kpis.toolStarts) * 100) : 0,
    },
    { 
      label: '4. Melihat Hasil Rekomendasi (Result Viewed)', 
      count: completedCount, 
      pct: kpis.toolStarts > 0 ? Math.round((completedCount / kpis.toolStarts) * 100) : 0,
    },
    { 
      label: '5. Lanjut Evaluasi Kesiapan (Next Assessment)', 
      count: kpis.nextAssessmentClicks, 
      pct: completedCount > 0 ? Math.round((kpis.nextAssessmentClicks / completedCount) * 100) : 0,
    },
    { 
      label: '6. Konsultasi WhatsApp (WhatsApp Clicked)', 
      count: kpis.waClicks, 
      pct: completedCount > 0 ? Math.round((kpis.waClicks / completedCount) * 100) : 0,
    },
  ];

  const formatActivityLabel = (evName: string, props?: Record<string, any>) => {
    switch (evName) {
      case 'landing_view':
        return { 
          label: 'Membuka Landing Page (Aman Berapa Bulan)', 
          icon: '👁️', 
          badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold' 
        };
      case 'step_1_completed':
        return { 
          label: '✓ Step 1 Selesai (Dana Likuid)', 
          icon: '✍️', 
          badge: 'bg-blue-50 text-blue-700 border-blue-200' 
        };
      case 'step_2_completed':
        return { 
          label: '✓ Step 2 Selesai (Pengeluaran Wajib)', 
          icon: '✍️', 
          badge: 'bg-blue-50 text-blue-700 border-blue-200' 
        };
      case 'result_viewed': {
        const bucketVal = String(props?.runway_bucket || '');
        const bucketLabel = bucketVal
          ? bucketVal.replace('lt_1', '<1 bln').replace('1_3', '1–3 bln').replace('3_6', '3–6 bln').replace('6_12', '6–12 bln').replace('12_plus', '12+ bln')
          : '';
        return { 
          label: bucketLabel ? `Hasil Dilihat (Kategori: ${bucketLabel})` : 'Hasil Kalkulasi Dilihat', 
          icon: '📊', 
          badge: 'bg-purple-50 text-purple-700 border-purple-200 font-semibold' 
        };
      }
      case 'next_assessment_clicked':
        return { 
          label: '➡️ Lanjut ke Life Readiness Score', 
          icon: '🚀', 
          badge: 'bg-teal-50 text-teal-800 border-teal-200 font-semibold' 
        };
      case 'whatsapp_clicked':
        return { 
          label: 'Konsultasi WhatsApp', 
          icon: '💬', 
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold' 
        };
      case 'page_view':
        return { 
          label: props?.page ? `Kunjungan Halaman (${props.page})` : 'Kunjungan Halaman', 
          icon: '👁️', 
          badge: 'bg-blue-50 text-blue-700 border-blue-200' 
        };
      case 'tool_started':
        return { 
          label: props?.tool_name === 'runway_calculator' ? 'Mulai Kalkulator (Runway)' : (props?.tool_name ? `Mulai Asesmen (${props.tool_name})` : 'Mulai Asesmen'), 
          icon: '🚀', 
          badge: 'bg-teal-50 text-teal-700 border-teal-200' 
        };
      case 'tool_completed':
        return { 
          label: props?.tool_name === 'runway_calculator' ? 'Kalkulasi Runway Selesai' : (props?.tool_name ? `Selesai Asesmen (${props.tool_name})` : 'Selesai Asesmen'), 
          icon: '🏁', 
          badge: 'bg-purple-50 text-purple-700 border-purple-200' 
        };
      case 'lead_capture_saved':
        return { label: 'Simpan Kontak Lead', icon: '📋', badge: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'tool_question_answered':
        return { label: 'Menjawab Pertanyaan', icon: '✍️', badge: 'bg-slate-50 text-slate-700 border-slate-200' };
      case 'tool_question_viewed':
        return { label: 'Melihat Pertanyaan', icon: '❓', badge: 'bg-slate-50 text-slate-600 border-slate-200' };
      default:
        return { label: evName.replace(/_/g, ' '), icon: '⚡', badge: 'bg-slate-50 text-slate-700 border-slate-200' };
    }
  };

  const formatSourceBadge = (rawSrc?: string) => {
    const s = String(rawSrc || 'direct').toLowerCase();
    if (s === 'instagram_paid' || s.includes('paid')) {
      return { label: 'IG (Paid Ad)', badge: 'bg-purple-50 text-purple-700 border-purple-200 font-bold' };
    }
    if (s === 'instagram_bio' || s.includes('instagram') || s === 'ig') {
      return { label: 'IG (Bio)', badge: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' };
    }
    if (s.includes('whatsapp') || s.includes('wa.me') || s === 'wa') {
      return { label: 'WHATSAPP', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' };
    }
    if (s.includes('linkedin')) {
      return { label: 'LINKEDIN', badge: 'bg-sky-50 text-sky-700 border-sky-200 font-bold' };
    }
    if (s.includes('tiktok')) {
      return { label: 'TIKTOK', badge: 'bg-slate-900 text-white border-slate-800 font-bold' };
    }
    return { label: 'DIRECT', badge: 'bg-slate-100 text-slate-700 border-slate-200 font-bold' };
  };

  const formatTimeWib = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
    } catch {
      return isoString;
    }
  };

  // PIN AUTH FORM
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center animate-in fade-in duration-200">
        <div className="w-12 h-12 rounded-full bg-teal-brand/10 text-teal-brand flex items-center justify-center mx-auto mb-4">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Dashboard Analytics Pemilik</h2>
        <p className="text-xs text-muted mt-1.5 mb-6">
          Masukkan PIN keamanan untuk melihat data performa traffic dan funnel konversi riil.
        </p>

        <form onSubmit={handleLogin} className="space-y-4 max-w-xs mx-auto">
          <div>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan PIN (Default: 1740)"
              className="w-full text-center tracking-widest text-lg px-4 py-3 rounded-card border border-border focus:border-teal-brand outline-none bg-white text-foreground shadow-sm"
              autoFocus
            />
            {authError && (
              <p className="text-xs text-rose-600 mt-1.5 font-medium">
                PIN salah. Silakan coba 1740.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-brand hover:bg-teal-light text-white font-bold py-2.5 rounded-btn text-xs shadow-soft transition-all"
          >
            Buka Dashboard
          </button>

          <button
            type="button"
            onClick={onBackToHome}
            className="w-full text-xs text-muted hover:text-foreground font-medium py-1"
          >
            ← Kembali ke Beranda
          </button>
        </form>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD VIEW
  return (
    <div className="max-w-[760px] mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-5">
        <div>
          <button
            onClick={onBackToHome}
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted hover:text-foreground mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Situs</span>
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Owner Analytics &amp; Funnel Hub
            </h1>
            {cloudEvents && cloudEvents.length > 0 ? (
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border border-emerald-300">
                <Cloud className="w-3 h-3" />
                PostHog Cloud Live ({cloudEvents.length} event) • Auto-Sync 5s
              </span>
            ) : (
              <span className="text-[10px] font-bold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-full inline-flex items-center gap-1 border border-teal-300">
                <Smartphone className="w-3 h-3" />
                {isCloudLoading ? 'Menyambungkan Cloud...' : 'Log Lokal Perangkat'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted mt-0.5">
            <span>Metrik murni aktivitas pengguna riil, tanpa simulasi.</span>
            {lastSyncedTime && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Tersinkronkan: {lastSyncedTime}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setRefreshKey((k) => k + 1)}
            title="Refresh Data Cloud"
            className="p-2 rounded-card border border-border hover:bg-section text-muted hover:text-foreground transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCloudLoading ? 'animate-spin text-teal-brand' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={() => {
              if (window.confirm('Reset semua metrik di dashboard ini menjadi 0 dan mulai pencatatan baru dari sekarang?')) {
                const now = Date.now();
                localStorage.setItem('agy_analytics_reset_cutoff', now.toString());
                setResetCutoff(now);
                clearLocalAnalyticsEvents();
                setRefreshKey((k) => k + 1);
              }
            }}
            title="Reset Analitik ke 0"
            className="p-2 rounded-card border border-border hover:bg-rose-50 hover:text-rose-600 text-muted transition-colors flex items-center gap-1 text-xs font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset ke 0</span>
          </button>

          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-muted hover:text-foreground py-2 px-3 rounded-card border border-border hover:bg-section"
          >
            Kunci
          </button>
        </div>
      </div>

      {/* COMMAND CENTER: POSTHOG LIVE CLOUD HUB */}
      <div className="p-4 sm:p-5 rounded-card-lg bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white shadow-soft space-y-3.5 border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              PostHog Cloud Stream &amp; Auto-Sync (5 Detik)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded border border-slate-700">
              {projectKey ? `${projectKey.substring(0, 10)}...` : 'Connected'}
            </span>
          </div>

          <button
            onClick={() => setShowKeyConfig((v) => !v)}
            className="text-[11px] text-teal-300 hover:text-teal-200 font-medium inline-flex items-center gap-1 self-start sm:self-auto underline"
          >
            <Key className="w-3 h-3" />
            <span>{showKeyConfig ? 'Tutup Pengaturan API Key' : (personalKey ? 'Ganti Personal API Key' : 'Sinkronkan Angka Langsung ke Halaman Ini')}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Setiap klik dari link bio Instagram atau WhatsApp di HP pengunjung <strong>sudah otomatis terkirim ke PostHog Cloud</strong> secara real-time. Buka konsol PostHog di bawah untuk memantau aktivitas detik ini juga:
        </p>

        {/* 3 Quick Launch Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
          <a
            href="https://us.posthog.com/events"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-card bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-all group hover:border-teal-400/50"
          >
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-rose-400 group-hover:animate-pulse" />
              <span>Live Events Stream</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </a>

          <a
            href="https://us.posthog.com/web"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-card bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-all group hover:border-teal-400/50"
          >
            <div className="flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
              <span>Web Analytics</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </a>

          <a
            href="https://us.posthog.com/replay"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between p-2.5 rounded-card bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-semibold text-white transition-all group hover:border-teal-400/50"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Rekaman Layar (Replay)</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
          </a>
        </div>

        {/* Expandable Cloud Sync Configuration */}
        {showKeyConfig && (
          <div className="mt-3 p-3.5 rounded-card bg-slate-950 border border-teal-500/30 text-xs space-y-2.5 text-slate-200">
            <div className="font-semibold text-teal-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" />
              <span>Pengaturan PostHog Personal API Key (HogQL Direct Sync)</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Agar tabel dan kartu di bawah otomatis menarik data live dari PostHog Cloud (bukan sekadar memory browser laptop), masukkan <strong>Personal API Key</strong> Anda:
            </p>
            <form onSubmit={handleSavePersonalKey} className="flex flex-col sm:flex-row gap-2">
              <input
                type="password"
                value={personalKeyInput}
                onChange={(e) => setPersonalKeyInput(e.target.value)}
                placeholder="phx_... (Personal API Key)"
                className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-teal-400"
              />
              <button
                type="submit"
                disabled={isCloudLoading}
                className="px-3 py-2 bg-teal-brand hover:bg-teal-light text-white font-bold rounded text-xs transition-colors shrink-0 flex items-center justify-center gap-1"
              >
                {isCloudLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : null}
                <span>Simpan &amp; Tarik Cloud</span>
              </button>
              {personalKey && (
                <button
                  type="button"
                  onClick={handleClearPersonalKey}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs transition-colors shrink-0"
                >
                  Hapus
                </button>
              )}
            </form>

            {cloudError && (
              <p className="text-[11px] text-rose-400 font-medium">
                ⚠️ {cloudError}
              </p>
            )}

            <div className="text-[10px] text-slate-400 pt-1 space-y-1">
              <div>💡 <strong>Cara dapatkan Personal API Key:</strong></div>
              <div>
                1. Buka akun PostHog Anda di{' '}
                <a
                  href="https://us.posthog.com/settings/user-api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-300 underline font-semibold hover:text-teal-200"
                >
                  us.posthog.com/settings/user-api-keys
                </a>
              </div>
              <div>2. Klik tombol <strong>+ Create personal API key</strong> (pastikan centang <strong>Query ➡️ Read</strong>).</div>
              <div>3. Salin kode yang diawali dengan <code className="text-teal-300 font-mono">phx_...</code> dan tempelkan ke kolom di atas.</div>
            </div>
          </div>
        )}
      </div>

      {/* INSTAGRAM PAID AD & BIO LINK ATTRIBUTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Paid Ad Deep Link Card */}
        <div className="p-4 rounded-card bg-purple-50/80 border border-purple-200 text-xs text-purple-950 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold flex items-center gap-1.5 text-purple-900">
              <Sparkles className="w-4 h-4 text-purple-700 shrink-0" />
              <span>Link Khusus Iklan Ads (Deep-Link)</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(instagramPaidAdUrl);
                setCopiedAdLink(true);
                setTimeout(() => setCopiedAdLink(false), 2500);
              }}
              className="text-[11px] font-bold text-purple-800 bg-purple-200/80 hover:bg-purple-200 px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shrink-0"
            >
              {copiedAdLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span className="text-emerald-800 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin Link Ads</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-purple-900">
            Gunakan URL ini sebagai <strong>Website Destination URL</strong> di Meta Ads Manager agar langsung menuju kalkulator runway tanpa gate:
          </p>
          <div className="p-2 rounded bg-white border border-purple-300/80 font-mono text-[10px] text-purple-900 break-all select-all flex items-center justify-between gap-2">
            <span>{instagramPaidAdUrl}</span>
          </div>
        </div>

        {/* Bio Link Card */}
        <div className="p-4 rounded-card bg-amber-50/80 border border-amber-200 text-xs text-amber-950 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <Smartphone className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Link Khusus Bio Instagram (Organik)</span>
            </div>
            <button
              onClick={handleCopyBioLink}
              className="text-[11px] font-bold text-amber-800 bg-amber-200/80 hover:bg-amber-200 px-2.5 py-1 rounded transition-colors inline-flex items-center gap-1 shrink-0"
            >
              {copiedBioLink ? (
                <>
                  <Check className="w-3 h-3 text-emerald-700" />
                  <span className="text-emerald-800 font-bold">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Salin Link Bio</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] leading-relaxed text-amber-900">
            Pasang link ini di profil bio Instagram agar kunjungan organik terdeteksi sebagai <strong>INSTAGRAM (Bio)</strong>:
          </p>
          <div className="p-2 rounded bg-white border border-amber-300/80 font-mono text-[10px] text-amber-900 break-all select-all flex items-center justify-between gap-2">
            <span>{instagramBioUrl}</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-card p-3.5 rounded-card border border-border shadow-soft">
        <div className="flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-muted" />
          <span className="text-xs font-semibold text-muted mr-1">Rentang Waktu:</span>
          <div className="flex items-center gap-1 bg-section p-1 rounded-card text-xs">
            {(['today', '7d', '30d', 'all'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2.5 py-1 rounded font-semibold transition-all ${
                  timeRange === r
                    ? 'bg-white text-teal-brand shadow-soft'
                    : 'text-muted hover:text-foreground'
                }`}
              >
                {r === 'today' ? 'Hari Ini' : r === '7d' ? '7 Hari' : r === '30d' ? '30 Hari' : 'Semua'}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] text-muted flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${cloudEvents ? 'bg-emerald-500 animate-pulse' : 'bg-teal-500'} inline-block`}></span>
          <span>
            {cloudEvents ? `Cloud Live: ${filteredEvents.length} total event` : `Log Perangkat Ini: ${filteredEvents.length} event`}
          </span>
        </div>
      </div>

      {/* RESET BENCHMARK ACTIVE NOTIFICATION */}
      {resetCutoff > 0 && (
        <div className="p-3.5 rounded-card bg-amber-50 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Pencatatan Baru Aktif:</strong> Metrik dimulai bersih dari{' '}
              {new Date(resetCutoff).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} WIB ({new Date(resetCutoff).toLocaleDateString('id-ID')}).
            </span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('agy_analytics_reset_cutoff');
              setResetCutoff(0);
              setRefreshKey((k) => k + 1);
            }}
            className="px-2.5 py-1 rounded bg-amber-200/80 hover:bg-amber-200 text-amber-900 font-bold text-[11px] shrink-0 transition-colors"
          >
            Pulihkan Riwayat Awal
          </button>
        </div>
      )}

      {/* ZERO DATA NOTIFICATION IF EMPTY */}
      {filteredEvents.length === 0 && (
        <div className="p-4 rounded-card bg-section/70 border border-border text-xs text-muted flex items-start gap-2.5">
          <Info className="w-4 h-4 text-teal-brand shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-foreground block">
              Data pada browser ini masih 0
            </span>
            Jika Anda mengklik link dari HP lain, datanya telah aman tercatat di PostHog Cloud (klik tombol <strong>Live Events Stream</strong> di atas untuk melihatnya). Agar data di tabel bawah ini langsung sinkron dengan PostHog Cloud, aktifkan fitur <strong>Sinkronkan Angka Langsung ke Halaman Ini</strong> di atas.
          </div>
        </div>
      )}

      {/* KPI CARDS (4 CARDS) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Pengunjung Unik</span>
            <Users className="w-4 h-4 text-teal-brand" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.uniqueVisitors}</div>
          <div className="text-[10px] text-muted mt-0.5">{kpis.pageViews} Total Pageviews</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Mulai Tool</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.toolStarts}</div>
          <div className="text-[10px] text-muted mt-0.5">Asesmen Dimulai</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Selesai</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.completionRate}%</div>
          <div className="text-[10px] text-muted mt-0.5">{kpis.toolCompletions} assessment rampung</div>
        </div>

        <div className="p-4 rounded-card bg-card border border-border shadow-soft">
          <div className="flex items-center justify-between text-muted mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider">Leads WA</span>
            <MessageCircle className="w-4 h-4 text-[#25D366]" />
          </div>
          <div className="text-2xl font-extrabold text-foreground">{kpis.waClicks}</div>
          <div className="text-[10px] text-muted mt-0.5">Konversi: {kpis.waConversionRate}%</div>
        </div>
      </div>

      {/* REAL-TIME LIVE ACTIVITY STREAM (FEED) */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Aliran Aktivitas Pengunjung Real-Time (Live Feed)</span>
          </h3>
          <span className="text-[10px] text-muted font-medium bg-section px-2 py-0.5 rounded-full">
            Update Otomatis per 8 Detik
          </span>
        </div>

        {recentActivities.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted">
            Belum ada aktivitas baru tercatat.
          </div>
        ) : (
          <div className="divide-y divide-border/60 overflow-x-auto">
            {recentActivities.map((act) => {
              const actInfo = formatActivityLabel(act.eventName, act.properties);
              const srcInfo = formatSourceBadge(getEventSource(act.properties));
              return (
                <div key={act.id} className="py-2.5 flex items-center justify-between gap-3 text-xs hover:bg-section/30 px-1 rounded transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-base shrink-0">{actInfo.icon}</span>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {actInfo.label}
                      </div>
                      <div className="text-[10px] text-muted flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3 text-muted" />
                        <span>{formatTimeWib(act.timestamp)}</span>
                        <span>•</span>
                        <span>{act.properties?.visitor_id ? `ID: ${act.properties.visitor_id.substring(0, 8)}...` : 'Anonim'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded border ${srcInfo.badge}`}>
                      {srcInfo.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CONVERSION FUNNEL BAR */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 border-b border-border/80 pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-teal-brand" />
            <span>Funnel Konversi Keseluruhan</span>
          </h3>
          <span className="text-[10px] text-muted bg-section px-2.5 py-0.5 rounded-full border border-border font-medium">
            Tracking funnel baru aktif sejak 11 September 2026
          </span>
        </div>

        <div className="space-y-3">
          {funnelSteps.map((step, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{step.label}</span>
                <span className="font-bold text-teal-brand">
                  {step.count} ({step.pct}%)
                </span>
              </div>
              <div className="h-2 w-full bg-section rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-brand transition-all duration-300"
                  style={{ width: `${step.pct > 0 ? Math.min(100, Math.max(4, step.pct)) : 0}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TOOL PERFORMANCE TABLE */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-foreground">
          Performa Per Tool Assessment
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="border-b border-border/80 text-muted uppercase font-bold text-[10px]">
              <tr>
                <th className="py-2.5 pr-4">Nama Tool</th>
                <th className="py-2.5 px-3 text-center">Mulai</th>
                <th className="py-2.5 px-3 text-center">Selesai</th>
                <th className="py-2.5 px-3 text-center">Completion Rate</th>
                <th className="py-2.5 pl-3 text-right">WA Leads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {toolStats.map((t) => (
                <tr key={t.id} className="hover:bg-section/40">
                  <td className="py-3 pr-4 font-semibold text-foreground capitalize">
                    {t.id.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-3 text-center text-muted">{t.starts}</td>
                  <td className="py-3 px-3 text-center text-muted">{t.completions}</td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                        t.rate >= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : t.rate >= 40
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-section text-muted'
                      }`}
                    >
                      {t.rate}%
                    </span>
                  </td>
                  <td className="py-3 pl-3 text-right font-bold text-teal-brand">
                    {t.wa > 0 ? `💬 ${t.wa}` : '0'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRAFFIC SOURCE BREAKDOWN */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <PieChart className="w-4 h-4 text-teal-brand" />
          Sumber Traffic (UTM / Saluran Masuk)
        </h3>

        <div className="overflow-x-auto">
          {trafficSources.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted">
              Belum ada data traffic kunjungan tercatat pada browser ini.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border/80 text-muted uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 pr-4">Channel (Source)</th>
                  <th className="py-2.5 px-3 text-center">Visitors</th>
                  <th className="py-2.5 px-3 text-center">Tool Starts</th>
                  <th className="py-2.5 pl-3 text-right">WA Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {trafficSources.map(([src, stat]) => (
                  <tr key={src} className="hover:bg-section/40">
                    <td className="py-2.5 pr-4 font-semibold text-foreground uppercase tracking-wide">
                      {src}
                    </td>
                    <td className="py-2.5 px-3 text-center text-muted">{stat.visitors}</td>
                    <td className="py-2.5 px-3 text-center text-muted">{stat.starts}</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-teal-brand">
                      {stat.waClicks > 0 ? `💬 ${stat.waClicks}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CAMPAIGN & AD CONTENT BREAKDOWN */}
      <div className="bg-card border border-border rounded-card-lg p-5 sm:p-6 shadow-soft space-y-4">
        <div className="flex items-center justify-between gap-2 border-b border-border/80 pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-brand" />
            <span>Performa Kampanye &amp; Iklan (UTM Campaign &amp; Content)</span>
          </h3>
          <span className="text-[10px] text-muted font-medium bg-section px-2.5 py-0.5 rounded-full">
            A/B Test Creative
          </span>
        </div>

        <div className="overflow-x-auto">
          {campaignStats.length === 0 ? (
            <div className="py-6 text-center text-xs text-muted">
              Belum ada data parameter kampanye (utm_campaign) yang tercatat.
            </div>
          ) : (
            <table className="w-full text-xs text-left">
              <thead className="border-b border-border/80 text-muted uppercase font-bold text-[10px]">
                <tr>
                  <th className="py-2.5 pr-4">Nama Kampanye</th>
                  <th className="py-2.5 px-3">Ad Creative (Content)</th>
                  <th className="py-2.5 px-3 text-center">Visitors</th>
                  <th className="py-2.5 px-3 text-center">Starts</th>
                  <th className="py-2.5 pl-3 text-right">WA Clicks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {campaignStats.map((c) => (
                  <tr key={c.campaign} className="hover:bg-section/40">
                    <td className="py-2.5 pr-4 font-semibold text-foreground">
                      {c.campaign}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-muted">
                      {c.contents}
                    </td>
                    <td className="py-2.5 px-3 text-center text-muted">{c.visitors}</td>
                    <td className="py-2.5 px-3 text-center text-muted">{c.starts}</td>
                    <td className="py-2.5 pl-3 text-right font-bold text-teal-brand">
                      {c.waClicks > 0 ? `💬 ${c.waClicks}` : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
