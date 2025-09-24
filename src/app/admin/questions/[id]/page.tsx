import { getQuestion } from '@/lib/actions';
import { EditQuestionForm } from './edit-question-form';
import type { Question } from '@/lib/types';

function LoadingSkeleton() {
    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <div className="h-8 w-48 bg-muted rounded-md animate-pulse"></div>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <div className="h-9 w-24 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-9 w-28 bg-muted rounded-md animate-pulse"></div>
                </div>
            </div>
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
                <div className="flex flex-col space-y-1.5 p-6">
                    <div className="h-8 w-1/2 bg-muted rounded-md animate-pulse"></div>
                    <div className="h-5 w-1/3 bg-muted rounded-md animate-pulse mt-2"></div>
                </div>
                <div className="p-6 pt-0">
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <div className="h-5 w-24 bg-muted rounded-md animate-pulse"></div>
                            <div className="h-20 w-full bg-muted rounded-md animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="grid gap-3">
                                <div className="h-5 w-40 bg-muted rounded-md animate-pulse"></div>
                                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                           </div>
                           <div className="grid gap-3">
                                <div className="h-5 w-32 bg-muted rounded-md animate-pulse"></div>
                                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                           <div className="grid gap-3">
                                <div className="h-5 w-36 bg-muted rounded-md animate-pulse"></div>
                                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                           </div>
                           <div className="grid gap-3">
                                <div className="h-5 w-36 bg-muted rounded-md animate-pulse"></div>
                                <div className="h-10 w-full bg-muted rounded-md animate-pulse"></div>
                           </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// The page is now an async Server Component
export default async function EditQuestionPage({ params }: { params: { id: string } }) {
    const question = await getQuestion(params.id);

    if (!question) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight font-headline">
                        Question not found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        The requested question with ID "{params.id}" does not exist.
                    </p>
                </div>
            </div>
        );
    }

    return <EditQuestionForm question={question} />;
}