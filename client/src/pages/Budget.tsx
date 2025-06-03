import React from 'react';
import MainLayout from '@/layouts/MainLayout';
import BudgetingGuide from '@/components/BudgetingGuide';

export default function Budget() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <BudgetingGuide />
      </div>
    </MainLayout>
  );
}