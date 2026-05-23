'use client';

import Link from 'next/link';
import { Wind, Droplets, MountainSnow, BarChart2, Volume2, Globe, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedEarth from '@/components/AnimatedEarth';
import api from '@/lib/api';
import { useLanguage } from '@/components/LanguageProvider';

const CountUp = ({ end, duration = 2, decimals = 0, format }: { end: number, duration?: number, decimals?: number, format?: (num: string | number) => string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * end);
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatted = count.toFixed(decimals);
  return <span>{format ? format(formatted) : formatted}</span>;
};

export default function Dashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { t, formatNumber, tApi } = useLanguage();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await api.get('/pollution/summary');
        if (res.data.status === 200) {
          setSummary(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch summary:", err);
      } finally {
        setSummary((prev: any) => prev || {
          totalCitiesTracked: 30,
          globalAverageAqi: 142.5,
          globalAverageWaterContamination: 42.1,
          globalAverageSoilDegradation: 5.4,
          globalAverageNoiseLevel: 68.3,
          mostPollutedCities: [],
          safestCities: []
        });
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const modules = [
    { name: t('navbar.air'), href: '/air', icon: Wind, color: 'text-sky-500', desc: t('dashboard.airQualityDesc') },
    { name: t('navbar.water'), href: '/water', icon: Droplets, color: 'text-blue-500', desc: t('dashboard.waterHealthDesc') },
    { name: t('navbar.soil'), href: '/soil', icon: MountainSnow, color: 'text-amber-500', desc: t('dashboard.soilVitalityDesc') },
    { name: t('navbar.sound'), href: '/sound', icon: Volume2, color: 'text-emerald-500', desc: t('dashboard.acousticEnvDesc') },
    { name: t('navbar.comparison'), href: '/comparison', icon: BarChart2, color: 'text-teal-500', desc: t('dashboard.globalCompDesc') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
          <AnimatedEarth className="w-48 h-48 opacity-40" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-24 pb-20 relative">
      {/* Background Organic Blobs */}
      <div className="absolute top-0 left-[-10%] w-[40rem] h-[40rem] bg-primary/5 organic-blob -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-accent/5 organic-blob -z-10 pointer-events-none mix-blend-multiply dark:mix-blend-screen" style={{ animationDelay: '-4s' }} />

      {/* Hero Section - Immersive */}
      <section className="relative min-h-[60vh] flex flex-col items-center justify-center pt-10">
        <div className="absolute inset-0 flex items-center justify-center -z-10 opacity-30 md:opacity-85">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <AnimatedEarth className="w-[25rem] h-[25rem] lg:w-[40rem] lg:h-[40rem]" />
          </motion.div>
        </div>

        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="glass-panel px-8 py-10 md:px-16 md:py-16 rounded-[2.5rem] shadow-2xl backdrop-blur-xl border border-border"
          >
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter text-foreground mb-6 drop-shadow-sm leading-[1.1]">
              {t('dashboard.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{t('dashboard.titleAccent')}</span>
            </h1>
            <p className="text-lg md:text-xl text-foreground font-medium max-w-2xl mx-auto mb-10 leading-relaxed opacity-90">
              {t('dashboard.subtext', { count: formatNumber(summary?.totalCitiesTracked || 30) })}
            </p>
            
            <div className="flex flex-wrap justify-center gap-10">
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black text-foreground">
                  <CountUp end={summary?.totalCitiesTracked || 30} format={formatNumber} />
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">{t('dashboard.citiesTracked')}</span>
              </div>
              <div className="w-px h-16 bg-border mx-4 hidden md:block opacity-50"></div>
              <div className="flex flex-col items-center">
                <span className="text-4xl md:text-5xl font-black text-foreground">
                  <CountUp end={5} format={formatNumber} />
                </span>
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2">{t('dashboard.coreModels')}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Snapshot */}
      {summary && (
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto relative z-10 px-4"
        >
          <div className="flex items-center mb-10">
            <Globe className="w-8 h-8 mr-4 text-accent" />
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t('dashboard.globalPulse')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div variants={itemVariants} className="card group hover:border-primary/50 relative overflow-hidden bg-card">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Wind className="w-16 h-16 text-primary" /></div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 relative z-10">{t('dashboard.avgAqi')}</div>
              <div className="text-4xl font-black text-foreground relative z-10">
                <CountUp end={summary.globalAverageAqi} decimals={1} format={formatNumber} />
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="card group hover:border-accent/50 relative overflow-hidden bg-card">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Droplets className="w-16 h-16 text-accent" /></div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 relative z-10">{t('dashboard.waterToxicity')}</div>
              <div className="text-4xl font-black text-foreground relative z-10">
                <CountUp end={summary.globalAverageWaterContamination} decimals={1} format={formatNumber} />
                <span className="text-xl ml-1 text-muted-foreground">%</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="card group hover:border-amber-500/50 relative overflow-hidden bg-card">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><MountainSnow className="w-16 h-16 text-amber-500" /></div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 relative z-10">{t('dashboard.soilDegradation')}</div>
              <div className="text-4xl font-black text-foreground relative z-10">
                <CountUp end={summary.globalAverageSoilDegradation} decimals={1} format={formatNumber} />
                <span className="text-xl ml-1 text-muted-foreground">/10</span>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="card group hover:border-emerald-500/50 relative overflow-hidden bg-card">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity"><Volume2 className="w-16 h-16 text-emerald-500" /></div>
              <div className="text-xs text-muted-foreground font-bold uppercase tracking-widest mb-2 relative z-10">{t('dashboard.urbanNoise')}</div>
              <div className="text-4xl font-black text-foreground relative z-10">
                <CountUp end={summary.globalAverageNoiseLevel} decimals={1} format={formatNumber} />
                <span className="text-xl ml-1 text-muted-foreground">{t('pollution.db')}</span>
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Rankings Section */}
      {summary && summary.mostPollutedCities && summary.mostPollutedCities.length > 0 && (
        <motion.section 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={containerVariants}
          className="max-w-7xl mx-auto px-4"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div variants={itemVariants} className="card p-0 overflow-hidden border-destructive/20 hover:border-destructive/40 transition-colors">
              <div className="px-8 py-6 border-b border-border bg-destructive/5">
                <h3 className="text-xl font-bold text-foreground flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-3 text-destructive" /> {t('dashboard.criticalZones')}
                </h3>
              </div>
              <div className="divide-y divide-border/50">
                {summary.mostPollutedCities.map((city: any, idx: number) => (
                  <div key={city.name} className="px-8 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center space-x-6">
                      <span className="text-muted-foreground font-mono font-bold text-lg w-4">{formatNumber(idx + 1)}</span>
                      <div>
                        <div className="text-lg font-bold text-foreground group-hover:text-destructive transition-colors">{tApi(city.name)}</div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{tApi(city.country)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-destructive">{t('pollution.aqiHeader')}: {formatNumber(city.aqi)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="card p-0 overflow-hidden border-primary/20 hover:border-primary/40 transition-colors">
              <div className="px-8 py-6 border-b border-border bg-primary/5">
                <h3 className="text-xl font-bold text-foreground flex items-center">
                  <ShieldCheck className="w-6 h-6 mr-3 text-primary" /> {t('dashboard.safeHavens')}
                </h3>
              </div>
              <div className="divide-y divide-border/50">
                {summary.safestCities.map((city: any, idx: number) => (
                  <div key={city.name} className="px-8 py-5 flex items-center justify-between hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center space-x-6">
                      <span className="text-muted-foreground font-mono font-bold text-lg w-4">{formatNumber(idx + 1)}</span>
                      <div>
                        <div className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{tApi(city.name)}</div>
                        <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{tApi(city.country)}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-black text-primary">{t('pollution.aqiHeader')}: {formatNumber(city.aqi)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Modules Grid */}
      <motion.section 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto px-4"
      >
        <div className="flex items-center mb-10">
          <Activity className="w-8 h-8 mr-4 text-primary" />
          <h2 className="text-3xl font-extrabold text-foreground tracking-tight">{t('dashboard.ecosystemAnalysis')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <motion.div key={mod.name} variants={itemVariants} className="h-full">
                <Link href={mod.href} className="block h-full group focus:outline-none">
                  <div className="card h-full flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl border-border">
                    <div className="relative z-10">
                      <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 group-hover:bg-primary/10">
                        <Icon className={`w-7 h-7 ${mod.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                        {mod.name}
                      </h3>
                      <p className="text-muted-foreground font-medium leading-relaxed">
                        {mod.desc}
                      </p>
                    </div>
                    
                    {/* Subtle bottom accent line */}
                    <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-primary to-accent group-hover:w-full transition-all duration-500"></div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

    </div>
  );
}
