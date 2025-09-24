'use server';

import { getQuestions } from "@/lib/actions";
import AdminQuestionsClient from "./questions-client";

// Server Component Page
export default async function AdminQuestionsPage() {
    const questions = await getQuestions();
    return <AdminQuestionsClient questions={questions} />;
}
