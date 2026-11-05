'use client';

import Link from 'next/link';
import { Wind, Droplets, MountainSnow, BarChart2, Volume2, Globe, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import AnimatedEarth from '@/components/AnimatedEarth';
import api from '@/lib/api';
import { useLanguage } from '@/components/LanguageProvider';
import { LoadingPanel, EmptyPanel } from '@/components/StatePanel';

const CountUp = ({ end, duration = 2, decimals = 0, format }: { end: number; duration?: number; decimals?: number; format?: (num: string | number) => string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(easeProgress * end);
      if (progress < 1) window.requestAnimationFrame(step);
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
        if (res.data.status === 200) setSummary(res.data.data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      } finally {
        setSummary((prev: any) =>
          prev || {
            totalCitiesTracked: 30,
            globalAverageAqi: 142.5,
            globalAverageWaterContamination: 42.1,
            globalAverageSoilDegradation: 5.4,
            globalAverageNoiseLevel: 68.3,
            mostPollutedCities: [],
            safestCities: [],
          },
        );
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

  if (loading) {
    return (
      <div className="page-shell">
        <LoadingPanel message="Loading global environmental summary…" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <section className="glass-panel rounded-3xl px-6 py-8 md:px-10 md:py-10 border border-border/80 overflow-hidden relative">
        <div className="absolute -right-24 -top-24 hidden md:block opacity-30 pointer-events-none">
          <AnimatedEarth className="w-72 h-72" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">Eco Earth</span>
          <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight leading-[1.1]">
            {t('dashboard.title')} <span className="text-primary">{t('dashboard.titleAccent')}</span>
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
            {t('dashboard.subtext', { count: formatNumber(summary?.totalCitiesTracked || 30) })}
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 max-w-md">
            <div className="card p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.citiesTracked')}</p>
              <p className="mt-2 text-3xl font-black"><CountUp end={summary?.totalCitiesTracked || 30} format={formatNumber} /></p>
            </div>
            <div className="card p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.coreModels')}</p>
              <p className="mt-2 text-3xl font-black"><CountUp end={5} format={formatNumber} /></p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-6 h-6 text-accent" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('dashboard.globalPulse')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="card">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.avgAqi')}</p>
            <p className="mt-2 text-3xl font-black"><CountUp end={summary.globalAverageAqi} decimals={1} format={formatNumber} /></p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.waterToxicity')}</p>
            <p className="mt-2 text-3xl font-black"><CountUp end={summary.globalAverageWaterContamination} decimals={1} format={formatNumber} />%</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.soilDegradation')}</p>
            <p className="mt-2 text-3xl font-black"><CountUp end={summary.globalAverageSoilDegradation} decimals={1} format={formatNumber} />/10</p>
          </div>
          <div className="card">
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground font-semibold">{t('dashboard.urbanNoise')}</p>
            <p className="mt-2 text-3xl font-black"><CountUp end={summary.globalAverageNoiseLevel} decimals={1} format={formatNumber} /> {t('pollution.db')}</p>
          </div>
        </div>
      </section>

      {summary?.mostPollutedCities?.length ? (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="card p-0 overflow-hidden border-destructive/20">
            <div className="px-5 py-4 border-b border-border/70 bg-destructive/8 flex items-center gap-2.5">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <h3 className="font-semibold">{t('dashboard.criticalZones')}</h3>
            </div>
            <div className="divide-y divide-border/60">
              {summary.mostPollutedCities.map((city: any, idx: number) => (
                <div key={city.name} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{formatNumber(idx + 1)}. {tApi(city.name)}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-1">{tApi(city.country)}</p>
                  </div>
                  <p className="text-sm font-bold text-destructive">AQI {formatNumber(city.aqi)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-0 overflow-hidden border-primary/20">
            <div className="px-5 py-4 border-b border-border/70 bg-primary/8 flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">{t('dashboard.safeHavens')}</h3>
            </div>
            <div className="divide-y divide-border/60">
              {summary.safestCities.map((city: any, idx: number) => (
                <div key={city.name} className="px-5 py-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold">{formatNumber(idx + 1)}. {tApi(city.name)}</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground mt-1">{tApi(city.country)}</p>
                  </div>
                  <p className="text-sm font-bold text-primary">AQI {formatNumber(city.aqi)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <EmptyPanel title={t('dashboard.globalPulse')} description="Rankings are currently unavailable." />
      )}

      <section>
        <div className="flex items-center gap-3 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{t('dashboard.ecosystemAnalysis')}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link key={mod.name} href={mod.href} className="card group h-full">
                <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                  <Icon className={`w-6 h-6 ${mod.color}`} />
                </div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">{mod.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{mod.desc}</p>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
