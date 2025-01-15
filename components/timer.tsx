"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useFocusStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Play,
  Pause,
  RotateCcw,
  Tag as TagIcon,
  Clock,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function Timer() {
  const { settings, currentSession, setCurrentSession, addSession, updateSession } =
    useFocusStore();
  const [timeLeft, setTimeLeft] = useState(settings.defaultFocusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [tag, setTag] = useState("Work");
  const [customDuration, setCustomDuration] = useState(
    settings.defaultFocusDuration.toString()
  );

  const startTimer = useCallback(() => {
    if (!currentSession) {
      const newSession = {
        id: crypto.randomUUID(),
        duration: parseInt(customDuration) * 60,
        breakDuration: settings.defaultBreakDuration * 60,
        tag,
        startTime: new Date().toISOString(),
        completed: false,
      };
      setCurrentSession(newSession);
      setTimeLeft(newSession.duration);
    }
    setIsRunning(true);
  }, [
    currentSession,
    customDuration,
    setCurrentSession,
    settings.defaultBreakDuration,
    tag,
  ]);

  const pauseTimer = () => {
    setIsRunning(false);
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        paused: true,
        pausedAt: new Date().toISOString(),
      };
      updateSession(updatedSession);
    }
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(parseInt(customDuration) * 60);
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        completed: false,
        endTime: new Date().toISOString(),
      };
      updateSession(updatedSession);
      setCurrentSession(null);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && currentSession) {
      const updatedSession = {
        ...currentSession,
        completed: true,
        endTime: new Date().toISOString(),
      };
      updateSession(updatedSession);
      addSession(updatedSession);
      setCurrentSession(null);
      toast.success("Focus session completed!");
      if (settings.soundEnabled) {
        // Play sound
        const audio = new Audio("/notification.mp3");
        audio.play().catch((e) => console.error("Error playing sound:", e));
      }
    }

    return () => clearInterval(interval);
  }, [
    isRunning,
    timeLeft,
    currentSession,
    settings.soundEnabled,
    addSession,
    updateSession,
    setCurrentSession,
  ]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress =
    currentSession && ((currentSession.duration - timeLeft) / currentSession.duration) * 100;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              min="1"
              max="120"
              disabled={isRunning}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Session Tag</Label>
            <div className="flex space-x-2">
              <Input
                id="tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                disabled={isRunning}
              />
              <TagIcon className="w-6 h-6 text-muted-foreground" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <motion.div
            className="text-center"
            initial={{ scale: 1 }}
            animate={{ scale: isRunning ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 1, repeat: isRunning ? Infinity : 0 }}
          >
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <span className="text-4xl font-bold tabular-nums">
                {minutes.toString().padStart(2, "0")}:
                {seconds.toString().padStart(2, "0")}
              </span>
            </div>
            {currentSession && (
              <Progress value={progress} className="mb-4" />
            )}
          </motion.div>

          <div className="flex justify-center space-x-4">
            <Button
              variant={isRunning ? "secondary" : "default"}
              size="lg"
              onClick={isRunning ? pauseTimer : startTimer}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4 mr-2" /> Pause
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" /> Start
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={resetTimer}
              disabled={!currentSession && !isRunning}
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}