import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { AllTracksPage } from './pages/tracks/AllTracksPage';
import { TrackDetailPage } from './pages/tracks/TrackDetailPage';
import { TopicNotesPage } from './pages/notes/TopicNotesPage';
import { MLFoundationsPage } from './pages/tracks/aiml/MLFoundationsPage';
import { DeepLearningPage } from './pages/tracks/aiml/DeepLearningPage';
import { GenerativeAIPage } from './pages/tracks/aiml/GenerativeAIPage';
import { DevOpsPhaseDetailPage } from './pages/tracks/devops/DevOpsPhaseDetailPage';
import { SystemDesignPhaseDetailPage } from './pages/tracks/systemdesign/SystemDesignPhaseDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tracks" element={<AllTracksPage />} />
          <Route path="tracks/:slug" element={<TrackDetailPage />} />
          <Route path="tracks/ai-ml/ml-foundations" element={<MLFoundationsPage />} />
          <Route path="tracks/ai-ml/deep-learning" element={<DeepLearningPage />} />
          <Route path="tracks/ai-ml/generative-ai" element={<GenerativeAIPage />} />
          <Route path="tracks/devops/:phaseId" element={<DevOpsPhaseDetailPage />} />
          <Route path="tracks/system-design/:phaseId" element={<SystemDesignPhaseDetailPage />} />
          <Route path="topics/:topicId" element={<TopicNotesPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
