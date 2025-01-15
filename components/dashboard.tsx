"use client";

import { motion } from "framer-motion";
import { Timer } from "@/components/timer";
import { Analytics } from "@/components/analytics";
import { Settings } from "@/components/settings";
import { History } from "@/components/history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background p-4 md:p-8"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Focus Flow
          </h1>
          <p className="mt-2 text-muted-foreground">
            Stay productive, track your progress
          </p>
        </header>

        <Tabs defaultValue="timer" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px] mx-auto">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-8">
            <Card className="p-6">
              <Timer />
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card className="p-6">
              <Analytics />
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card className="p-6">
              <History />
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="p-6">
              <Settings />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}