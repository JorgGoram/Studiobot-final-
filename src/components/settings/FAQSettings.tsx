import { useEffect, useState } from 'react';
import { MessageSquare, Plus, Save } from 'lucide-react';
import type { FormData } from '../../types/FormData';
import {
  getOptionalPreferences,
  updateOptionalPreferences,
} from '../../lib/supabase';
import { updateAssistant } from '../../lib/synthflow';
import {
  generatePrompt,
  generatePromptFAQ,
  generateTattooShopInfoPrompt,
} from '../../utils';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSettingsProps {
  formData: FormData;
  onChange: (field: keyof FormData, value: any) => void;
}

export function FAQSettings({ formData, onChange }: FAQSettingsProps) {
  const [faqs, setFaqs] = useState<FAQ[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
    { question: '', answer: '' },
  ]);

  const handleFAQChange = (index: number, field: keyof FAQ, value: string) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
    setFaqs(updatedFaqs);
  };

  const addNewFAQ = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleSave = async () => {
    // Filter out empty FAQs

    // const validFaqs = faqs.filter(
    //   (faq) => faq.question.trim() && faq.answer.trim()
    // );
    // onChange('faqs', validFaqs);
    try {
      const optionalPreference = await updateOptionalPreferences({ faq: faqs });
      // console.log(optionalPreference)
      let prompt = generatePrompt(
        optionalPreference.operating_hours,
        String(optionalPreference.hourly_rate),
        optionalPreference.specific_instructions
      );
      if (optionalPreference.scraping_data) {
        prompt += generateTattooShopInfoPrompt(
          optionalPreference.scraping_data
        );
      }
      // console.log(prompt)
      // let prompt = "";
      prompt += generatePromptFAQ(faqs);

      await updateAssistant({ agent: { prompt: prompt } });
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOptionalPreferences();
        if (data?.faq) {
          setFaqs(data.faq);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-3xl">
        <div className="p-6 border bg-zinc-900/80 backdrop-blur-sm rounded-xl border-zinc-800/80">
          <h2 className="flex items-center justify-center mb-6 text-xl font-semibold">
            <MessageSquare className="w-5 h-5 mr-2 text-[#904AF2]" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="text-center">
              <p className="mb-4 text-zinc-400">
                Add common questions and answers to help your AI assistant
                provide accurate responses.
              </p>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-black/30 rounded-lg p-4 border border-zinc-800/50 transition-all duration-200 hover:border-[#904AF2]/30"
                >
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        handleFAQChange(index, 'question', e.target.value)
                      }
                      placeholder="Question"
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2] transition-colors placeholder-zinc-600"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        handleFAQChange(index, 'answer', e.target.value)
                      }
                      placeholder="Answer"
                      rows={3}
                      className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#904AF2] transition-colors placeholder-zinc-600 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add FAQ Button */}
            <button
              onClick={addNewFAQ}
              className="w-full py-3 border-2 border-dashed border-zinc-800 rounded-lg text-zinc-400 hover:text-white hover:border-[#904AF2]/50 transition-all flex items-center justify-center gap-2 group"
            >
              <Plus className="w-4 h-4 transition-transform group-hover:scale-110" />
              Add New FAQ
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full mt-6 py-3 bg-[#904AF2] text-white rounded-lg hover:bg-[#904AF2]/90 transition-all flex items-center justify-center gap-2 group"
            >
              <Save className="w-4 h-4 transition-transform group-hover:scale-110" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
