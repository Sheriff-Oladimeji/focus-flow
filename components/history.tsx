"use client";

import { useFocusStore } from "@/lib/store";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Tag, Clock, CheckCircle, XCircle } from "lucide-react";

export function History() {
  const { sessions } = useFocusStore();

  return (
    <div className="space-y-4">
      {sessions.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No sessions recorded yet. Start your first focus session!
        </p>
      ) : (
        sessions
          .slice()
          .reverse()
          .map((session) => (
            <Card
              key={session.id}
              className="p-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                {session.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div>
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span className="font-medium">{session.tag}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{session.duration / 60} minutes</span>
                  </div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(session.startTime), "MMM d, yyyy h:mm a")}
              </div>
            </Card>
          ))
      )}
    </div>
  );
}