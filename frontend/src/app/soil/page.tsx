'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { MountainSnow, Sprout, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import { ErrorPanel, LoadingPanel, EmptyPanel } from '@/components/StatePanel';

export default function SoilPollutionPage() {
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
      const response = await api.get(`/pollution/soil?city=${encodeURIComponent(cityName)}`);
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

  return (
    <div className="page-shell">
      <PageHeader title={t('pollution.soilTitle')} subtitle={t('pollution.soilSubtitle')} icon={MountainSnow} iconTone="text-amber-500" badge="Soil Module" />

      <section className="card space-y-4">
        <label className="text-sm font-semibold text-foreground">{t('pollution.soilPlaceholder')}</label>
        <CitySelect cities={cities} loading={citiesLoading} value={selectedCity} onChange={handleCityChange} placeholder={t('pollution.soilPlaceholder')} accentColor="primary" />
      </section>

      {loading ? <LoadingPanel message="Analyzing soil degradation…" /> : null}
      {error && !loading ? <ErrorPanel message={error} /> : null}
      {!loading && !error && !data && selectedCity ? (
        <EmptyPanel title="No soil metrics found" description="Choose another city to inspect land and crop impact." />
      ) : null}

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="card border-t-4 border-t-amber-500">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('pollution.degradationIndex')}</h3>
              <p className="mt-2 text-4xl font-black">{formatNumber(data.degradationIndex)} / {formatNumber(10)}</p>
              <div className="mt-4 w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(data.degradationIndex / 10) * 100}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-3 bg-gradient-to-r from-amber-500 to-orange-500"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <Sprout className="w-4 h-4" /> {t('pollution.cropDamage')}
              </h3>
              <p className="mt-2 text-2xl font-bold">{tApi(data.cropDamageEstimation)}</p>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> {t('pollution.foodContamination')}
              </h3>
              <p className={`mt-2 text-2xl font-bold ${
                data.foodContaminationRisk.includes('High') ? 'text-red-500' : data.foodContaminationRisk.includes('Medium') ? 'text-orange-500' : 'text-emerald-500'
              }`}>
                {tApi(data.foodContaminationRisk)}
              </p>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('pollution.environmentalImpact')}</h3>
              <p className={`mt-2 text-2xl font-bold ${
                data.environmentalImpactScore === 'Critical' ? 'text-red-500' : data.environmentalImpactScore === 'Warning' ? 'text-orange-500' : 'text-emerald-500'
              }`}>
                {tApi(data.environmentalImpactScore)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
