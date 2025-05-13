import { useState } from 'react';

export const useSettingUpdate = (type: string, defaultValue: string) => {
  const [value, setValue] = useState<string | undefined>(defaultValue);
  return { value, setValue };
};
