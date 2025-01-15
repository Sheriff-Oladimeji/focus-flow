import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addDays, isToday, startOfDay } from 'date-fns';

export interface FocusSession {
  id: string;
  duration: number;
  breakDuration: number;
  tag: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  paused?: boolean;
  pausedAt?: string;
  totalPausedTime?: number;
}

interface FocusState {
  sessions: FocusSession[];
  currentSession: FocusSession | null;
  settings: {
    defaultFocusDuration: number;
    defaultBreakDuration: number;
    soundEnabled: boolean;
    theme: 'light' | 'dark' | 'system';
  };
  streak: {
    current: number;
    lastSessionDate: string | null;
  };
  addSession: (session: FocusSession) => void;
  updateSession: (session: FocusSession) => void;
  setCurrentSession: (session: FocusSession | null) => void;
  updateSettings: (settings: Partial<FocusState['settings']>) => void;
  updateStreak: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      sessions: [],
      currentSession: null,
      settings: {
        defaultFocusDuration: 25,
        defaultBreakDuration: 5,
        soundEnabled: true,
        theme: 'system',
      },
      streak: {
        current: 0,
        lastSessionDate: null,
      },
      addSession: (session) =>
        set((state) => ({
          sessions: [...state.sessions, session],
        })),
      updateSession: (session) =>
        set((state) => ({
          sessions: state.sessions.map((s) =>
            s.id === session.id ? session : s
          ),
        })),
      setCurrentSession: (session) =>
        set(() => ({
          currentSession: session,
        })),
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),
      updateStreak: () => {
        const { streak, sessions } = get();
        const lastSession = sessions[sessions.length - 1];
        
        if (!lastSession) return;

        const lastSessionDate = new Date(lastSession.endTime || '');
        const today = startOfDay(new Date());
        const yesterday = startOfDay(addDays(today, -1));

        set((state) => {
          if (!state.streak.lastSessionDate || isToday(lastSessionDate)) {
            return {
              streak: {
                current: state.streak.current + 1,
                lastSessionDate: lastSessionDate.toISOString(),
              },
            };
          } else if (lastSessionDate.getTime() === yesterday.getTime()) {
            return state;
          } else {
            return {
              streak: {
                current: 1,
                lastSessionDate: lastSessionDate.toISOString(),
              },
            };
          }
        });
      },
    }),
    {
      name: 'focus-store',
    }
  )
);