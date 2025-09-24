'use server';

import { getQuestion } from '@/lib/actions';
import { EditQuestionForm } from './edit-question-form';

// Server Component Page
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
                        The requested question does not exist.
                    </p>
                </div>
            </div>
        );
    }
    
    return <EditQuestionForm question={question} />;
}
