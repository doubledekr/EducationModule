import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

interface BudgetCategory {
  name: string;
  amount: number;
  recommended: number;
  color: string;
}

interface BudgetData {
  income: number;
  categories: BudgetCategory[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const DEFAULT_CATEGORIES = [
  { name: 'Housing', amount: 0, recommended: 30, color: COLORS[0] },
  { name: 'Transportation', amount: 0, recommended: 15, color: COLORS[1] },
  { name: 'Food', amount: 0, recommended: 12, color: COLORS[2] },
  { name: 'Utilities', amount: 0, recommended: 8, color: COLORS[3] },
  { name: 'Entertainment', amount: 0, recommended: 5, color: COLORS[4] },
  { name: 'Savings', amount: 0, recommended: 20, color: COLORS[5] },
  { name: 'Other', amount: 0, recommended: 10, color: COLORS[6] }
];

export default function BudgetingGuide() {
  const [budgetData, setBudgetData] = useState<BudgetData>({
    income: 0,
    categories: DEFAULT_CATEGORIES
  });
  const [activeStep, setActiveStep] = useState(0);

  const updateIncome = (income: number) => {
    setBudgetData(prev => ({ ...prev, income }));
  };

  const updateCategory = (index: number, amount: number) => {
    setBudgetData(prev => ({
      ...prev,
      categories: prev.categories.map((cat, i) => 
        i === index ? { ...cat, amount } : cat
      )
    }));
  };

  const totalSpent = budgetData.categories.reduce((sum, cat) => sum + cat.amount, 0);
  const remainingBudget = budgetData.income - totalSpent;
  const budgetUtilization = budgetData.income > 0 ? (totalSpent / budgetData.income) * 100 : 0;

  const getBudgetStatus = () => {
    if (budgetUtilization > 100) return { status: 'over', color: 'text-red-600', icon: AlertTriangle };
    if (budgetUtilization > 90) return { status: 'warning', color: 'text-yellow-600', icon: AlertTriangle };
    return { status: 'good', color: 'text-green-600', icon: CheckCircle };
  };

  const budgetStatus = getBudgetStatus();
  const StatusIcon = budgetStatus.icon;

  const pieChartData = budgetData.categories
    .filter(cat => cat.amount > 0)
    .map(cat => ({
      name: cat.name,
      value: cat.amount,
      color: cat.color
    }));

  const comparisonData = budgetData.categories.map(cat => ({
    name: cat.name,
    actual: budgetData.income > 0 ? (cat.amount / budgetData.income) * 100 : 0,
    recommended: cat.recommended
  }));

  const budgetingTips = [
    {
      title: "50/30/20 Rule",
      description: "Allocate 50% for needs, 30% for wants, and 20% for savings and debt repayment."
    },
    {
      title: "Track Your Spending",
      description: "Monitor your expenses for a month to understand where your money goes."
    },
    {
      title: "Emergency Fund",
      description: "Build an emergency fund covering 3-6 months of expenses."
    },
    {
      title: "Review Regularly",
      description: "Review and adjust your budget monthly to stay on track."
    }
  ];

  const steps = [
    {
      title: "Set Your Income",
      description: "Enter your monthly after-tax income"
    },
    {
      title: "Allocate Categories",
      description: "Distribute your income across different expense categories"
    },
    {
      title: "Review & Optimize",
      description: "Analyze your budget and make adjustments"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Personal Budget Planner
          </CardTitle>
          <CardDescription>
            Create and manage your monthly budget with our interactive guide
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => (
              <div 
                key={index}
                className={`flex flex-col items-center cursor-pointer ${
                  index <= activeStep ? 'text-blue-600' : 'text-gray-400'
                }`}
                onClick={() => setActiveStep(index)}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
                  index <= activeStep ? 'border-blue-600 bg-blue-600 text-white' : 'border-gray-300'
                }`}>
                  {index + 1}
                </div>
                <div className="text-sm font-medium text-center">
                  <div>{step.title}</div>
                  <div className="text-xs text-gray-500 mt-1">{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Income Input */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Income</CardTitle>
              <CardDescription>Enter your monthly after-tax income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="income">Monthly Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    placeholder="Enter your monthly income"
                    value={budgetData.income || ''}
                    onChange={(e) => updateIncome(Number(e.target.value))}
                  />
                </div>
                {budgetData.income > 0 && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-800">
                        Monthly Income: ${budgetData.income.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Budget Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Allocate your income across different expense categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.categories.map((category, index) => (
                  <div key={category.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <Label htmlFor={`category-${index}`} className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </Label>
                      <span className="text-sm text-gray-500">
                        Recommended: {category.recommended}%
                      </span>
                    </div>
                    <Input
                      id={`category-${index}`}
                      type="number"
                      placeholder={`Enter ${category.name.toLowerCase()} amount`}
                      value={category.amount || ''}
                      onChange={(e) => updateCategory(index, Number(e.target.value))}
                    />
                    {budgetData.income > 0 && category.amount > 0 && (
                      <div className="text-sm text-gray-600">
                        {((category.amount / budgetData.income) * 100).toFixed(1)}% of income
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Visualization Section */}
        <div className="space-y-6">
          {/* Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <StatusIcon className={`h-5 w-5 ${budgetStatus.color}`} />
                Budget Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Income</div>
                    <div className="text-xl font-bold text-green-600">
                      ${budgetData.income.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Total Allocated</div>
                    <div className="text-xl font-bold text-blue-600">
                      ${totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600">Remaining Budget</div>
                  <div className={`text-xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ${remainingBudget.toLocaleString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Budget Utilization</span>
                    <span className={budgetStatus.color}>
                      {budgetUtilization.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={Math.min(budgetUtilization, 100)} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          {pieChartData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Spending Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`$${value}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Comparison Chart */}
          {budgetData.income > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Actual vs Recommended</CardTitle>
                <CardDescription>Compare your allocations with recommended percentages</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="actual" fill="#8884d8" name="Your Allocation" />
                    <Bar dataKey="recommended" fill="#82ca9d" name="Recommended" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Budgeting Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Budgeting Tips & Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {budgetingTips.map((tip, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{tip.title}</h4>
                <p className="text-sm text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
          disabled={activeStep === 0}
          variant="outline"
        >
          Previous Step
        </Button>
        <Button 
          onClick={() => setActiveStep(Math.min(2, activeStep + 1))}
          disabled={activeStep === 2}
        >
          Next Step
        </Button>
        <Button 
          onClick={() => {
            setBudgetData({ income: 0, categories: DEFAULT_CATEGORIES });
            setActiveStep(0);
          }}
          variant="outline"
        >
          Reset Budget
        </Button>
      </div>
    </div>
  );
}