import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Zap, Clock } from 'lucide-react';
import { CreateAgentModal } from './CreateAgentModal';
import { UserProfile } from '../types/UserProfile';
import {
  convertSecondsToHHMMSS,
  getDaysRemaining,
  getMinsRemaining,
} from '../utils';
interface DashboardPropsType {
  data: {
    total_records: number;
    total_mins: number;
    avg_min: number;
    total_complete: number;
  };
  userProfile: UserProfile;
}
export function Dashboard({ data, userProfile }: DashboardPropsType) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState(data);
  const [isExpired, setIsExpired] = useState<Boolean>(false);
  useEffect(() => {
    if (userProfile) {
      if (
        getMinsRemaining(userProfile.totalUsageMinutes) <= 0 ||
        getDaysRemaining(userProfile?.planEnd) <= 0
      ) {
        setIsExpired(true);
      }
    }
  }, [userProfile]);
  useEffect(() => {
    setAnalysisData(data);
  }, [data]);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-t-2 border-b-2 border-purple-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Calculate success rate safely
  const successRate =
    analysisData.total_records > 0
      ? Math.round(
        (analysisData.total_complete / analysisData.total_records) * 100
      )
      : 0;

  return (
    <div className="space-y-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 text-sm text-red-500 rounded-lg bg-red-500/10"
        >
          {error}
        </motion.div>
      )}

      {/* Achievement Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 glass-panel rounded-xl"
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center justify-center w-12 h-12 bg-purple-600/10 rounded-xl">
            <Trophy className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="mb-1 text-lg font-medium">Level 3 Achieved!</h2>
            <p className="text-sm text-zinc-400">
              Your main agent has handled over 1,000 calls successfully.
            </p>
          </div>
        </div>
        <button className="btn-ghost">View Achievements</button>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 glass-panel rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600/10">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-green-400">↑ 12%</span>
          </div>
          <div className="mb-1 text-2xl font-medium">{successRate}%</div>
          <div className="text-sm text-zinc-400">Average Success Rate</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 glass-panel rounded-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-600/10">
              <Zap className="w-5 h-5 text-purple-400" />
            </div>
            <span className="text-sm text-green-400">↑ 8%</span>
          </div>
          <div className="mb-1 text-2xl font-medium">
            {analysisData.total_records}
          </div>
          <div className="text-sm text-zinc-400">Total Calls This Month</div>
        </motion.div>

        {/* Create New Agent Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 transition-all border glass-panel rounded-xl border-purple-600/20 hover:border-purple-600/40 group"
        >
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="flex items-center justify-center w-12 h-12 mb-4 transition-all rounded-full bg-purple-600/10 group-hover:bg-purple-600/20">
              <Clock
                className={`w-6 h-6 text-${!isExpired ? 'purple' : 'red'}-400`}
              />
            </div>
            {userProfile?.plan === 'TRIAL' && !isExpired ? (
              <>
                <h3 className="mb-2 font-medium">Trial Status</h3>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-purple-400">
                      {convertSecondsToHHMMSS(
                        Number(
                          Math.max(
                            15 * 60 - (userProfile?.totalUsageMinutes || 0),
                            0
                          ).toFixed(2)
                        )
                      )}{' '}
                    </span>{' '}
                    remaining
                  </p>
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-purple-400">
                      {Math.max(
                        Math.ceil(
                          (new Date(userProfile?.planEnd || '').getTime() -
                            new Date().getTime()) /
                          (1000 * 60 * 60 * 24)
                        ),
                        0
                      )}{' '}
                      days
                    </span>{' '}
                    left in trial
                  </p>
                </div>
              </>
            ) : userProfile?.plan === 'TRIAL' && isExpired ? (
              <>
                <h3 className="mb-2 font-medium">Trial Status</h3>
                <div className="space-y-2">
                  <p className="text-sm text-zinc-400">
                    <span className="font-medium text-red-400">Expired</span>
                  </p>
                </div>
              </>
            ) : (
              <>
                <h3 className="mb-2 font-medium">Usage</h3>
                <p className="text-sm text-zinc-400">
                  <span className="font-medium text-purple-400">
                    {convertSecondsToHHMMSS(userProfile?.totalUsageMinutes) ||
                      0}{' '}
                    minutes
                  </span>{' '}
                  used this month
                </p>
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Voice Agents Grid */}
      {/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <VoiceAgentCard
              agent={{
                name: agent.name,
                status: agent.status,
                performance:
                  Math.round(
                    (agent.successful_calls / agent.total_calls) * 100
                  ) || 0,
                callsToday: agent.total_calls,
                successRate:
                  Math.round(
                    (agent.successful_calls / agent.total_calls) * 100
                  ) || 0,
                level: agent.level,
              }}
              onEdit={() => {}}
              onDelete={() => handleDeleteAgent(agent.id)}
            />
          </motion.div>
        ))}
      </div> */}

      {showCreateModal && (
        <CreateAgentModal
          onClose={() => setShowCreateModal(false)}
          onCreate={async (data) => {
            console.log(data);
            try {
              await loadAgents(); // Reload agents after creation
              setShowCreateModal(false);
            } catch (err) {
              console.error('Error creating agent:', err);
              setError('Failed to create voice agent');
            }
          }}
        />
      )}
    </div>
  );
}
