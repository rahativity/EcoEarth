'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Volume2, ShieldAlert, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import { ErrorPanel, LoadingPanel, EmptyPanel } from '@/components/StatePanel';

export default function SoundPollutionPage() {
  const { cities, loading: citiesLoading } = useCities();
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const { t, formatNumber, tApi } = useLanguage();

  const fetchData = async (cityName: string) => {
    if (!cityName) return;

    setLoading(true);
    setError('');
    setData(null);

    try {
      const response = await api.get(`/pollution/sound?city=${encodeURIComponent(cityName)}`);
      if (response.data.status === 200) setData(response.data.data);
      else setError(response.data.message || t('errors.fetchError'));
    } catch (err: any) {
      if (err.response?.status === 404) setError(t('errors.cityNotFound'));
      else setError(t('errors.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    fetchData(cityName);
  };

  const getNoiseColor = (db: number) => {
    if (db <= 55) return 'from-emerald-500 to-teal-400';
    if (db <= 70) return 'from-yellow-400 to-amber-500';
    if (db <= 85) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-rose-400';
  };

  return (
    <div className="page-shell">
      <PageHeader title={t('pollution.soundTitle')} subtitle={t('pollution.soundSubtitle')} icon={Volume2} iconTone="text-emerald-500" badge="Sound Module" />

      <section className="card space-y-4">
        <label className="text-sm font-semibold text-foreground">{t('pollution.soundPlaceholder')}</label>
        <CitySelect cities={cities} loading={citiesLoading} value={selectedCity} onChange={handleCityChange} placeholder={t('pollution.soundPlaceholder')} accentColor="primary" />
      </section>

      {loading ? <LoadingPanel message="Measuring urban noise profile…" /> : null}
      {error && !loading ? <ErrorPanel message={error} /> : null}
      {!loading && !error && !data && selectedCity ? (
        <EmptyPanel title="No sound data available" description="Choose another city to inspect noise and exposure recommendations." />
      ) : null}

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="card md:col-span-2 border-t-4 border-t-emerald-500">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <Volume2 className="w-4 h-4" /> {t('pollution.noiseLevel')}
              </h3>
              <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getNoiseColor(data.noiseLevel)}`}>
                  {formatNumber(data.noiseLevel)}
                  <span className="text-2xl text-muted-foreground ml-1">{t('pollution.db')}</span>
                </span>
                <span className="rounded-full border border-border/70 bg-muted/40 px-4 py-2 text-sm font-semibold">{tApi(data.noiseCategory)}</span>
              </div>
              <div className="mt-5 h-3 w-full bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(Math.min(data.noiseLevel, 120) / 120) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${getNoiseColor(data.noiseLevel)}`}
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> {t('pollution.healthImpact')}
              </h3>
              <p className="mt-2 text-lg font-semibold">{tApi(data.healthImpactEstimation)}</p>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> {t('pollution.recommendedExposure')}
              </h3>
              <p className="mt-2 text-lg font-semibold">{tApi(data.recommendedExposureDuration)}</p>
            </div>

            <div className="card md:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-500" /> {t('pollution.mainNoiseCause')}
              </h3>
              <p className="mt-3 text-2xl font-bold">{tApi(data.mainCause)}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
