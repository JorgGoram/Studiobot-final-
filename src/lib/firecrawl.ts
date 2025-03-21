
import api from '../api/axiosConfig';
export async function extractTattooShopInfo(url: string) {
  try {
    const { data } = await api.post('/firecrawl/extractTattooShopInfo', { url: url });
    return data;
  } catch (error: any) {
    throw new Error(`Error: ${error.message}`)
  }
}