import React, { useState, useEffect } from 'react';
import { GameView, UserProgress } from './types/game';
import { LEVELS } from './data/levels';
import { loadProgress, saveProgress, completeLevelSave, unlockProducts, resetAllProgress } from './utils/storage';
import { audio } from './utils/audio';
import { MainMenu } from './components/MainMenu';
import { GameBoard } from './components/GameBoard';
import { LevelSelectModal } from './components/LevelSelectModal';
import { CollectionModal } from './components/CollectionModal';
import { SettingsModal } from './components/SettingsModal';
import { HowToPlayModal } from './components/HowToPlayModal';

export default function App() {
  const [currentView, setCurrentView] = useState<GameView>('MENU');
  const [progress, setProgress] = useState<UserProgress>(loadProgress);
  const [activeLevelNumber, setActiveLevelNumber] = useState<number>(1);

  // Sync audio options from progress on load
  useEffect(() => {
    audio.setSoundEnabled(progress.soundEnabled);
    audio.setMusicEnabled(progress.musicEnabled);
    audio.setVibrationEnabled(progress.vibrationEnabled);
  }, [progress.soundEnabled, progress.musicEnabled, progress.vibrationEnabled]);

  // Update Settings helper
  const handleUpdateSettings = (newSettings: Partial<UserProgress>) => {
    const updated: UserProgress = {
      ...progress,
      ...newSettings,
    };
    setProgress(updated);
    saveProgress(updated);

    if (newSettings.soundEnabled !== undefined) {
      audio.setSoundEnabled(newSettings.soundEnabled);
    }
    if (newSettings.musicEnabled !== undefined) {
      audio.setMusicEnabled(newSettings.musicEnabled);
    }
    if (newSettings.vibrationEnabled !== undefined) {
      audio.setVibrationEnabled(newSettings.vibrationEnabled);
    }
  };

  // Reset Progress helper
  const handleResetProgress = () => {
    const fresh = resetAllProgress();
    setProgress(fresh);
    setActiveLevelNumber(1);
    setCurrentView('MENU');
  };

  // Start Playing level
  const handleStartLevel = (lvlNum: number) => {
    audio.playTap();
    const validLevel = Math.max(1, Math.min(LEVELS.length, lvlNum));
    setActiveLevelNumber(validLevel);
    setCurrentView('PLAYING');
  };

  // Level Complete Callback
  const handleLevelComplete = (
    levelNumber: number,
    score: number,
    stars: number,
    newlyUnlockedIds: string[]
  ) => {
    let updated = completeLevelSave(progress, levelNumber, stars, score);
    if (newlyUnlockedIds.length > 0) {
      updated = unlockProducts(updated, newlyUnlockedIds);
    }
    setProgress(updated);

    // Proceed to next level if available
    if (levelNumber < LEVELS.length) {
      setActiveLevelNumber(levelNumber + 1);
    } else {
      setCurrentView('MENU');
    }
  };

  // Active level data
  const currentLevelData = LEVELS.find((l) => l.levelNumber === activeLevelNumber) || LEVELS[0];

  return (
    <div className="min-h-screen w-full bg-slate-200 text-slate-800 flex justify-center items-center overflow-x-hidden font-sans">
      {/* Mobile constraint container for authentic mobile phone feel */}
      <div className="w-full max-w-md min-h-screen relative flex flex-col shadow-2xl bg-white overflow-hidden border-x border-slate-300/40">
        {currentView === 'MENU' && (
          <MainMenu
            progress={progress}
            onPlay={() => handleStartLevel(progress.currentLevel)}
            onOpenLevels={() => setCurrentView('LEVEL_SELECT')}
            onOpenCollection={() => setCurrentView('COLLECTION')}
            onOpenSettings={() => setCurrentView('SETTINGS')}
            onOpenHowToPlay={() => setCurrentView('HOW_TO_PLAY')}
          />
        )}

        {currentView === 'PLAYING' && (
          <GameBoard
            level={currentLevelData}
            progress={progress}
            onLevelComplete={handleLevelComplete}
            onLevelSelect={() => setCurrentView('LEVEL_SELECT')}
            onMainMenu={() => setCurrentView('MENU')}
            onUpdateSettings={handleUpdateSettings}
          />
        )}

        {currentView === 'LEVEL_SELECT' && (
          <LevelSelectModal
            progress={progress}
            onSelectLevel={(lvlNum) => handleStartLevel(lvlNum)}
            onBack={() => setCurrentView('MENU')}
          />
        )}

        {currentView === 'COLLECTION' && (
          <CollectionModal
            unlockedProductIds={progress.unlockedProductIds}
            onBack={() => setCurrentView('MENU')}
          />
        )}

        {currentView === 'SETTINGS' && (
          <SettingsModal
            progress={progress}
            onUpdateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
            onBack={() => setCurrentView('MENU')}
          />
        )}

        {currentView === 'HOW_TO_PLAY' && (
          <HowToPlayModal onBack={() => setCurrentView('MENU')} />
        )}
      </div>
    </div>
  );
}
