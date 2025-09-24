import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-2xl font-bold tracking-tight font-headline">
          Bienvenido al Panel de Control
        </h3>
        <p className="text-sm text-muted-foreground">
          Gestiona las preguntas y la configuración de tu juego aquí.
        </p>
      </div>
    </div>
  );
}
