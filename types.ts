import React from 'react';

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
}

export interface StatItem {
  id: number;
  label: string;
  value: number;
  suffix: string;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}