const mapCodeToMessage: Record<string, string> = {
  "auth/wrong-password": "メールアドレスまたは、パスワードが無効です。",
};

export const generateMessageByCode = (code: string) => {
  return mapCodeToMessage[code] || "";
};
