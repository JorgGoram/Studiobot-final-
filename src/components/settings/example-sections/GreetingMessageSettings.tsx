import { useState } from 'react';
import { Play, Wand2, Volume2 } from 'lucide-react';

export default function GreetingMessageSettings() {
  const [greetingText, setGreetingText] = useState("Hello! Thank you for calling our tattoo studio. This is Roxy, your AI assistant. How can I help you today?");
  const [isPlaying, setIsPlaying] = useState(false);

  const playGreeting = () => {
    setIsPlaying(true);
    // In a real implementation, this would play the audio
    setTimeout(() => setIsPlaying(false), 3000);
  };

  const generateGreeting = () => {
    // In a real implementation, this would use AI to generate a greeting
    setGreetingText("Hello and welcome to our tattoo studio! I'm your virtual assistant. Whether you're looking to book an appointment, inquire about our artists, or have questions about our services, I'm here to help. How may I assist you today?");
  };

  return (
    <div className="space-y-4 text-white">
      <div>
        <label className="block text-sm font-medium mb-2">
          Greeting Message
        </label>
        <textarea
          value={greetingText}
          onChange={(e) => setGreetingText(e.target.value)}
          rows={4}
          className="bg-[#1a1a1a] border border-gray-700 text-white text-sm rounded-lg focus:ring-[#904af2] focus:border-[#904af2] block w-full p-2.5"
          placeholder="Enter your greeting message..."
        />
        
        <div className="flex flex-wrap gap-2 mt-2">
          <button 
            onClick={generateGreeting}
            className="flex items-center text-sm px-3 py-1.5 text-[#904af2] bg-[#904af2]/10 rounded-lg hover:bg-[#904af2]/20 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5 mr-1.5" />
            AI generate
          </button>
          
          <button 
            onClick={playGreeting}
            className="flex items-center text-sm px-3 py-1.5 text-white bg-black/30 rounded-lg hover:bg-black/50 transition-colors"
          >
            {isPlaying ? (
              <>
                <Volume2 className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                Playing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Preview
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button className="px-4 py-2 bg-[#904af2] text-white rounded-lg hover:bg-[#9d5ff5] transition-colors">
          Save Changes
        </button>
      </div>
    </div>
  );
}