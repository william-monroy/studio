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
import { useGameStore } from "@/store/game-store";

type LeaderboardTableProps = {
  scores: ScoreEntry[];
};

export function LeaderboardTable({ scores }: LeaderboardTableProps) {
  const nickname = useGameStore(state => state.nickname);
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
            <TableRow key={score.id} className={cn(score.nickname === nickname && "bg-primary/20 hover:bg-primary/30")}>
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
