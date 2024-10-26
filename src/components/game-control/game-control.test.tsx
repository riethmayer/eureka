/// <reference types="vitest" />
import { vi, describe, beforeEach, it, expect, Mocked } from 'vitest';
import { render, screen } from '@testing-library/react';

import { useGameStore } from '@/zustand/game-store';
import { usePathname } from 'next/navigation';

import GameControl from '@/components/game-control/game-control';
// Mock the usePathname hook
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock the useGameStore hook
vi.mock('@/zustand/game-store', () => ({
  useGameStore: vi.fn(),
}));


type MockedFunction<T extends (...args: any) => any> = {
  mockReturnValue: (value: ReturnType<T>) => void;
} & T

// Mock the useGameStore hook
describe('GameControl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders PlayButton when pathname is "/play" and game is not running', () => {
    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue('/play');
    (useGameStore as MockedFunction<typeof useGameStore>).mockReturnValue({
      getState: () => ({
        isLevelClear: () => false,
        isGameRunning: () => false,
        start: vi.fn(),
      }),
    });


    render(<GameControl />);

    expect(screen.getByText('Start New')).toBeInTheDocument();
  });

  it('renders PausedButton when pathname is "/play" and game is running', () => {
    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue('/play');
    (useGameStore as MockedFunction<typeof useGameStore>).mockReturnValue({
      getState: () => ({
        isLevelClear: () => false,
        isGameRunning: () => true,
        start: vi.fn(),
      }),
    });


    render(<GameControl />);

    expect(screen.getByText('Pause')).toBeInTheDocument();
  });

  it('renders NextLevelButton when pathname is "/play" and level is clear', () => {
    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue('/play');
    (useGameStore as MockedFunction<typeof useGameStore>).mockReturnValue({
      getState: () => ({
        isLevelClear: () => true,
        isGameRunning: () => false,
        start: vi.fn(),
      }),
    });


    render(<GameControl />);

    expect(screen.getByText('Next Level')).toBeInTheDocument();
  });

  it('renders ResumeButton when pathname is "/paused"', () => {
    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue('/paused');
    (useGameStore as MockedFunction<typeof useGameStore>).mockReturnValue({
      getState: () => ({
        isLevelClear: () => false,
        isGameRunning: () => false,
      }),
    });;

    render(<GameControl />);

    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('renders RestartButton when game is running', () => {
    (usePathname as MockedFunction<typeof usePathname>).mockReturnValue('/play');
    (useGameStore as MockedFunction<typeof useGameStore>).mockReturnValue({
      getState: () => ({
        isLevelClear: () => false,
        isGameRunning: () => true,
      }),
    });;


    render(<GameControl />);

    expect(screen.getByText('Restart')).toBeInTheDocument();
  });
});

