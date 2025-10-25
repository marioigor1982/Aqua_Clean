
import React from 'react';

export interface PricingOption {
  vehicleType: string;
  price: number;
  description: string;
  icon: React.ReactNode;
  backgroundImage?: string;
}