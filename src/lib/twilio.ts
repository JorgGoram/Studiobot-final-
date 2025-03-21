import api from "../api/axiosConfig";

export const buyTwilioNumber = async () => {
  try {
    const res = await api.get('/twilio/buy');
    return res.data.phoneNumber;
  } catch (err) {
    console.log(err);
    throw new Error('error');
  }
};
