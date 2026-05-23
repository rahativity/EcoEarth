'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Volume2, AlertCircle, ShieldAlert, Activity, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';

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
    fetchData(cityName);
  };

  const getNoiseColor = (db: number) => {
    if (db <= 55) return 'from-emerald-500 to-teal-400';
    if (db <= 70) return 'from-yellow-400 to-amber-500';
    if (db <= 85) return 'from-orange-500 to-orange-400';
    return 'from-red-500 to-rose-400';
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 flex items-center tracking-tight mb-4">
          <Volume2 className="mr-3 text-emerald-500 w-10 h-10" />
          {t('pollution.soundTitle')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('pollution.soundSubtitle')}</p>
      </motion.div>

      <CitySelect
        cities={cities}
        loading={citiesLoading}
        value={selectedCity}
        onChange={handleCityChange}
        placeholder={t('pollution.soundPlaceholder')}
        accentColor="primary"
      />

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-10 w-10 text-emerald-500" fill="none" viewBox="0 0 24 24">
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <motion.div className="card md:col-span-2 border-t-4 border-t-emerald-500">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
                <Volume2 className="w-4 h-4 mr-2" /> {t('pollution.noiseLevel')}
              </h3>
              
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
                <div className="flex items-end">
                  <span className={`text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getNoiseColor(data.noiseLevel)}`}>
                    {formatNumber(data.noiseLevel)}
                  </span>
                  <span className="text-2xl font-bold ml-1 text-muted-foreground"> {t('pollution.db')}</span>
                </div>
                <div className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg
                  ${data.noiseLevel <= 55 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                    data.noiseLevel <= 70 ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                    data.noiseLevel <= 85 ? 'bg-orange-500/20 text-orange-400 border border-orange-500/50' :
                    'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
                  {tApi(data.noiseCategory)}
                </div>
              </div>

              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(data.noiseLevel, 120) / 120 * 100}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${getNoiseColor(data.noiseLevel)} relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                <span>{formatNumber(0)} {t('pollution.db')}</span>
                <span>{formatNumber(60)} {t('pollution.db')} ({t('pollution.normal')})</span>
                <span>{formatNumber(85)} {t('pollution.db')} ({t('pollution.high')})</span>
                <span>{formatNumber(120)} {t('pollution.db')} ({t('pollution.danger')})</span>
              </div>
            </motion.div>

            <motion.div className="card hover:border-emerald-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                <Activity className="w-4 h-4 mr-2 text-emerald-400" /> {t('pollution.healthImpact')}
              </h3>
              <div className="text-lg font-semibold text-foreground leading-relaxed mt-2 group-hover:text-emerald-400 transition-colors">
                {tApi(data.healthImpactEstimation)}
              </div>
            </motion.div>

            <motion.div className="card hover:border-blue-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-blue-400" /> {t('pollution.recommendedExposure')}
              </h3>
              <div className="text-lg font-semibold text-foreground mt-2 group-hover:text-blue-400 transition-colors">
                {tApi(data.recommendedExposureDuration)}
              </div>
            </motion.div>

            <motion.div className="card md:col-span-2 hover:border-amber-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-2 text-amber-400" /> {t('pollution.mainNoiseCause')}
              </h3>
              <div className="text-2xl font-bold text-foreground mt-2 group-hover:text-amber-400 transition-colors">
                {tApi(data.mainCause)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
