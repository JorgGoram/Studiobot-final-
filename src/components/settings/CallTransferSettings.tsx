import { useState, useEffect } from 'react';
import { PhoneForwarded } from 'lucide-react';
import { PasswordProtection } from './PasswordProtection';
import toast from 'react-hot-toast';
import {
  attachAction,
  createLiveTransfer,
  getAction,
  updateLiveTransfer,
  type LiveTransferAction,
} from '../../lib/synthflow';
import {
  createAction,
  isExistedAction,
  loadUserProfile,
} from '../../lib/supabase';

export function CallTransferSettings() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [transferConfig, setTransferConfig] = useState<LiveTransferAction>({
    phone: '',
    instructions: '',
    timeout: 30,
    digits: '',
    initiating_msg: '',
    goodbye_msg: '',
    failed_msg: '',
  });

  const handleInputChange = (
    field: keyof LiveTransferAction,
    value: string | number
  ) => {
    setTransferConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  useEffect(() => {
    async function fetchData() {
      const res = await isExistedAction({
        action_type: 'LIVE_TRANSFER',
      });
      if (res?.action_id) {
        const { action_id } = res;

        try {
          const action = await getAction(action_id);
          const {
            to_phone_number: phone,
            digits,
            timeout,
            initiating_transfer_msg: initiating_msg,
            goodbye_before_transferring_msg: goodbye_msg,
            transfer_failed_msg: failed_msg,
            instructions,
          } = action.parameters_hard_coded;

          setTransferConfig({
            phone,
            digits,
            timeout,
            initiating_msg,
            goodbye_msg,
            failed_msg,
            instructions,
          });
        } catch (err) {
          console.error('Failed to fetch or set transfer config:', err);
          toast.error('Failed to load transfer settings', {
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid rgba(144, 74, 242, 0.2)',
            },
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          });
        }
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const toastId = toast.loading('Saving transfer settings...', {
      style: {
        background: '#1a1a1a',
        color: '#fff',
        border: '1px solid rgba(144, 74, 242, 0.2)',
      },
    });

    try {
      const res = await isExistedAction({
        action_type: 'LIVE_TRANSFER',
      });

      if (!res?.action_id) {
        // Create new transfer settings
        const res = await createLiveTransfer(transferConfig);
        if (res.status === 'success') {
          const profile = await loadUserProfile();
          if (profile?.model_id) {
            await attachAction(profile.model_id, [res?.response?.action_id]);
            await createAction({
              action_id: res?.response?.action_id,
              action_type: 'LIVE_TRANSFER',
            });

            toast.success('Transfer settings created successfully', {
              id: toastId,
              style: {
                background: '#1a1a1a',
                color: '#fff',
                border: '1px solid rgba(144, 74, 242, 0.2)',
              },
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            });
          } else {
            throw new Error('Network error');
          }
        }
      } else {
        // Update existing transfer settings
        await updateLiveTransfer(res?.action_id, transferConfig);
        toast.success('Transfer settings updated successfully', {
          id: toastId,
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(144, 74, 242, 0.2)',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        });
      }
    } catch (err: any) {
      console.error('Error saving transfer settings:', err);
      toast.error(err.message || 'Failed to save transfer settings', {
        id: toastId,
        style: {
          background: '#1a1a1a',
          color: '#fff',
          border: '1px solid rgba(144, 74, 242, 0.2)',
        },
        iconTheme: {
          primary: '#ef4444',
          secondary: '#fff',
        },
      });
    }
  };

  if (!isUnlocked) {
    return (
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl">
          <div className="p-6 border bg-zinc-900/80 backdrop-blur-sm rounded-xl border-zinc-800/80">
            <PasswordProtection
              title="Call Transfer"
              description="Set up intelligent call routing and transfer rules to ensure calls reach the right person at the right time."
              onUnlock={() => setIsUnlocked(true)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-3xl">
        <div className="p-6 border bg-zinc-900/80 backdrop-blur-sm rounded-xl border-zinc-800/80">
          <h2 className="flex items-center justify-center mb-6 text-xl font-semibold">
            <PhoneForwarded className="w-5 h-5 mr-2 text-[#904AF2]" />
            Call Transfer
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Transfer Rules */}
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-black/30 border-zinc-800/50">
                <h3 className="mb-4 font-medium">Transfer Configuration</h3>

                {/* Phone Number */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm">
                    Transfer Phone Number
                  </label>
                  <input
                    type="tel"
                    value={transferConfig.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Enter the phone number in international format
                  </p>
                </div>

                {/* Instructions */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm">
                    Transfer Instructions
                  </label>
                  <textarea
                    value={transferConfig.instructions}
                    onChange={(e) =>
                      handleInputChange('instructions', e.target.value)
                    }
                    placeholder="Enter instructions for handling the transfer..."
                    rows={3}
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                  />
                </div>

                {/* Timeout */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm">
                    Transfer Timeout (seconds)
                  </label>
                  <input
                    type="number"
                    value={transferConfig.timeout}
                    onChange={(e) =>
                      handleInputChange('timeout', parseInt(e.target.value))
                    }
                    min="1"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                  />
                </div>

                {/* Expected Digits */}
                <div className="mb-4">
                  <label className="block mb-2 text-sm">Expected Digits</label>
                  <input
                    type="text"
                    value={transferConfig.digits}
                    onChange={(e) =>
                      handleInputChange('digits', e.target.value)
                    }
                    placeholder="e.g., 123#"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                  />
                  <p className="mt-1 text-xs text-zinc-500">
                    Enter the expected digits for input verification
                  </p>
                </div>

                {/* Messages */}
                <div className="space-y-4">
                  <div>
                    <label className="block mb-2 text-sm">
                      Initiating Message
                    </label>
                    <textarea
                      value={transferConfig.initiating_msg}
                      onChange={(e) =>
                        handleInputChange('initiating_msg', e.target.value)
                      }
                      placeholder="Message to start the transfer..."
                      rows={2}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">
                      Goodbye Message
                    </label>
                    <textarea
                      value={transferConfig.goodbye_msg}
                      onChange={(e) =>
                        handleInputChange('goodbye_msg', e.target.value)
                      }
                      placeholder="Message to end the transfer..."
                      rows={2}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-sm">
                      Failed Transfer Message
                    </label>
                    <textarea
                      value={transferConfig.failed_msg}
                      onChange={(e) =>
                        handleInputChange('failed_msg', e.target.value)
                      }
                      placeholder="Message when transfer fails..."
                      rows={2}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2]"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg bg-black/30 border-zinc-800/50">
                <h3 className="mb-2 font-medium">Transfer Conditions</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="rounded border-zinc-800"
                    />
                    <span>Transfer during business hours only</span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-[#904AF2] text-white rounded-lg hover:bg-[#904AF2]/90 transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}