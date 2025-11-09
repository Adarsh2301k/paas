// Temporary OTP sender for dev — logs OTP to console
export const sendSms = async ({ mobile, message }) => {
  console.log(`\n📩 OTP sent to ${mobile}: ${message}\n`);
  return { success: true };
};
