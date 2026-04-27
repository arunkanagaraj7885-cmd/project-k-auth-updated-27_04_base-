'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Mic, MicOff, PhoneOff, Clock, Lightbulb, MessageSquare } from 'lucide-react';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { interviewApi } from '@/lib/api/interview';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectLiveInsights, selectTranscript, addInsight, addMessage, resetSession } from '@/store/slices/interviewSlice';

function SessionTimer({ startTime }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;

  return (
    <div className="flex items-center gap-2 text-slate-300 text-sm">
      <Clock size={14} />
      <span className="font-mono font-medium">
        {String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}
      </span>
    </div>
  );
}

export default function InterviewSessionPage() {
  const { sessionId } = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const insights = useAppSelector(selectLiveInsights);
  const transcript = useAppSelector(selectTranscript);

  const [micActive, setMicActive] = useState(true);
  const [endDialogOpen, setEndDialogOpen] = useState(false);
  const [ending, setEnding] = useState(false);
  const [startTime] = useState(Date.now());
  const [currentQuestion, setCurrentQuestion] = useState('Tell me about yourself.');
  const transcriptEndRef = useRef(null);

  // Scroll transcript to bottom
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Connect WebSocket for live insights & transcript
  useEffect(() => {
    const wsBase = process.env.NEXT_PUBLIC_WS_URL || 'wss://api.projectk.io';
    const ws = new WebSocket(`${wsBase}/ws/v1/interviews/${sessionId}/insights`);

    ws.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'question.asked') {
        setCurrentQuestion(data.question);
      } else if (data.type === 'insight.strength' || data.type === 'insight.tip') {
        dispatch(addInsight(data));
      } else if (data.type === 'transcript.final') {
        dispatch(addMessage({ role: 'user', text: data.text, ts: Date.now() }));
      } else if (data.type === 'session.ended') {
        router.push(`/main/reports/${data.report_id}`);
      }
    };

    const ping = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: 'ping' }));
    }, 30000);

    return () => { ws.close(); clearInterval(ping); };
  }, [sessionId, dispatch, router]);

  const handleEnd = async () => {
    setEnding(true);
    try {
      const res = await interviewApi.endSession(sessionId);
      dispatch(resetSession());
      toast.success('Interview ended! Generating your report…');
      router.push(`/main/reports/${res.data.report_id}`);
    } catch {
      toast.error('Failed to end session. Please try again.');
      setEnding(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-sm font-medium text-slate-300">Live Interview</span>
          <span className="text-slate-600">·</span>
          <span className="text-sm text-slate-400 font-mono">{sessionId?.slice(0, 8)}…</span>
        </div>
        <SessionTimer startTime={startTime} />
      </div>

      {/* Main area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-0 overflow-hidden">
        {/* Avatar + user video */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Avatar panel */}
          <div className="flex-1 bg-slate-900 flex flex-col items-center justify-center relative p-8">
            {/* Avatar placeholder */}
            <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mb-6 shadow-2xl ring-4 ring-blue-500/30">
              <span className="text-6xl">🤖</span>
            </div>

            {/* Current question caption */}
            <div className="max-w-xl bg-slate-800/80 backdrop-blur rounded-2xl px-6 py-4 text-center border border-slate-700">
              <p className="text-xs text-blue-400 font-medium mb-1 uppercase tracking-wide">Current Question</p>
              <p className="text-white text-base leading-relaxed">{currentQuestion}</p>
            </div>

            {/* User self-view */}
            <div className="absolute bottom-4 right-4 w-32 h-24 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              <div className="text-slate-500 text-xs text-center">
                <div className="text-2xl mb-1">👤</div>
                <span>You</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-slate-900 border-t border-slate-800 px-6 py-4 flex items-center justify-center gap-4">
            <button
              onClick={() => setMicActive((v) => !v)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                micActive
                  ? 'bg-slate-700 hover:bg-slate-600 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white'
              }`}
            >
              {micActive ? <Mic size={18} /> : <MicOff size={18} />}
            </button>

            <button
              onClick={() => setEndDialogOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold text-white transition-colors"
            >
              <PhoneOff size={16} />
              End Interview
            </button>
          </div>
        </div>

        {/* Right panel: insights + transcript */}
        <div className="lg:col-span-1 bg-slate-900 border-l border-slate-800 flex flex-col">
          {/* Live Insights */}
          <div className="flex-1 p-4 border-b border-slate-800 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb size={14} className="text-amber-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Live Tips</span>
            </div>
            {insights.length === 0 ? (
              <p className="text-xs text-slate-500">AI insights will appear here as you answer.</p>
            ) : (
              <div className="space-y-2">
                {insights.map((insight, i) => (
                  <div
                    key={i}
                    className={`rounded-xl p-3 text-xs leading-relaxed ${
                      insight.type === 'insight.strength'
                        ? 'bg-green-900/40 text-green-300 border border-green-800/50'
                        : 'bg-amber-900/40 text-amber-300 border border-amber-800/50'
                    }`}
                  >
                    {insight.type === 'insight.strength' ? '✅ ' : '💡 '}
                    {insight.message}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transcript */}
          <div className="h-52 p-4 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare size={14} className="text-blue-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Transcript</span>
            </div>
            {transcript.length === 0 ? (
              <p className="text-xs text-slate-500">Your speech will appear here.</p>
            ) : (
              <div className="space-y-2">
                {transcript.map((msg, i) => (
                  <p key={i} className="text-xs text-slate-400 leading-relaxed">
                    <span className="text-slate-500">[You] </span>{msg.text}
                  </p>
                ))}
                <div ref={transcriptEndRef} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* End session confirm dialog */}
      <ConfirmDialog
        open={endDialogOpen}
        title="End Interview?"
        message="Are you sure you want to end this interview session? Your answers so far will be scored and a report will be generated."
        onConfirm={handleEnd}
        onCancel={() => setEndDialogOpen(false)}
        confirmLabel={ending ? 'Ending…' : 'End Interview'}
        danger
      />
    </div>
  );
}
