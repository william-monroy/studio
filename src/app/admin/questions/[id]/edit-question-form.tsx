'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateQuestion } from '@/lib/actions';
import type { Question } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button size="sm" type="submit" disabled={pending}>
        {pending ? 'Guardando...' : 'Guardar Cambios'}
      </Button>
    );
}

export function EditQuestionForm({ question }: { question: Question | null }) {
    const router = useRouter();
    const { toast } = useToast();
    
    const updateQuestionWithId = question ? updateQuestion.bind(null, question.id) : async () => ({ error: 'ID de pregunta no encontrado.' });
    const [state, formAction] = useActionState(updateQuestionWithId, null);


    useEffect(() => {
        if (state?.success) {
            toast({ title: "Pregunta Actualizada", description: "Los cambios se han guardado correctamente."});
            router.push('/admin/questions');
        } else if (state?.error) {
            toast({
                variant: "destructive",
                title: "Error al actualizar",
                description: state.error,
            });
        }
    }, [state, router, toast]);

    if (!question) {
        return (
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight font-headline">
                        Pregunta no encontrada
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        La pregunta solicitada no existe o no se pudo cargar.
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={() => router.back()}>
                        Volver
                    </Button>
                </div>
            </div>
        );
    }
    
    return (
        <form action={formAction} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
                    Editar Pregunta
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                        Descartar
                    </Button>
                    <SubmitButton />
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Detalles de la Pregunta</CardTitle>
                    <CardDescription>Editando la pregunta con ID: {question.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="text">Texto de la Pregunta</Label>
                            <Textarea id="text" name="text" placeholder="e.g. ¿Invertir en propiedades en el metaverso?" defaultValue={question.text} />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="successProb">Probabilidad de Éxito (0.0 a 1.0)</Label>
                                <Input id="successProb" name="successProb" type="number" step="0.1" min="0" max="1" placeholder="0.5" defaultValue={question.successProb} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="timeLimitSec">Límite de Tiempo (segundos)</Label>
                                <Input id="timeLimitSec" name="timeLimitSec" type="number" step="1" min="5" placeholder="15" defaultValue={question.timeLimitSec} />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="mediaPosUrl">URL de Media Positiva</Label>
                                <Input id="mediaPosUrl" name="mediaPosUrl" placeholder="https://example.com/success.gif" defaultValue={question.mediaPosUrl} />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="mediaNegUrl">URL de Media Negativa</Label>
                                <Input id="mediaNegUrl" name="mediaNegUrl" placeholder="https://example.com/fail.gif" defaultValue={question.mediaNegUrl} />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
             <div className="flex items-center justify-center gap-2 md:hidden">
                <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                    Descartar
                </Button>
                <SubmitButton />
            </div>
        </form>
    );
}
