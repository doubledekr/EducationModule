import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import SavingsCalculator from '@/components/SavingsCalculator';

export default function Savings() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <SavingsCalculator />
      </div>
    </MainLayout>
  );
}