"use client";

import { useFocusStore } from "@/lib/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

export function Settings() {
  const { settings, updateSettings } = useFocusStore();

  const handleSettingChange = (
    key: keyof typeof settings,
    value: string | number | boolean
  ) => {
    updateSettings({ [key]: value });
    toast.success("Settings updated successfully");
  };

  return (
    <div className="space-y-6">
      <Card className="p-4 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="defaultFocusDuration">
            Default Focus Duration (minutes)
          </Label>
          <Input
            id="defaultFocusDuration"
            type="number"
            value={settings.defaultFocusDuration.toString()}
            onChange={(e) =>
              handleSettingChange(
                "defaultFocusDuration",
                Math.max(1, Math.min(120, parseInt(e.target.value) || 1))
              )
            }
            min="1"
            max="120"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="defaultBreakDuration">
            Default Break Duration (minutes)
          </Label>
          <Input
            id="defaultBreakDuration"
            type="number"
            value={settings.defaultBreakDuration.toString()}
            onChange={(e) =>
              handleSettingChange(
                "defaultBreakDuration",
                Math.max(1, Math.min(30, parseInt(e.target.value) || 1))
              )
            }
            min="1"
            max="30"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="soundEnabled">Sound Notifications</Label>
          <Switch
            id="soundEnabled"
            checked={settings.soundEnabled}
            onCheckedChange={(checked) =>
              handleSettingChange("soundEnabled", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(value) =>
              handleSettingChange(
                "theme",
                value as "light" | "dark" | "system"
              )
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
    </div>
  );
}