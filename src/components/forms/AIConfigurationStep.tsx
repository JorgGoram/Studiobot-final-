import { motion } from 'framer-motion';
import type { FormStepProps } from './types';
import { ErrorMessage } from './ErrorMessage';

export function AIConfigurationStep({
  formData,
  errors,
  setFormData,
}: FormStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      {/* General Configuration */}
      <div>
        <h3 className="text-lg font-medium mb-4">General Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              AI Assistant Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.assistantName}
              onChange={(e) =>
                setFormData({ ...formData, assistantName: e.target.value })
              }
              className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="Enter assistant name"
            />
            <ErrorMessage message={errors.assistantName} />
          </div>
        </div>
      </div>

      {/* Communication Settings */}
      <div>
        <h3 className="text-lg font-medium mb-4">Communication Settings</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Welcome Message <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.welcomeMessage}
              onChange={(e) =>
                setFormData({ ...formData, welcomeMessage: e.target.value })
              }
              className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[100px]"
              placeholder="Enter welcome message"
            />
            <ErrorMessage message={errors.welcomeMessage} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Specific Instructions
            </label>
            <textarea
              value={formData.specificInstructions}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  specificInstructions: e.target.value,
                })
              }
              className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600 min-h-[100px]"
              placeholder="Add any specific instructions..."
            />
          </div>
        </div>
      </div>

      {/* Language & Integration */}
      <div>
        <h3 className="text-lg font-medium mb-4">Language</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Language Settings
            </label>
            <select
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="en-US">English (United States)</option>
              <option value="en-GB">English (Great Britain)</option>
              <option value="fr-FR">Français (France)</option>
              <option value="it-IT">Italiano (Italian)</option>
              <option value="es-ES">Español (Spain)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Call Management */}
      <div>
        <h3 className="text-lg font-medium mb-4">Call Management</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Daily Call Limit
            </label>
            <input
              type="number"
              value={formData.dailyCallLimit}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  dailyCallLimit: parseInt(e.target.value),
                })
              }
              className="w-full bg-black/30 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              placeholder="e.g., 50"
            />
          </div>
          <div className="space-y-2">
            {[
              { key: 'automaticReminders', label: 'Automatic Reminders' },
              { key: 'waitlistManagement', label: 'Waitlist Management' },
            ].map((feature) => (
              <motion.div
                key={feature.key}
                className="flex items-center p-3 rounded-lg border border-zinc-800 hover:border-purple-600/50 transition-all"
                whileHover={{ scale: 1.01 }}
              >
                <label className="relative inline-flex items-center cursor-pointer flex-1">
                  <input
                    type="checkbox"
                    checked={formData[feature.key as keyof FormData] as boolean}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [feature.key]: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ml-3 text-sm font-medium">
                    {feature.label}
                  </span>
                </label>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
