'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ScoreEntry } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Crown } from "lucide-react";

type LeaderboardTableProps = {
  scores: ScoreEntry[];
  currentSessionId?: string;
};

export function LeaderboardTable({ scores, currentSessionId }: LeaderboardTableProps) {
  return (
    <div className="rounded-lg border shadow-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16 text-center font-headline">Rango</TableHead>
            <TableHead className="font-headline">Nickname</TableHead>
            <TableHead className="text-right font-headline">Puntaje</TableHead>
            <TableHead className="text-right font-headline">Tiempo Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score, index) => (
            <TableRow key={score.id} className={cn(score.sessionId === currentSessionId && "bg-primary/20 hover:bg-primary/30")}>
              <TableCell className="text-center font-bold text-lg">
                <div className="flex justify-center items-center">
                    {index === 0 && <Crown className="w-6 h-6 text-yellow-500 mr-2" />}
                    {index + 1}
                </div>
              </TableCell>
              <TableCell className="font-medium">{score.nickname}</TableCell>
              <TableCell className="text-right font-mono font-bold">{score.score}</TableCell>
              <TableCell className="text-right font-mono">{(score.totalTimeMs / 1000).toFixed(2)}s</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
