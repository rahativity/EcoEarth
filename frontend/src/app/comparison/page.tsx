'use client';

import { useState, useEffect, Suspense } from 'react';
import api from '@/lib/api';
import { BarChart2, ShieldCheck, ArrowRightLeft, AlertCircle, TrendingDown, Wind, Droplets, MountainSnow, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';
import { useSearchParams } from 'next/navigation';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

function ComparisonContent() {
  const { cities, loading: citiesLoading } = useCities();
  const searchParams = useSearchParams();
  const type = searchParams.get('type') || 'air';

  const [city1, setCity1] = useState('');
  const [city2, setCity2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const { t, formatNumber, tApi, language } = useLanguage();

  // Reset comparison data if query type changes but retain selected cities
  useEffect(() => {
    if (city1 && city2) {
      handleCompare();
    }
  }, [type]);

  const handleCompare = async () => {
    if (!city1 || !city2) return;
    if (city1 === city2) {
      setError(t('errors.selectDifferent'));
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await api.get(`/pollution/compare?city1=${encodeURIComponent(city1)}&city2=${encodeURIComponent(city2)}`);
      if (response.data.status === 200) {
        setData(response.data.data);
      } else {
        setError(response.data.message || t('errors.compareError'));
      }
    } catch (err: any) {
      setError(t('errors.compareError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSwap = () => {
    const temp = city1;
    setCity1(city2);
    setCity2(temp);
    if (data) {
      setData({
        ...data,
        city1: data.city2,
        city2: data.city1,
        city1Score: data.city2Score,
        city2Score: data.city1Score,
        city1RiskLevel: data.city2RiskLevel,
        city2RiskLevel: data.city1RiskLevel,
      });
    }
  };

  const getChartData = () => {
    if (!data) return [];
    
    return [
      {
        subject: t('charts.radarAir'),
        [data.city1.name]: Math.min(100, Math.round((data.city1.aqi / 300) * 100)),
        [data.city2.name]: Math.min(100, Math.round((data.city2.aqi / 300) * 100)),
      },
      {
        subject: t('charts.radarWater'),
        [data.city1.name]: Math.round(data.city1.waterContaminationLevel),
        [data.city2.name]: Math.round(data.city2.waterContaminationLevel),
      },
      {
        subject: t('charts.radarSoil'),
        [data.city1.name]: Math.round(data.city1.soilDegradationIndex * 10),
        [data.city2.name]: Math.round(data.city2.soilDegradationIndex * 10),
      },
      {
        subject: t('charts.radarSound'),
        [data.city1.name]: Math.max(0, Math.min(100, Math.round(((data.city1.noiseLevel - 30) / 90) * 100))),
        [data.city2.name]: Math.max(0, Math.min(100, Math.round(((data.city2.noiseLevel - 30) / 90) * 100))),
      },
    ];
  };

  const getBarChartData = () => {
    if (!data) return [];
    if (type === 'air') {
      return [
        {
          name: t('pollution.airTitle'),
          [data.city1.name]: data.city1.aqi,
          [data.city2.name]: data.city2.aqi,
        },
        {
          name: t('pollution.cigaretteEq'),
          [data.city1.name]: Math.round(data.city1.cigaretteEquivalent * 10),
          [data.city2.name]: Math.round(data.city2.cigaretteEquivalent * 10),
        }
      ];
    }
    if (type === 'water') {
      return [
        {
          name: t('pollution.contaminationLevel'),
          [data.city1.name]: Math.round(data.city1.waterContaminationLevel),
          [data.city2.name]: Math.round(data.city2.waterContaminationLevel),
        }
      ];
    }
    if (type === 'soil') {
      return [
        {
          name: t('pollution.degradationIndex'),
          [data.city1.name]: Math.round(data.city1.soilDegradationIndex * 10),
          [data.city2.name]: Math.round(data.city2.soilDegradationIndex * 10),
        }
      ];
    }
    if (type === 'sound') {
      return [
        {
          name: t('pollution.noiseLevel'),
          [data.city1.name]: Math.round(data.city1.noiseLevel),
          [data.city2.name]: Math.round(data.city2.noiseLevel),
        }
      ];
    }
    return [];
  };

  const translateInsight = (insight: string): string => {
    if (language !== 'bn') return insight;
    
    if (insight.includes("has significantly higher air pollution than")) {
      const parts = insight.split("has significantly higher air pollution than");
      const c1 = parts[0]?.trim() || '';
      const c2 = parts[1]?.replace('.', '')?.trim() || '';
      return `${tApi(c1)}-এর বায়ু দূষণের মাত্রা ${tApi(c2)}-এর চেয়ে উল্লেখযোগ্যভাবে বেশি।`;
    }
    if (insight.includes("Both cities have comparable air quality levels.")) {
      return "উভয় শহরের বাতাসের মান তুলনামূলকভাবে কাছাকাছি।";
    }
    if (insight.includes("Water contamination in") && insight.includes("is notably worse.")) {
      const city = insight.replace("Water contamination in", "").replace("is notably worse.", "").trim();
      return `${tApi(city)}-এর পানির দূষণ লক্ষণীয়ভাবে বেশি ক্ষতিকর।`;
    }
    if (insight.includes("Water contamination levels are relatively balanced between the two cities.")) {
      return "উভয় শহরের পানির দূষণের মাত্রা প্রায় সমান।";
    }
    if (insight.includes("Sound pollution in both cities exceeds safe urban limits.")) {
      return "উভয় শহরের শব্দ দূষণ নিরাপদ শহুরে সহনশীলতার সীমা অতিক্রম করেছে।";
    }
    if (insight.includes("is a much noisier city compared to")) {
      const parts = insight.split("is a much noisier city compared to");
      const c1 = parts[0]?.trim() || '';
      const c2 = parts[1]?.replace('.', '')?.trim() || '';
      return `${tApi(c1)} শহরটি ${tApi(c2)}-এর তুলনায় অনেক বেশি কোলাহলপূর্ণ।`;
    }
    return insight;
  };

  const getPageHeaderIcon = () => {
    if (type === 'water') return <Droplets className="mr-3 text-blue-500 w-10 h-10" />;
    if (type === 'soil') return <MountainSnow className="mr-3 text-amber-500 w-10 h-10" />;
    if (type === 'sound') return <Volume2 className="mr-3 text-emerald-500 w-10 h-10" />;
    return <Wind className="mr-3 text-sky-400 w-10 h-10" />;
  };

  const getPageHeaderGradient = () => {
    if (type === 'water') return 'from-blue-400 to-indigo-500';
    if (type === 'soil') return 'from-amber-400 to-orange-500';
    if (type === 'sound') return 'from-emerald-400 to-teal-500';
    return 'from-sky-400 to-blue-500';
  };

  const getActiveSectorName = () => {
    if (type === 'water') return t('comparison_menu.water');
    if (type === 'soil') return t('comparison_menu.soil');
    if (type === 'sound') return t('comparison_menu.sound');
    return t('comparison_menu.air');
  };

  const getFilteredInsights = (comments: string[]) => {
    if (!comments) return [];
    return comments.filter((comment) => {
      const lower = comment.toLowerCase();
      if (type === 'air') return lower.includes('air') || lower.includes('aqi') || lower.includes('polluted');
      if (type === 'water') return lower.includes('water') || lower.includes('contamination');
      if (type === 'soil') return lower.includes('soil') || lower.includes('degradation');
      if (type === 'sound') return lower.includes('sound') || lower.includes('noise') || lower.includes('noisier');
      return true;
    });
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400';
    if (aqi <= 100) return 'text-yellow-400';
    if (aqi <= 150) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      
      {/* Dynamic Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center">
          {getPageHeaderIcon()}
          <h1 className={`text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${getPageHeaderGradient()} tracking-tight`}>
            {t('comparison_menu.title')} &mdash; {getActiveSectorName()}
          </h1>
        </div>
        <p className="text-lg text-muted-foreground mt-3">{t('comparison.subtitle')}</p>
      </motion.div>

      {/* Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
        <div className="md:col-span-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{t('comparison.city1Label')}</label>
          <CitySelect
            cities={cities}
            loading={citiesLoading}
            value={city1}
            onChange={(val) => setCity1(val)}
            placeholder={t('comparison.city1Placeholder')}
            accentColor="primary"
          />
        </div>

        <div className="flex justify-center md:col-span-1 pt-6">
          <button
            onClick={handleSwap}
            disabled={!city1 || !city2}
            className="p-3.5 rounded-full bg-muted border border-border hover:border-primary/50 text-foreground transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed group shadow-md hover:shadow-lg focus:outline-none"
            title={t('buttons.swapTitle')}
          >
            <ArrowRightLeft className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
        </div>

        <div className="md:col-span-3">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 block">{t('comparison.city2Label')}</label>
          <CitySelect
            cities={cities}
            loading={citiesLoading}
            value={city2}
            onChange={(val) => setCity2(val)}
            placeholder={t('comparison.city2Placeholder')}
            accentColor="accent"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleCompare}
          disabled={!city1 || !city2 || loading}
          className="px-8 py-3.5 rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2 focus:outline-none"
        >
          {loading ? t('buttons.comparing') : t('buttons.compare')}
        </button>
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      <AnimatePresence>
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center">
              <AlertCircle className="w-5 h-5 mr-3 shrink-0" />
              {error}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -25 }}
            className="space-y-10 mt-8"
          >
            
            {/* Dynamic Comparison Pivot Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* City 1 Specific Metrics */}
              <motion.div className="card border-t-4 border-t-teal-500 relative overflow-hidden bg-card hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-foreground">{tApi(data.city1.name)}</h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{tApi(data.city1.country)}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-full">
                      {t('comparison.overallScore')}: {formatNumber(data.city1Score)}
                    </span>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Pollution Sector Metrics Details */}
                  {type === 'air' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.aqiHeader')}</span>
                        <span className={`text-4xl font-black ${getAqiColor(data.city1.aqi)}`}>
                          {formatNumber(data.city1.aqi)}
                        </span>
                        <span className="text-xs font-bold block mt-1 text-muted-foreground">({tApi(data.city1.airClassification || 'Moderate')})</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.cigaretteEq')}</span>
                        <span className="text-2xl font-extrabold text-foreground">{formatNumber(data.city1.cigaretteEquivalent)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.lifespanRed')}</span>
                        <span className="text-2xl font-extrabold text-foreground">{formatNumber(data.city1.lifespanReductionHours)} {t('pollution.hoursPerDay')}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.primaryPollutant')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city1.mainCause)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'water' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.contaminationLevel')}</span>
                        <span className="text-4xl font-black text-blue-400">
                          {formatNumber(data.city1.waterContaminationLevel)}%
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: `${data.city1.waterContaminationLevel}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.healthRisk')}</span>
                        <span className={`text-2xl font-extrabold ${data.city1.healthRiskLevel === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tApi(data.city1.healthRiskLevel)} {t('pollution.riskSuffix')}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.equivalentExposure')}</span>
                        <span className="text-base font-semibold text-foreground mt-1 block">{tApi(data.city1.equivalentExposure)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.mainContaminant')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city1.mainContaminant)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'soil' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.degradationIndex')}</span>
                        <span className="text-4xl font-black text-amber-500">
                          {formatNumber(data.city1.soilDegradationIndex)} <span className="text-lg text-muted-foreground">/ 10</span>
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.city1.soilDegradationIndex * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.cropDamage')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city1.cropDamageEstimation)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.foodContamination')}</span>
                        <span className={`text-xl font-bold ${data.city1.foodContaminationRisk === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tApi(data.city1.foodContaminationRisk)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.environmentalImpact')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city1.environmentalImpactScore)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'sound' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.noiseLevel')}</span>
                        <span className="text-4xl font-black text-emerald-400">
                          {formatNumber(data.city1.noiseLevel)} <span className="text-base text-muted-foreground">{t('pollution.db')}</span>
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(data.city1.noiseLevel, 120) / 120 * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.noiseLevel')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city1.noiseCategory)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.recommendedExposure')}</span>
                        <span className="text-base font-semibold text-foreground mt-1 block">{tApi(data.city1.recommendedExposureDuration)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.mainNoiseCause')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city1.mainCause)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* City 2 Specific Metrics */}
              <motion.div className="card border-t-4 border-t-emerald-500 relative overflow-hidden bg-card hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-foreground">{tApi(data.city2.name)}</h3>
                      <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mt-1">{tApi(data.city2.country)}</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-full">
                      {t('comparison.overallScore')}: {formatNumber(data.city2Score)}
                    </span>
                  </div>

                  <div className="h-px bg-border/60" />

                  {/* Pollution Sector Metrics Details */}
                  {type === 'air' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.aqiHeader')}</span>
                        <span className={`text-4xl font-black ${getAqiColor(data.city2.aqi)}`}>
                          {formatNumber(data.city2.aqi)}
                        </span>
                        <span className="text-xs font-bold block mt-1 text-muted-foreground">({tApi(data.city2.airClassification || 'Moderate')})</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.cigaretteEq')}</span>
                        <span className="text-2xl font-extrabold text-foreground">{formatNumber(data.city2.cigaretteEquivalent)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.lifespanRed')}</span>
                        <span className="text-2xl font-extrabold text-foreground">{formatNumber(data.city2.lifespanReductionHours)} {t('pollution.hoursPerDay')}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.primaryPollutant')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city2.mainCause)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'water' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.contaminationLevel')}</span>
                        <span className="text-4xl font-black text-blue-400">
                          {formatNumber(data.city2.waterContaminationLevel)}%
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-blue-400 h-full rounded-full" style={{ width: `${data.city2.waterContaminationLevel}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.healthRisk')}</span>
                        <span className={`text-2xl font-extrabold ${data.city2.healthRiskLevel === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tApi(data.city2.healthRiskLevel)} {t('pollution.riskSuffix')}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.equivalentExposure')}</span>
                        <span className="text-base font-semibold text-foreground mt-1 block">{tApi(data.city2.equivalentExposure)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.mainContaminant')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city2.mainContaminant)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'soil' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.degradationIndex')}</span>
                        <span className="text-4xl font-black text-amber-500">
                          {formatNumber(data.city2.soilDegradationIndex)} <span className="text-lg text-muted-foreground">/ 10</span>
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${data.city2.soilDegradationIndex * 10}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.cropDamage')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city2.cropDamageEstimation)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.foodContamination')}</span>
                        <span className={`text-xl font-bold ${data.city2.foodContaminationRisk === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {tApi(data.city2.foodContaminationRisk)}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.environmentalImpact')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city2.environmentalImpactScore)}</span>
                      </div>
                    </div>
                  )}

                  {type === 'sound' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.noiseLevel')}</span>
                        <span className="text-4xl font-black text-emerald-400">
                          {formatNumber(data.city2.noiseLevel)} <span className="text-base text-muted-foreground">{t('pollution.db')}</span>
                        </span>
                        <div className="w-full bg-muted rounded-full h-2 mt-2 overflow-hidden">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${Math.min(data.city2.noiseLevel, 120) / 120 * 100}%` }} />
                        </div>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.noiseLevel')}</span>
                        <span className="text-xl font-bold text-foreground">{tApi(data.city2.noiseCategory)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.recommendedExposure')}</span>
                        <span className="text-base font-semibold text-foreground mt-1 block">{tApi(data.city2.recommendedExposureDuration)}</span>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider block">{t('pollution.mainNoiseCause')}</span>
                        <span className="text-lg font-bold text-foreground mt-1 block">{tApi(data.city2.mainCause)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

            </div>

            {/* Smart Insights Panel */}
            {getFilteredInsights(data.intelligentComments).length > 0 && (
              <motion.div className="card p-0 overflow-hidden border-teal-500/10 hover:border-teal-500/30 transition-all duration-300">
                <div className="px-8 py-6 border-b border-border bg-teal-500/5">
                  <h3 className="text-xl font-bold text-foreground flex items-center">
                    <TrendingDown className="w-6 h-6 mr-3 text-teal-400" /> {t('comparison.insights')}
                  </h3>
                </div>
                <div className="px-8 py-6 space-y-4">
                  {getFilteredInsights(data.intelligentComments).map((comment: string, idx: number) => (
                    <div key={idx} className="flex items-start space-x-3 text-base text-foreground/90 font-medium">
                      <span className="text-teal-400 mt-1 shrink-0 font-bold">•</span>
                      <p>{translateInsight(comment)}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Multivariate Radar Comparison Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div className="card h-[400px] flex flex-col justify-between">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">{t('charts.radarTitle')}</h3>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={getChartData()}>
                      <PolarGrid stroke="var(--border)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted-foreground)' }} />
                      <Radar name={tApi(data.city1.name)} dataKey={data.city1.name} stroke="#14b8a6" fill="#14b8a6" fillOpacity={0.3} />
                      <Radar name={tApi(data.city2.name)} dataKey={data.city2.name} stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>

              <motion.div className="card h-[400px] flex flex-col justify-between">
                <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-4">{t('charts.barTitle')}</h3>
                <div className="flex-1 w-full min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarChartData()}>
                      <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)' }} />
                      <Legend />
                      <Bar dataKey={data.city1.name} fill="#14b8a6" radius={[4, 4, 0, 0]} name={tApi(data.city1.name)} />
                      <Bar dataKey={data.city2.name} fill="#10b981" radius={[4, 4, 0, 0]} name={tApi(data.city2.name)} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[50vh]">
        <svg className="animate-spin h-10 w-10 text-teal-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    }>
      <ComparisonContent />
    </Suspense>
  );
}
