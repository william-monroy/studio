import { getLeaderboard } from "@/lib/actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ClearLeaderboardButton } from "@/components/admin/clear-leaderboard-button";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function AdminPlayersPage() {
    const players = await getLeaderboard();

    return (
        <>
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Jugadores</h1>
                <ClearLeaderboardButton />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Jugadores de DecisionVerse</CardTitle>
                    <CardDescription>
                        Lista de todos los jugadores y sus mejores puntajes. 
                        {players.length > 0 && (
                            <span className="text-sm text-muted-foreground ml-2">
                                ({players.length} jugadores registrados)
                            </span>
                        )}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rango</TableHead>
                                <TableHead>Nickname</TableHead>
                                <TableHead className="text-right">Puntaje Máximo</TableHead>
                                <TableHead className="text-right">Mejor Tiempo</TableHead>
                                <TableHead>Última Partida</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {players.map((p, index) => (
                                <TableRow key={p.id}>
                                    <TableCell className="font-medium">
                                        <Badge variant={index < 3 ? "default" : "secondary"}>#{index + 1}</Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">{p.nickname}</TableCell>
                                    <TableCell className="text-right">{p.score}</TableCell>
                                    <TableCell className="text-right">{(p.totalTimeMs / 1000).toFixed(2)}s</TableCell>
                                    <TableCell>{formatDistanceToNow(new Date(p.createdAt), { addSuffix: true, locale: es })}</TableCell>
                                </TableRow>
                            ))}
                             {players.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center h-24">
                                        Aún no hay jugadores.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}