'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';

export interface CitySummary {
  name: string;
  country: string;
  aqi: number;
  classification: string;
}

let cachedCities: CitySummary[] | null = null;
let cachePromise: Promise<CitySummary[]> | null = null;

export function useCities() {
  const [cities, setCities] = useState<CitySummary[]>(cachedCities || []);
  const [loading, setLoading] = useState(!cachedCities);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cachedCities) {
      setCities(cachedCities);
      setLoading(false);
      return;
    }

    const fetchCities = async () => {
      try {
        if (!cachePromise) {
          cachePromise = api.get('/cities').then((res) => {
            if (res.data.status === 200) {
              cachedCities = res.data.data;
              return res.data.data;
            }
            throw new Error(res.data.message || 'Failed to fetch cities');
          });
        }
        const data = await cachePromise;
        setCities(data);
      } catch (err: any) {
        setError('Failed to load cities. Please try again.');
        cachePromise = null;
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
}
