'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Wind, AlertTriangle, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import { ErrorPanel, LoadingPanel, EmptyPanel } from '@/components/StatePanel';

export default function AirPollutionPage() {
  const { cities, loading: citiesLoading } = useCities();
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const { t, formatNumber, tApi } = useLanguage();

  const fetchAirData = async (cityName: string) => {
    if (!cityName) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await api.get(`/pollution/air?city=${encodeURIComponent(cityName)}`);
      if (response.data.status === 200) {
        setData(response.data.data);
      } else {
        setError(response.data.message || t('errors.fetchError'));
      }
    } catch (err: any) {
      if (err.response?.status === 404) {
        setError(t('errors.cityNotFound'));
      } else {
        setError(t('errors.fetchError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    fetchAirData(cityName);
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'from-emerald-500 to-teal-400';
    if (aqi <= 100) return 'from-yellow-400 to-amber-500';
    if (aqi <= 150) return 'from-orange-500 to-orange-400';
    if (aqi <= 200) return 'from-red-500 to-rose-400';
    return 'from-purple-600 to-purple-400';
  };

  return (
    <div className="page-shell">
      <PageHeader title={t('pollution.airTitle')} subtitle={t('pollution.airSubtitle')} icon={Wind} iconTone="text-sky-500" badge="Air Module" />

      <section className="card space-y-4">
        <label className="text-sm font-semibold text-foreground">{t('pollution.airPlaceholder')}</label>
        <CitySelect cities={cities} loading={citiesLoading} value={selectedCity} onChange={handleCityChange} placeholder={t('pollution.airPlaceholder')} accentColor="primary" />
      </section>

      {loading ? <LoadingPanel message="Analyzing city air quality…" /> : null}
      {error && !loading ? <ErrorPanel message={error} /> : null}
      {!loading && !error && !data && selectedCity ? (
        <EmptyPanel title="No data available" description="Try selecting another city to view air quality metrics." />
      ) : null}

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="card md:col-span-2 border-t-4 border-t-sky-500">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> {t('pollution.aqiHeader')}
              </h3>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getAqiColor(data.aqi)}`}>
                  {formatNumber(data.aqi)}
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-4 py-2 text-sm font-semibold text-foreground">
                  {tApi(data.classification)}
                </span>
              </div>
              <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.min(data.aqi, 500) / 500) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getAqiColor(data.aqi)}`}
                />
              </div>
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>{formatNumber(0)}</span>
                <span>{formatNumber(100)}</span>
                <span>{formatNumber(300)}+</span>
                <span>{formatNumber(500)}</span>
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('pollution.cigaretteEq')}</h3>
              <p className="mt-2 text-4xl font-black">{formatNumber(data.cigaretteEquivalent)}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('pollution.cigaretteEqDesc')}</p>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('pollution.lifespanRed')}</h3>
              <p className="mt-2 text-4xl font-black">{formatNumber(data.lifespanReductionHours)} {t('pollution.hoursPerDay')}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t('pollution.lifespanRedDesc')}</p>
            </div>

            <div className="card md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" /> {t('pollution.primaryPollutant')}
              </h3>
              <p className="mt-3 text-2xl font-bold">{tApi(data.mainCause)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
