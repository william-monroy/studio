'use server';

import { Suspense } from 'react';
import { getAnalyticsData } from '@/lib/actions';
import AnalyticsClient from './analytics-client';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
    const data = await getAnalyticsData();
    return <AnalyticsClient initialData={data} />;
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<LoadingSkeleton />}>
            <AnalyticsData />
        </Suspense>
    );
}
