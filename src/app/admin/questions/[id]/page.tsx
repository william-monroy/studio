// This is a stub for the edit page.
// In a real application, you would fetch the question data based on the `id` parameter
// and pre-fill the form fields.

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function EditQuestionPage({ params }: { params: { id: string } }) {
    return (
        <div className="mx-auto grid max-w-[59rem] flex-1 auto-rows-max gap-4">
            <div className="flex items-center gap-4">
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0 font-headline">
                    Edit Question
                </h1>
                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                    <Button variant="outline" size="sm">
                        Discard Changes
                    </Button>
                    <Button size="sm">Save Question</Button>
                </div>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Question Details</CardTitle>
                    <CardDescription>Editing question with ID: {params.id}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="text">Question Text</Label>
                            <Textarea id="text" placeholder="e.g. ¿Invertir en propiedades en el metaverso?" defaultValue="Example question from DB..." />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="successProb">Success Probability (0.0 to 1.0)</Label>
                                <Input id="successProb" type="number" step="0.1" min="0" max="1" placeholder="0.5" defaultValue="0.6" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="timeLimitSec">Time Limit (seconds)</Label>
                                <Input id="timeLimitSec" type="number" step="1" min="5" placeholder="15" defaultValue="10" />
                            </div>
                        </div>
                         <div className="grid grid-cols-2 gap-6">
                            <div className="grid gap-3">
                                <Label htmlFor="mediaPosUrl">Positive Media URL</Label>
                                <Input id="mediaPosUrl" placeholder="https://example.com/success.gif" />
                            </div>
                            <div className="grid gap-3">
                                <Label htmlFor="mediaNegUrl">Negative Media URL</Label>
                                <Input id="mediaNegUrl" placeholder="https://example.com/fail.gif" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
