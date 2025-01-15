"use client";

import { useFocusStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";

export function Analytics() {
  const { sessions } = useFocusStore();

  const completedSessions = sessions.filter((session) => session.completed);
  const totalSessions = completedSessions.length;
  const averageDuration =
    totalSessions > 0
      ? completedSessions.reduce((acc, session) => acc + session.duration, 0) /
        totalSessions /
        60
      : 0;
  const completionRate =
    (completedSessions.length / (sessions.length || 1)) * 100;

  // Group sessions by day for the chart
  const sessionsByDay = completedSessions.reduce((acc, session) => {
    const day = format(new Date(session.startTime), "MM/dd");
    acc[day] = (acc[day] || 0) + session.duration / 60;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(sessionsByDay)
    .slice(-7)
    .map(([date, minutes]) => ({
      date,
      minutes: Math.round(minutes),
    }));

  const chartProps = {
    data: chartData,
    margin: { top: 10, right: 10, left: 10, bottom: 10 },
  };

  const axisProps = {
    stroke: "hsl(var(--border))",
    style: {
      fontSize: "12px",
      fontFamily: "inherit",
    },
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Sessions
          </h3>
          <p className="text-2xl font-bold">{totalSessions}</p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Average Duration
          </h3>
          <p className="text-2xl font-bold">
            {Math.round(averageDuration)} min
          </p>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Completion Rate
          </h3>
          <p className="text-2xl font-bold">{Math.round(completionRate)}%</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Focus Time Last 7 Days
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart {...chartProps}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />
              <XAxis dataKey="date" {...axisProps} tickMargin={8} />
              <YAxis
                {...axisProps}
                tickMargin={8}
                label={{
                  value: "Minutes",
                  angle: -90,
                  position: "insideLeft",
                  style: {
                    fill: "hsl(var(--muted-foreground))",
                    textAnchor: "middle",
                  },
                  dy: -40,
                }}
              />
              <Tooltip
                cursor={{ fill: "hsl(var(--muted))" }}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  padding: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                itemStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Bar
                dataKey="minutes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
