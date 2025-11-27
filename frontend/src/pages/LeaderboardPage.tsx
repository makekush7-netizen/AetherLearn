import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  streak: number;
}

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const currentUserId = localStorage.getItem("userId") || "101";

  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, name: "Alice Johnson", score: 950, streak: 12 },
    { rank: 2, name: "Bob Smith", score: 920, streak: 10 },
    { rank: 3, name: "Carol Davis", score: 890, streak: 8 },
    { rank: 4, name: "David Wilson", score: 850, streak: 7 },
    { rank: 5, name: "You", score: 820, streak: 7 },
    { rank: 6, name: "Eve Brown", score: 790, streak: 5 },
    { rank: 7, name: "Frank Miller", score: 750, streak: 4 },
  ];

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return null;
  };

  return (
    <Sidebar>
      <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="gradient-hero text-white rounded-2xl p-8 mb-6 shadow-elevated">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Class Leaderboard</h1>
            <p className="text-center opacity-90">See how you rank among your classmates</p>
          </div>

          {/* Leaderboard Table */}
          <Card className="overflow-hidden shadow-elevated">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Rank
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Student
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Score
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
                      Streak
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leaderboard.map((entry) => {
                    const isCurrentUser = entry.name === "You";
                    return (
                      <tr
                        key={entry.rank}
                        className={`transition-colors ${
                          isCurrentUser
                            ? "bg-primary/10 font-medium"
                            : "hover:bg-muted/50"
                        }`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {getMedalIcon(entry.rank) || (
                              <span className="text-muted-foreground font-semibold">
                                #{entry.rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-foreground font-medium">
                            {entry.name}
                            {isCurrentUser && (
                              <span className="ml-2 text-xs text-primary">(You)</span>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-foreground font-semibold">
                            {entry.score}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-accent font-semibold">
                            {entry.streak} days
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-foreground mb-3">How Scoring Works</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Complete lectures to earn base points</li>
              <li>• Quiz scores add bonus points</li>
              <li>• Test performance gives the most points</li>
              <li>• Maintain your streak for daily bonuses</li>
            </ul>
            <p className="mt-4 text-sm text-primary font-medium">
              Keep learning to climb the leaderboard! 🚀
            </p>
          </Card>
        </div>
      </main>
    </div>
    </Sidebar>
  );
};

export default LeaderboardPage;
