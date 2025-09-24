import { EditQuestionForm } from './edit-question-form';

// The page is now a simple wrapper that renders the client component.
export default function EditQuestionPage({ params }: { params: { id: string } }) {
    return <EditQuestionForm id={params.id} />;
}
