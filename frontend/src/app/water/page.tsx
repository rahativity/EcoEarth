'use client';

import { useState } from 'react';
import api from '@/lib/api';
import { Droplets, AlertCircle, ShieldAlert, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';

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

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center tracking-tight mb-4">
          <Droplets className="mr-3 text-blue-500 w-10 h-10" />
          {t('pollution.waterTitle')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('pollution.waterSubtitle')}</p>
      </motion.div>

      <CitySelect
        cities={cities}
        loading={citiesLoading}
        value={selectedCity}
        onChange={handleCityChange}
        placeholder={t('pollution.waterPlaceholder')}
        accentColor="accent"
      />

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24">
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
            <motion.div className="card border-t-4 border-t-blue-500">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1">{t('pollution.contaminationLevel')}</h3>
              <div className="text-4xl font-black text-foreground mb-2">{formatNumber(data.contaminationLevel)}%</div>
              <div className="w-full bg-muted rounded-full h-3 mt-4 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${data.contaminationLevel}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full relative"
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
            </motion.div>

            <motion.div className="card">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-1 flex items-center">
                <ShieldAlert className="w-4 h-4 mr-1 text-muted-foreground" /> {t('pollution.healthRisk')}
              </h3>
              <div className={`text-3xl font-black mt-2 ${
                data.healthRiskLevel === 'High' ? 'text-red-500' :
                data.healthRiskLevel === 'Medium' ? 'text-orange-500' : 'text-emerald-500'
              }`}>
                {tApi(data.healthRiskLevel)} {t('pollution.riskSuffix')}
              </div>
            </motion.div>

            <motion.div className="card border-t-4 border-t-muted-foreground md:col-span-2">
              <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
                <Activity className="w-4 h-4 mr-1 text-muted-foreground" /> {t('pollution.exposureInfo')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('pollution.equivalentExposure')}</p>
                  <p className="text-lg font-semibold text-foreground">{tApi(data.equivalentExposure)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('pollution.mainContaminant')}</p>
                  <p className="text-lg font-semibold text-foreground">{tApi(data.mainContaminant)}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
