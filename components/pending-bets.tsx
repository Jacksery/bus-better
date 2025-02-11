import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PendingBets() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Bets</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">
          This is a pending bets component.
        </p>
      </CardContent>
    </Card>
  );
}
