import { EditQuestionForm } from './edit-question-form';

// The page is now a simple component that passes the id to the client form.
export default function EditQuestionPage({ params }: { params: { id: string } }) {
    // We pass the ID to the client component, not the whole params object.
    return <EditQuestionForm id={params.id} />;
}
