'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { deleteQuestion } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle, Trash2, Edit } from "lucide-react";
import Link from "next/link";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import type { Question } from "@/lib/types";
import { useTransition } from "react";
import { useToast } from "@/hooks/use-toast";

function DeleteAction({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    const handleDelete = () => {
        startTransition(async () => {
            try {
                await deleteQuestion(id);
                toast({
                    title: "Pregunta eliminada",
                    description: "La pregunta se ha eliminado correctamente.",
                });
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error al eliminar",
                    description: "No se pudo eliminar la pregunta. Inténtalo de nuevo.",
                });
            }
        });
    };

    return (
        <DropdownMenuItem onSelect={(e) => e.preventDefault()} onClick={handleDelete} className="text-destructive" disabled={isPending}>
            {isPending ? (
                <>
                    <MoreHorizontal className="mr-2 h-4 w-4 animate-spin" />
                    Eliminando...
                </>
            ) : (
                <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar
                </>
            )}
        </DropdownMenuItem>
    );
}

export default function AdminQuestionsClient({ questions }: { questions: Question[] }) {
    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Preguntas</h1>
                <div className="ml-auto flex items-center gap-2">
                    <Button size="sm" className="h-8 gap-1" asChild>
                        <Link href="/admin/questions/new">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Añadir Pregunta
                            </span>
                        </Link>
                    </Button>
                </div>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Preguntas del Juego</CardTitle>
                    <CardDescription>Gestiona las preguntas para DecisionVerse.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Estado</TableHead>
                                <TableHead>Texto de la Pregunta</TableHead>
                                <TableHead className="text-right">Prob. de Éxito</TableHead>
                                <TableHead className="text-right">Límite de Tiempo</TableHead>
                                <TableHead><span className="sr-only">Acciones</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell>
                                        <Badge variant={q.active ? "default" : "secondary"}>{q.active ? "Activa" : "Inactiva"}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-sm truncate">{q.text}</TableCell>
                                    <TableCell className="text-right">{q.successProb}</TableCell>
                                    <TableCell className="text-right">{q.timeLimitSec}s</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/questions/${q.id}`}>
                                                        <Edit className="mr-2 h-4 w-4" />
                                                        Editar
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DeleteAction id={q.id} />
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {questions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">No se encontraron preguntas.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );
}
