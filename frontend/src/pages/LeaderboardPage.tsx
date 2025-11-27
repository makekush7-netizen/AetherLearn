import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Trophy, Medal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { leaderboardAPI, LeaderboardEntry } from "@/services/api";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fallback data for offline mode
  const fallbackLeaderboard: LeaderboardEntry[] = [
    { rank: 1, userId: 1, name: "Alice Johnson", score: 950, streak: 12, isCurrentUser: false },
    { rank: 2, userId: 2, name: "Bob Smith", score: 920, streak: 10, isCurrentUser: false },
    { rank: 3, userId: 3, name: "Carol Davis", score: 890, streak: 8, isCurrentUser: false },
    { rank: 4, userId: 4, name: "David Wilson", score: 850, streak: 7, isCurrentUser: false },
    { rank: 5, userId: 5, name: "You", score: 820, streak: 7, isCurrentUser: true },
    { rank: 6, userId: 6, name: "Eve Brown", score: 790, streak: 5, isCurrentUser: false },
    { rank: 7, userId: 7, name: "Frank Miller", score: 750, streak: 4, isCurrentUser: false },
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.getLeaderboard();
        setLeaderboard(response.leaderboard);
      } catch (error) {
        // Use fallback data if offline
        setLeaderboard(fallbackLeaderboard);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return <span className="text-2xl">🥇</span>;
    if (rank === 2) return <span className="text-2xl">🥈</span>;
    if (rank === 3) return <span className="text-2xl">🥉</span>;
    return null;
  };

  // Prepare line chart data for top 5 students
  const top5 = leaderboard.slice(0, 5);
  const lineChartData = {
    labels: top5.map((entry) => entry.name),
    datasets: [
      {
        label: "Student Scores",
        data: top5.map((entry) => entry.score),
        borderColor: "rgb(168, 85, 247)",
        backgroundColor: "rgba(168, 85, 247, 0.1)",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointBackgroundColor: "rgb(168, 85, 247)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  // Prepare pie chart data for score distribution
  const pieChartData = {
    labels: leaderboard.slice(0, 7).map((entry) => entry.name),
    datasets: [
      {
        data: leaderboard.slice(0, 7).map((entry) => entry.score),
        backgroundColor: [
          "rgba(168, 85, 247, 0.8)",
          "rgba(59, 130, 246, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(251, 146, 60, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(244, 114, 182, 0.8)",
          "rgba(99, 102, 241, 0.8)",
        ],
        borderColor: [
          "rgb(168, 85, 247)",
          "rgb(59, 130, 246)",
          "rgb(16, 185, 129)",
          "rgb(251, 146, 60)",
          "rgb(239, 68, 68)",
          "rgb(244, 114, 182)",
          "rgb(99, 102, 241)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        labels: {
          color: "rgb(148, 163, 184)",
          font: { size: 12 },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 12,
        cornerRadius: 8,
      },
    },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">

      <main className="flex-1 container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => navigate("/dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="gradient-hero text-white rounded-2xl p-8 mb-6 shadow-elevated">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="h-12 w-12" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">Class Leaderboard</h1>
            <p className="text-center opacity-90">See how you rank among your classmates</p>
          </div>

          {/* Charts Section */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Line Chart - Top 5 Scores */}
            <Card className="p-6 shadow-elevated">
              <h2 className="text-xl font-bold text-foreground mb-4">Top 5 Scores Trend</h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
              )}
            </Card>

            {/* Pie Chart - Score Distribution */}
            <Card className="p-6 shadow-elevated">
              <h2 className="text-xl font-bold text-foreground mb-4">Top 7 Score Distribution</h2>
              {isLoading ? (
                <div className="h-64 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="h-64 flex items-center justify-center">
                  <Pie
                    data={pieChartData}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: "bottom" as const,
                        },
                      },
                    }}
                  />
                </div>
              )}
            </Card>
          </div>
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
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
                        <p className="text-muted-foreground mt-2">Loading leaderboard...</p>
                      </td>
                    </tr>
                  ) : leaderboard.map((entry) => {
                    return (
                      <tr
                        key={entry.rank}
                        className={`transition-colors ${
                          entry.isCurrentUser
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
                            {entry.isCurrentUser && (
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
  );
};

export default LeaderboardPage;
