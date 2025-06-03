import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { PiggyBank, Target, TrendingUp, Calculator, Calendar, DollarSign } from 'lucide-react';

interface SavingsData {
  currentSavings: number;
  monthlyContribution: number;
  targetAmount: number;
  interestRate: number;
  timeFrame: number;
  compoundFrequency: 'monthly' | 'quarterly' | 'annually';
}

interface ProjectionData {
  month: number;
  year: number;
  balance: number;
  totalContributions: number;
  interestEarned: number;
}

const COMPOUND_FREQUENCIES = {
  monthly: 12,
  quarterly: 4,
  annually: 1
};

export default function SavingsCalculator() {
  const [savingsData, setSavingsData] = useState<SavingsData>({
    currentSavings: 1000,
    monthlyContribution: 500,
    targetAmount: 10000,
    interestRate: 4.5,
    timeFrame: 24,
    compoundFrequency: 'monthly'
  });

  const [projectionData, setProjectionData] = useState<ProjectionData[]>([]);
  const [calculatorMode, setCalculatorMode] = useState<'future-value' | 'target-planning' | 'retirement'>('future-value');

  const calculateCompoundInterest = (
    principal: number,
    monthlyContribution: number,
    annualRate: number,
    months: number,
    compoundFrequency: number
  ): ProjectionData[] => {
    const monthlyRate = annualRate / 100 / 12;
    const data: ProjectionData[] = [];
    
    let currentBalance = principal;
    let totalContributions = principal;
    
    for (let month = 0; month <= months; month++) {
      if (month > 0) {
        // Add monthly contribution
        currentBalance += monthlyContribution;
        totalContributions += monthlyContribution;
        
        // Apply monthly compound interest
        currentBalance *= (1 + monthlyRate);
      }
      
      const interestEarned = currentBalance - totalContributions;
      
      data.push({
        month,
        year: Math.floor(month / 12),
        balance: Math.round(currentBalance * 100) / 100,
        totalContributions: Math.round(totalContributions * 100) / 100,
        interestEarned: Math.round(Math.max(0, interestEarned) * 100) / 100
      });
    }
    
    return data;
  };

  const calculateTimeToGoal = (
    currentSavings: number,
    monthlyContribution: number,
    targetAmount: number,
    annualRate: number
  ): number => {
    if (monthlyContribution <= 0) return 0;
    
    const monthlyRate = annualRate / 100 / 12;
    let balance = currentSavings;
    let months = 0;
    
    while (balance < targetAmount && months < 600) { // Max 50 years
      balance += monthlyContribution;
      balance *= (1 + monthlyRate);
      months++;
    }
    
    return months;
  };

  const calculateRequiredMonthlyContribution = (
    currentSavings: number,
    targetAmount: number,
    timeFrameMonths: number,
    annualRate: number
  ): number => {
    if (timeFrameMonths <= 0) return 0;
    
    const monthlyRate = annualRate / 100 / 12;
    const futureValueOfCurrent = currentSavings * Math.pow(1 + monthlyRate, timeFrameMonths);
    const remainingAmount = targetAmount - futureValueOfCurrent;
    
    if (remainingAmount <= 0) return 0;
    
    // PMT formula for annuity
    const monthlyPayment = remainingAmount / (((Math.pow(1 + monthlyRate, timeFrameMonths) - 1) / monthlyRate));
    
    return Math.max(0, Math.round(monthlyPayment * 100) / 100);
  };

  useEffect(() => {
    const data = calculateCompoundInterest(
      savingsData.currentSavings,
      savingsData.monthlyContribution,
      savingsData.interestRate,
      savingsData.timeFrame,
      COMPOUND_FREQUENCIES[savingsData.compoundFrequency]
    );
    setProjectionData(data);
  }, [savingsData]);

  const updateSavingsData = (field: keyof SavingsData, value: any) => {
    setSavingsData(prev => ({ ...prev, [field]: value }));
  };

  const finalProjection = projectionData[projectionData.length - 1];
  const timeToGoal = calculateTimeToGoal(
    savingsData.currentSavings,
    savingsData.monthlyContribution,
    savingsData.targetAmount,
    savingsData.interestRate
  );
  
  const requiredMonthlyContribution = calculateRequiredMonthlyContribution(
    savingsData.currentSavings,
    savingsData.targetAmount,
    savingsData.timeFrame,
    savingsData.interestRate
  );

  const savingsGoals = [
    { name: 'Emergency Fund', amount: 5000, description: '3-6 months of expenses' },
    { name: 'New Car', amount: 25000, description: 'Down payment + car fund' },
    { name: 'Home Down Payment', amount: 50000, description: '20% down on $250k home' },
    { name: 'Vacation Fund', amount: 3000, description: 'Annual vacation budget' },
    { name: 'Retirement Boost', amount: 100000, description: 'Additional retirement savings' }
  ];

  const retirementScenarios = [
    { age: 25, retirementAge: 65, monthlyIncome: 4000, replacementRatio: 0.8 },
    { age: 35, retirementAge: 65, monthlyIncome: 6000, replacementRatio: 0.8 },
    { age: 45, retirementAge: 65, monthlyIncome: 8000, replacementRatio: 0.8 }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-6 w-6" />
            Advanced Savings Calculator
          </CardTitle>
          <CardDescription>
            Plan your financial future with compound interest calculations and goal planning
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={calculatorMode} onValueChange={(value) => setCalculatorMode(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="future-value">Future Value</TabsTrigger>
          <TabsTrigger value="target-planning">Goal Planning</TabsTrigger>
          <TabsTrigger value="retirement">Retirement</TabsTrigger>
        </TabsList>

        <TabsContent value="future-value" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PiggyBank className="h-5 w-5" />
                    Savings Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="currentSavings">Current Savings ($)</Label>
                    <Input
                      id="currentSavings"
                      type="number"
                      value={savingsData.currentSavings}
                      onChange={(e) => updateSavingsData('currentSavings', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="monthlyContribution">Monthly Contribution ($)</Label>
                    <Input
                      id="monthlyContribution"
                      type="number"
                      value={savingsData.monthlyContribution}
                      onChange={(e) => updateSavingsData('monthlyContribution', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={savingsData.interestRate}
                      onChange={(e) => updateSavingsData('interestRate', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="timeFrame">Time Frame (months)</Label>
                    <Input
                      id="timeFrame"
                      type="number"
                      value={savingsData.timeFrame}
                      onChange={(e) => updateSavingsData('timeFrame', Number(e.target.value))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="compoundFrequency">Compound Frequency</Label>
                    <Select 
                      value={savingsData.compoundFrequency} 
                      onValueChange={(value) => updateSavingsData('compoundFrequency', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Results Summary */}
              {finalProjection && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Projection Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="p-4 bg-green-50 rounded-lg">
                          <div className="text-sm text-green-600">Final Balance</div>
                          <div className="text-2xl font-bold text-green-700">
                            ${finalProjection.balance.toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <div className="text-sm text-blue-600">Total Contributions</div>
                            <div className="text-lg font-bold text-blue-700">
                              ${finalProjection.totalContributions.toLocaleString()}
                            </div>
                          </div>
                          
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <div className="text-sm text-purple-600">Interest Earned</div>
                            <div className="text-lg font-bold text-purple-700">
                              ${finalProjection.interestEarned.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-gray-50 rounded-lg">
                          <div className="text-sm text-gray-600">Return on Investment</div>
                          <div className="text-lg font-bold text-gray-700">
                            {finalProjection.totalContributions > 0 
                              ? ((finalProjection.interestEarned / finalProjection.totalContributions) * 100).toFixed(1)
                              : 0}%
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Visualization Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Growth Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" label={{ value: 'Months', position: 'insideBottom', offset: -10 }} />
                      <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                      <Legend />
                      <Line type="monotone" dataKey="balance" stroke="#8884d8" name="Total Balance" strokeWidth={2} />
                      <Line type="monotone" dataKey="totalContributions" stroke="#82ca9d" name="Contributions" strokeWidth={2} />
                      <Line type="monotone" dataKey="interestEarned" stroke="#ffc658" name="Interest Earned" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Annual Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={projectionData.filter((_, index) => index % 12 === 0)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`, '']} />
                      <Legend />
                      <Bar dataKey="totalContributions" stackId="a" fill="#82ca9d" name="Contributions" />
                      <Bar dataKey="interestEarned" stackId="a" fill="#ffc658" name="Interest" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="target-planning" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Goal Planning
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="targetAmount">Target Amount ($)</Label>
                  <Input
                    id="targetAmount"
                    type="number"
                    value={savingsData.targetAmount}
                    onChange={(e) => updateSavingsData('targetAmount', Number(e.target.value))}
                  />
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Common Savings Goals</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {savingsGoals.map((goal, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-between h-auto p-3"
                        onClick={() => updateSavingsData('targetAmount', goal.amount)}
                      >
                        <div className="text-left">
                          <div className="font-medium">{goal.name}</div>
                          <div className="text-sm text-gray-500">{goal.description}</div>
                        </div>
                        <div className="font-bold">${goal.amount.toLocaleString()}</div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-600">Time to Reach Goal</div>
                  <div className="text-2xl font-bold text-blue-700">
                    {timeToGoal > 0 ? `${Math.floor(timeToGoal / 12)} years, ${timeToGoal % 12} months` : 'Goal already reached!'}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-green-600">Required Monthly Contribution</div>
                  <div className="text-2xl font-bold text-green-700">
                    ${requiredMonthlyContribution.toLocaleString()}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    To reach ${savingsData.targetAmount.toLocaleString()} in {Math.floor(savingsData.timeFrame / 12)} years, {savingsData.timeFrame % 12} months
                  </div>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="text-sm text-yellow-600">Current vs Required</div>
                  <div className="text-lg font-bold text-yellow-700">
                    {savingsData.monthlyContribution >= requiredMonthlyContribution 
                      ? `On track! Saving $${(savingsData.monthlyContribution - requiredMonthlyContribution).toLocaleString()} extra per month`
                      : `Need $${(requiredMonthlyContribution - savingsData.monthlyContribution).toLocaleString()} more per month`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="retirement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Retirement Planning Scenarios
              </CardTitle>
              <CardDescription>
                Estimate retirement savings needs based on different starting ages
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {retirementScenarios.map((scenario, index) => {
                  const yearsToRetirement = scenario.retirementAge - scenario.age;
                  const monthsToRetirement = yearsToRetirement * 12;
                  const targetRetirementIncome = scenario.monthlyIncome * scenario.replacementRatio;
                  const requiredRetirementSavings = targetRetirementIncome * 12 * 25; // 25x annual income rule
                  
                  const requiredMonthlySavings = calculateRequiredMonthlyContribution(
                    0, // Starting from 0
                    requiredRetirementSavings,
                    monthsToRetirement,
                    7 // Assuming 7% return for stocks
                  );

                  return (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="text-center">
                          <div className="text-lg font-bold">Starting at Age {scenario.age}</div>
                          <div className="text-sm text-gray-600">Retire at {scenario.retirementAge}</div>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Current Income:</span>
                            <span className="font-medium">${scenario.monthlyIncome.toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Target Retirement Income:</span>
                            <span className="font-medium">${targetRetirementIncome.toLocaleString()}/mo</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Required Savings:</span>
                            <span className="font-medium">${(requiredRetirementSavings / 1000000).toFixed(1)}M</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span>Monthly Savings Needed:</span>
                            <span className="font-bold text-blue-600">${requiredMonthlySavings.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>% of Income:</span>
                            <span className="font-medium">{((requiredMonthlySavings / scenario.monthlyIncome) * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}