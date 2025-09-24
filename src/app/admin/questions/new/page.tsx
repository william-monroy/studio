'use client';

import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createQuestion } from '@/lib/actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button size="sm" type="submit" disabled={pending}>
        {pending ? 'Guardando...' : 'Guardar Pregunta'}
      </Button>
    );
}

export default function NewQuestionPage() {
    const router = useRouter();

    return (
        <form action={createQuestion} className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
                    Nueva Pregunta
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
                    <CardDescription>Completa los detalles para la nueva pregunta.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="text">Texto de la Pregunta</Label>
                            <Textarea id="text" name="text" placeholder="e.g. ¿Invertir en propiedades en el metaverso?" />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="successProb">Probabilidad de Éxito (0.0 a 1.0)</Label>
                                <Input id="successProb" name="successProb" type="number" step="0.1" min="0" max="1" placeholder="0.5" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="timeLimitSec">Límite de Tiempo (segundos)</Label>
                                <Input id="timeLimitSec" name="timeLimitSec" type="number" step="1" min="5" placeholder="15" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="mediaPosUrl">URL de Media Positiva</Label>
                                <Input id="mediaPosUrl" name="mediaPosUrl" placeholder="https://example.com/success.gif" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="mediaNegUrl">URL de Media Negativa</Label>
                                <Input id="mediaNegUrl" name="mediaNegUrl" placeholder="https://example.com/fail.gif" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}
