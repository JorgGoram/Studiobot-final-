import React, { useEffect, useState } from 'react';
import {
  Phone,
  User,
  Clock,
  Check,
  X,
  MoreVertical,
  Search,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { listCalls } from '../../lib/synthflow';
import { Call } from '../../types';
import { convertSecondsToHHMMSS } from '../../utils';

interface CallHistoryPropsType {
  modelId: string | undefined;
}

interface TranscriptModalProps {
  transcript: string;
  onClose: () => void;
}

function TranscriptModal({ transcript, onClose }: TranscriptModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#0A0A0F] rounded-2xl w-full max-w-2xl shadow-2xl border border-[#904af2]/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-[#904af2]/20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#904af2]" />
            <h2 className="text-xl font-semibold">Call Transcript</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#904af2]/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-4">
            {transcript.split('\n').map((line, index) => {
              const [speaker, ...message] = line.split(':');
              if (!message.length) return null;

              return (
                <div key={index} className="flex gap-3">
                  <div
                    className={`px-2 py-1 rounded text-sm font-medium ${speaker.trim().toLowerCase() === 'bot'
                      ? 'bg-[#904af2]/10 text-[#904af2]'
                      : 'bg-zinc-800/50 text-zinc-400'
                      }`}
                  >
                    {speaker.trim()}
                  </div>
                  <div className="flex-1">{message.join(':').trim()}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CallHistory({ modelId }: CallHistoryPropsType) {
  const [calls, setCalls] = useState<Array<Call>>([]);
  const [selectedTranscript, setSelectedTranscript] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      if (modelId) {
        try {
          const { calls } = await listCalls(modelId, 1000, 0);
          setCalls(calls);
        } catch (err) {
          console.log(err);
        }
      }
    };
    fetchData();
  }, [modelId]);

  const handleRowClick = (transcript: string) => {
    setSelectedTranscript(transcript);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Search and Filters */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative w-full sm:w-96">
          <input
            type="text"
            placeholder="Search calls..."
            className="w-full bg-black/30 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2] transition-all"
          />
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-zinc-400" />
        </div>
        <div className="flex gap-2">
          <select className="px-3 py-2 border rounded-lg bg-black/30 border-zinc-800">
            <option>All Calls</option>
            <option>Completed</option>
            <option>Missed</option>
            <option>Failed</option>
          </select>
          <select className="px-3 py-2 border rounded-lg bg-black/30 border-zinc-800">
            <option>Today</option>
            <option>Yesterday</option>
            <option>Last 7 days</option>
            <option>Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Calls List */}
      <div className="overflow-hidden glass-panel rounded-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="p-4 text-sm font-medium text-left text-zinc-400">
                  Caller
                </th>
                <th className="p-4 text-sm font-medium text-left text-zinc-400">
                  Time
                </th>
                <th className="p-4 text-sm font-medium text-left text-zinc-400">
                  Duration
                </th>
                <th className="p-4 text-sm font-medium text-left text-zinc-400">
                  Status
                </th>
                <th className="p-4 text-sm font-medium text-right text-zinc-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {calls.map((call, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(call.transcript)}
                  className="transition-colors border-b cursor-pointer border-zinc-800/50 hover:bg-zinc-800/20"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#904af2]/10 rounded-lg flex items-center justify-center mr-3">
                        <User className="w-4 h-4 text-[#904af2]" />
                      </div>
                      <span>{call.phone_number_to}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-zinc-400" />
                      {
                        new Date(Number(calls[0].start_time)).toISOString().split('T')[0]
                      }{' '}
                      &nbsp;{' '}
                      {new Intl.DateTimeFormat('en-US', {
                        hour12: true,
                        hour: 'numeric',
                        minute: 'numeric',
                      }).format(Number(calls[0].start_time))}
                    </div>
                  </td>
                  <td className="p-4">
                    {convertSecondsToHHMMSS(call.duration)}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${call.status === 'completed'
                        ? 'bg-green-500/10 text-green-500'
                        : call.status === 'missed'
                          ? 'bg-yellow-500/10 text-yellow-500'
                          : 'bg-red-500/10 text-red-500'
                        }`}
                    >
                      {call.status === 'completed' ? (
                        <Check className="w-3 h-3 mr-1" />
                      ) : call.status === 'missed' ? (
                        <Phone className="w-3 h-3 mr-1" />
                      ) : (
                        <X className="w-3 h-3 mr-1" />
                      )}
                      {call.status.charAt(0).toUpperCase() +
                        call.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button
                      className="p-2 transition-colors rounded-lg hover:bg-zinc-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle more actions
                      }}
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">Showing 1-4 of 120 calls</div>
        <div className="flex gap-2">
          <button className="px-3 py-1 transition-colors border rounded-lg bg-black/30 border-zinc-800 hover:bg-zinc-800">
            Previous
          </button>
          <button className="px-3 py-1 bg-[#904AF2] rounded-lg hover:bg-[#904AF2]/90 transition-colors">
            Next
          </button>
        </div>
      </div>

      {/* Transcript Modal */}
      <AnimatePresence>
        {selectedTranscript && (
          <TranscriptModal
            transcript={selectedTranscript}
            onClose={() => setSelectedTranscript(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
