import { useState } from 'react';
import { motion } from 'framer-motion';

export function ApiTest() {
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the correct path to the Netlify function
      const response = await fetch('/.netlify/functions/hello-world');
      
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('API test error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-12 px-4">
      <div className="glass-panel p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">Serverless Function Test</h2>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={testApi}
          disabled={loading}
          className="px-4 py-2 bg-[#904af2] text-white rounded-lg hover:bg-[#904af2]/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Testing...' : 'Test Serverless Function'}
        </motion.button>
        
        {error && (
          <div className="mt-4 p-3 bg-red-500/10 text-red-500 rounded-lg text-sm">
            {error}
          </div>
        )}
        
        {apiResponse && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Response:</h3>
            <pre className="p-3 bg-black/30 rounded-lg overflow-auto text-sm">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}