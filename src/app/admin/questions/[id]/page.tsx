'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getQuestion, updateQuestion } from '@/lib/actions';
import { Question } from '@/lib/types';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button size="sm" type="submit" disabled={pending}>
        {pending ? 'Saving...' : 'Save Question'}
      </Button>
    );
}

function ErrorMessage({ messages }: { messages?: string[] }) {
    if (!messages || messages.length === 0) return null;
    return (
        <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm font-medium text-destructive"
        >
            {messages.join(', ')}
        </motion.p>
    );
}

function EditQuestionForm({ question }: { question: Question }) {
    const [state, formAction] = useActionState(updateQuestion.bind(null, question.id), { error: null });
    const router = useRouter();

    return (
        <form action={formAction} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
                    Edit Question
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                        Discard Changes
                    </Button>
                    <SubmitButton />
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                    <CardDescription>Editing question with ID: {question.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="text">Question Text</Label>
                            <Textarea id="text" name="text" placeholder="e.g. ¿Invertir en propiedades en el metaverso?" defaultValue={question.text} />
                            <ErrorMessage messages={state?.error?.text} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="successProb">Success Probability (0.0 to 1.0)</Label>
                                <Input id="successProb" name="successProb" type="number" step="0.1" min="0" max="1" placeholder="0.5" defaultValue={question.successProb} />
                                <ErrorMessage messages={state?.error?.successProb} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="timeLimitSec">Time Limit (seconds)</Label>
                                <Input id="timeLimitSec" name="timeLimitSec" type="number" step="1" min="5" placeholder="15" defaultValue={question.timeLimitSec} />
                                <ErrorMessage messages={state?.error?.timeLimitSec} />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="mediaPosUrl">Positive Media URL</Label>
                                <Input id="mediaPosUrl" name="mediaPosUrl" placeholder="https://example.com/success.gif" defaultValue={question.mediaPosUrl} />
                                <ErrorMessage messages={state?.error?.mediaPosUrl} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="mediaNegUrl">Negative Media URL</Label>
                                <Input id="mediaNegUrl" name="mediaNegUrl" placeholder="https://example.com/fail.gif" defaultValue={question.mediaNegUrl} />
                                <ErrorMessage messages={state?.error?.mediaNegUrl} />
                            </div>
                        </div>
                        <ErrorMessage messages={state?.error?._general} />
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}

function LoadingSkeleton() {
    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <Skeleton className="h-8 w-48" />
            </div>
             <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-64" />
                    <Skeleton className="h-5 w-80" />
                </CardHeader>
                <CardContent className="grid gap-6">
                    <div className="grid gap-3">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                        <div className="grid gap-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="grid gap-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                        <div className="grid gap-3"><Skeleton className="h-5 w-32" /><Skeleton className="h-10 w-full" /></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default function EditQuestionPage({ params }: { params: { id: string } }) {
    const [question, setQuestion] = useState<Question | null>(null);

    useEffect(() => {
        getQuestion(params.id).then(setQuestion);
    }, [params.id]);

    if (!question) {
        return <LoadingSkeleton />;
    }

    return <EditQuestionForm question={question} />;
}
