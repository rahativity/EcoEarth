'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Wind, AlertTriangle, Activity, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CitySelect from '@/components/CitySelect';
import { useCities } from '@/lib/useCities';
import { useLanguage } from '@/components/LanguageProvider';

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
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-500 flex items-center tracking-tight mb-4">
          <Wind className="mr-3 text-sky-400 w-10 h-10" />
          {t('pollution.airTitle')}
        </h1>
        <p className="text-lg text-muted-foreground">{t('pollution.airSubtitle')}</p>
      </motion.div>

      <CitySelect
        cities={cities}
        loading={citiesLoading}
        value={selectedCity}
        onChange={handleCityChange}
        placeholder={t('pollution.airPlaceholder')}
        accentColor="primary"
      />

      {loading && (
        <div className="flex justify-center py-12">
          <svg className="animate-spin h-10 w-10 text-sky-500" fill="none" viewBox="0 0 24 24">
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
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl flex items-center mt-4">
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
            transition={{ duration: 0.5, staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8"
          >
            <motion.div className="card md:col-span-2 relative overflow-hidden group border-t-4 border-t-sky-500">
              <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-blue-500/5 z-0 pointer-events-none"></div>
              <div className="relative z-10">
                <h3 className="text-muted-foreground text-sm font-bold uppercase tracking-widest mb-4 flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> {t('pollution.aqiHeader')}
                </h3>
                
                <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
                  <div className="flex items-end">
                    <span className={`text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r ${getAqiColor(data.aqi)}`}>
                      {formatNumber(data.aqi)}
                    </span>
                  </div>
                  <div className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg
                    ${data.classification === 'Good' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' :
                      data.classification === 'Moderate' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                      data.classification === 'Hazardous' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                      'bg-orange-500/20 text-orange-400 border border-orange-500/50'}`}>
                    {tApi(data.classification)}
                  </div>
                </div>

                <div className="h-4 w-full bg-muted rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(data.aqi, 500) / 500 * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${getAqiColor(data.aqi)} relative`}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                  </motion.div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-3 font-medium">
                  <span>{formatNumber(0)} ({t('api.good')})</span>
                  <span>{formatNumber(100)} ({t('api.moderate')})</span>
                  <span>{formatNumber(300)}+ ({t('api.hazardous')})</span>
                  <span>{formatNumber(500)} ({t('pollution.max')})</span>
                </div>
              </div>
            </motion.div>

            <motion.div className="card hover:border-sky-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                {t('pollution.cigaretteEq')}
              </h3>
              <div className="text-4xl font-black text-foreground mb-2 group-hover:text-sky-400 transition-colors">
                {formatNumber(data.cigaretteEquivalent)}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('pollution.cigaretteEqDesc')}</p>
            </motion.div>

            <motion.div className="card hover:border-orange-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2">
                {t('pollution.lifespanRed')}
              </h3>
              <div className="text-4xl font-black text-foreground mb-2 group-hover:text-orange-400 transition-colors">
                {formatNumber(data.lifespanReductionHours)} {t('pollution.hoursPerDay')}
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{t('pollution.lifespanRedDesc')}</p>
            </motion.div>

            <motion.div className="card md:col-span-2 hover:border-purple-500/50 group">
              <h3 className="text-muted-foreground text-xs font-bold uppercase tracking-widest mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-purple-400" /> {t('pollution.primaryPollutant')}
              </h3>
              <div className="text-3xl font-bold text-foreground mt-2 group-hover:text-purple-400 transition-colors">
                {tApi(data.mainCause)}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
