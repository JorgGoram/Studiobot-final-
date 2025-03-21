import api from '../api/axiosConfig';
import { Call, ListCallsResponse } from '../types';
import type { AssistantPropsType } from '../types/Synthflow';
import { getSession, supabase } from './supabase';
const synthflowUrl = import.meta.env.VITE_SYNTHFLOW_URL;
const synthflowApiKey = import.meta.env.VITE_SYNTHFLOW_API_KEY;
interface CalendarActionResponse {
  status: string;
  action_id: string;
  message: string;
}
export interface LiveTransferAction {
  phone: string; // The phone number in international format
  instructions: string; // Instructions for handling the interaction
  timeout: number; // Timeout duration in seconds
  digits?: string; // Expected number of digits for input
  initiating_msg?: string; // Initial message to start the interaction
  goodbye_msg?: string; // Message to end the interaction
  failed_msg?: string; // Message to display if the interaction fails
}
export const createAssistant = async (
  assistant: AssistantPropsType
): Promise<any> => {
  try {
    const response = await api.post('/synthflow/createAssistant', { assistant: assistant });
    if (response.status !== 200) {
      throw new Error(`Error creating assistant: ${response.statusText}`);
    }
    const { model_id } = await response.data;
    console.log(model_id);
    return model_id;
  } catch (error: any) {
    console.error('Failed to create assistant:', error);
    throw new Error(error.message);
  }
};

export const updateAssistant = async (cond: Partial<AssistantPropsType>) => {
  const session = await getSession();
  if (session?.user) {
    console.log(session?.user?.id);
    try {
      const res = await api.put("/synthflow/updateAssistant", cond);
      console.log(res);
    } catch (err) {
      console.log(err);
    }
  }
};
export const getAssistant = async () => {
  try {
    const res = await api.get("/synthflow/getAssistant");
    return res.data.assistant;
  }
  catch (error: any) {
    console.log(error);
    throw new Error(`error: ${error.message}`)
  }
};
async function createAction(payload: any) {
  const response = await fetch(synthflowUrl + '/actions', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${synthflowApiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    console.error('Synthflow API error:', error);
    throw new Error('Failed to create Synthflow action');
  }

  return response.json();
}
async function updateAction(action_id: string, payload: any) {
  const response = await fetch(`${synthflowUrl}/actions/${action_id}`, {
    method: 'PUT',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
      Authorization: `Bearer ${synthflowApiKey}`,
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const error = await response.json();
    console.error('Synthflow API error:', error);
    throw new Error('Failed to update Synthflow action');
  }
}
export async function createSynthflowAction(accessToken: string) {
  // Create Calendar Action
  try {
    const res = await api.post("/synthflow/createSynthflowAction", { accessToken: accessToken });
    return res.data;
  }
  catch (err: any) {
    throw new Error(`Error: ${err.message}`);
  }
}

export async function createLiveTransfer(cond: LiveTransferAction) {
  // Create Calendar Action
  const realTimeBookingAction = {
    LIVE_TRANSFER: cond,
  };
  try {
    // Create both actions
    const calendarResult = await createAction(realTimeBookingAction);

    return calendarResult;
  } catch (error) {
    console.error('Error creating Synthflow actions:', error);
    throw error;
  }
}
export async function updateLiveTransfer(
  action_id: string,
  cond: LiveTransferAction
) {
  const liveTransferAction = {
    LIVE_TRANSFER: cond,
  };
  try {
    const res = await updateAction(action_id, liveTransferAction);
    console.log(res);
  } catch (err: any) {
    console.error('Error updating', err);
    throw new Error(err.message);
  }
}
export async function attachAction(modelId: string, actions: Array<string>) {
  const options = {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${synthflowApiKey}`,
    },
    body: JSON.stringify({ model_id: modelId, actions: actions }),
  };
  try {
    const res = await fetch(`${synthflowUrl}/actions/attach`, options);
    if (res.status == 200) {
      return {
        msg: 'success',
      };
    }
  } catch (err) {
    console.log('err', err);
    return {
      msg: 'failed',
    };
  }
}
export async function getAction(action_id: string) {
  try {
    const { data } = await api.get(`/synthflow/action/${action_id}`);
    return data;
  } catch (err: any) {
    throw new Error(err);
  }
}
//Call Apis

/**
 * List Calls
 *
 * @param modelId string
 * @param limit number
 * @param offset number
 * @return calls Call[]
 */
export async function listCalls(
  modelId: string,
  limit: number = 10, // Default value for limit
  offset: number = 0 // Default value for offset
): Promise<ListCallsResponse> {
  try {
    const res = await api.post("/get-listCalls", { model_id: modelId, limit: limit, offset: offset });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error(`Failed to fetch calls: ${res.status} ${res.statusText}`);
    }
  } catch (err) {
    console.error(err);
    throw new Error('An error occurred while fetching calls.');
  }
}
