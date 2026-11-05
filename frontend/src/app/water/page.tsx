'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Droplets, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';
import PageHeader from '@/components/PageHeader';
import { ErrorPanel, LoadingPanel, EmptyPanel } from '@/components/StatePanel';

export default function WaterPollutionPage() {
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
      const response = await api.get(`/pollution/water?city=${encodeURIComponent(cityName)}`);
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
      <PageHeader title={t('pollution.waterTitle')} subtitle={t('pollution.waterSubtitle')} icon={Droplets} iconTone="text-blue-500" badge="Water Module" />

      <section className="card space-y-4">
        <label className="text-sm font-semibold text-foreground">{t('pollution.waterPlaceholder')}</label>
        <CitySelect cities={cities} loading={citiesLoading} value={selectedCity} onChange={handleCityChange} placeholder={t('pollution.waterPlaceholder')} accentColor="accent" />
      </section>

      {loading ? <LoadingPanel message="Evaluating water contamination…" /> : null}
      {error && !loading ? <ErrorPanel message={error} /> : null}
      {!loading && !error && !data && selectedCity ? (
        <EmptyPanel title="No water profile found" description="Try another city to compare contamination and health risk." />
      ) : null}

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="card border-t-4 border-t-blue-500">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{t('pollution.contaminationLevel')}</h3>
              <p className="mt-2 text-4xl font-black">{formatNumber(data.contaminationLevel)}%</p>
              <div className="mt-4 w-full bg-muted rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.contaminationLevel}%` }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                  className="h-3 bg-gradient-to-r from-blue-500 to-indigo-500"
                />
              </div>
            </div>

            <div className="card">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" /> {t('pollution.healthRisk')}
              </h3>
              <p className={`mt-2 text-3xl font-black ${
                data.healthRiskLevel === 'High' ? 'text-red-500' : data.healthRiskLevel === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
              }`}>
                {tApi(data.healthRiskLevel)} {t('pollution.riskSuffix')}
              </p>
            </div>

            <div className="card md:col-span-2 border-t-4 border-t-muted-foreground">
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground flex items-center gap-2">
                <Activity className="w-4 h-4" /> {t('pollution.exposureInfo')}
              </h3>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('pollution.equivalentExposure')}</p>
                  <p className="text-lg font-semibold mt-1">{tApi(data.equivalentExposure)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('pollution.mainContaminant')}</p>
                  <p className="text-lg font-semibold mt-1">{tApi(data.mainContaminant)}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
