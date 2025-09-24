import { getQuestion } from '@/lib/actions';
import { EditQuestionForm } from './edit-question-form';

// The page is now an async Server Component.
// It fetches the data on the server and passes it to the client form.
export default async function EditQuestionPage({ params }: { params: { id: string } }) {
    const question = await getQuestion(params.id);
    
    // We pass the entire question object to the client component.
    return <EditQuestionForm question={question} />;
}