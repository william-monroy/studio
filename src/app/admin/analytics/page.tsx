'use client';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Gamepad, Trophy, Percent } from 'lucide-react';
import type { getAnalyticsData } from '@/lib/actions';

type AnalyticsData = Awaited<ReturnType<typeof getAnalyticsData>>;

const chartConfig = {
  success: {
    label: 'Success',
    color: 'hsl(var(--chart-2))',
  },
  fail: {
    label: 'Fail',
    color: 'hsl(var(--destructive))',
  },
  yes: {
    label: 'Yes',
    color: 'hsl(var(--chart-1))',
  },
  no: {
    label: 'No',
    color: 'hsl(var(--chart-5))',
  }
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

function AnalyticsClient({ initialData }: { initialData: AnalyticsData }) {
    const { totalPlayers, totalGames, averageScore, overallSuccessRate, successFailData, questionDecisionsData } = initialData;

    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Players</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalPlayers}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Games Played</CardTitle>
                    <Gamepad className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalGames}</div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{averageScore}</div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Overall Success Rate</CardTitle>
                    <Percent className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{overallSuccessRate}%</div>
                </CardContent>
            </Card>

            <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Overall Success vs. Fail</CardTitle>
                    <CardDescription>A breakdown of all decisions made in the game.</CardDescription>
                </CardHeader>
                <CardContent>
                     <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
                         <PieChart>
                             <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                             <Pie data={successFailData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={5}>
                                {successFailData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Pie>
                            <ChartLegend content={<ChartLegendContent />} />
                        </PieChart>
                    </ChartContainer>
                </CardContent>
            </Card>
             <Card className="col-span-1 lg:col-span-2">
                <CardHeader>
                    <CardTitle>Decisions per Question</CardTitle>
                    <CardDescription>Breakdown of Yes/No answers for each question.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChartContainer config={chartConfig} className="w-full h-[300px]">
                        <BarChart data={questionDecisionsData} layout="vertical" margin={{ left: 120 }}>
                             <CartesianGrid horizontal={false} />
                             <XAxis type="number" hide />
                             <YAxis dataKey="text" type="category" tickLine={false} axisLine={false} width={100} className="w-32 truncate" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <ChartLegend content={<ChartLegendContent />} />
                            <Bar dataKey="yes" stackId="a" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                            <Bar dataKey="no" stackId="a" fill="hsl(var(--chart-5))" radius={[4, 0, 0, 4]} />
                        </BarChart>
                    </ChartContainer>
                </CardContent>
            </Card>
        </div>
    );
}

// Server Component Page
import { getAnalyticsData as getAnalyticsDataAction } from '@/lib/actions';
import { Suspense } from 'react';

function LoadingSkeleton() {
    return (
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
            <Card><CardHeader><Skeleton className="h-6 w-3/4" /></CardHeader><CardContent><Skeleton className="h-8 w-1/2" /></CardContent></Card>
            <Card className="col-span-1 lg:col-span-2"><CardHeader><Skeleton className="h-7 w-1/2" /><Skeleton className="h-5 w-3/4 mt-2" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
            <Card className="col-span-1 lg:col-span-2"><CardHeader><Skeleton className="h-7 w-1/2" /><Skeleton className="h-5 w-3/4 mt-2" /></CardHeader><CardContent><Skeleton className="h-[300px] w-full" /></CardContent></Card>
        </div>
    )
}

async function AnalyticsData() {
    const data = await getAnalyticsDataAction();
    return <AnalyticsClient initialData={data} />;
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <AnalyticsData />
        </Suspense>
    );
}