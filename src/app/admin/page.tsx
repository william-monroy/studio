import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClearLeaderboardButton } from "@/components/admin/clear-leaderboard-button";
import { InitializeQuestionsButton } from "@/components/admin/initialize-questions-button";
import { ClearImageCacheButton } from "@/components/admin/clear-image-cache-button";
import { Users, HelpCircle, BarChart3, Settings } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-1 text-center mb-8">
        <h3 className="text-3xl font-bold tracking-tight font-headline">
          Panel de Control DecisionVerse
        </h3>
        <p className="text-muted-foreground">
          Gestiona las preguntas, jugadores y configuración de tu juego.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Preguntas</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gestionar</div>
            <p className="text-xs text-muted-foreground mb-4">
              Crear, editar y organizar preguntas del juego
            </p>
            <div className="space-y-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/admin/questions">Ver Preguntas</Link>
              </Button>
              <InitializeQuestionsButton />
              <ClearImageCacheButton />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jugadores</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Leaderboard</div>
            <p className="text-xs text-muted-foreground mb-4">
              Ver puntuaciones y gestionar jugadores
            </p>
            <div className="space-y-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/admin/players">Ver Jugadores</Link>
              </Button>
              <ClearLeaderboardButton />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analíticas</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Estadísticas</div>
            <p className="text-xs text-muted-foreground mb-4">
              Ver métricas y análisis del juego
            </p>
            <Button asChild size="sm" className="w-full">
              <Link href="/admin/analytics">Ver Analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
