import { getLeaderboard } from "@/lib/actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function AdminPlayersPage() {
    const players = await getLeaderboard();

    return (
        <>
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl font-headline">Players</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>DecisionVerse Players</CardTitle>
                    <CardDescription>List of all players and their best scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Rank</TableHead>
                                <TableHead>Nickname</TableHead>
                                <TableHead className="text-right">High Score</TableHead>
                                <TableHead className="text-right">Best Time</TableHead>
                                <TableHead>Last Played</TableHead>
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
                                        No players yet.
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