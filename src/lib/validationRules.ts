export const emailValidationRules = {
  required: 'メールアドレスは必ず入力してください',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
    message: '無効なメールアドレスです',
  },
};

export const ProfileIconValidationRules = {
  greaterThan: (fileList: FileList) => {
    const file = fileList[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return 'file size too large';
      }
    }
  },
};

export const passwordValidationRules = {
  required: 'パスワードは必須です',
  minLength: { value: 8, message: 'パスワードは8文字以上です' },
};

export const userNameValidationRules = {
  required: {
    value: true,
    message: 'ユーザーネームは必ず入力してください',
  },
  minLength: {
    value: 1,
    message: '1文字以上入力してください',
  },
  maxLength: {
    value: 10,
    message: '10文字以下で入力してください',
  },
};

export const nameValidationRules = {
  minLength: {
    value: 1,
    message: '氏名は1文字以上入力してください',
  },
  maxLength: {
    value: 50,
    message: '氏名は50文字以下で入力してください',
  },
  pattern: {
    value: /^[ぁ-んァ-ン一-龥a-zA-Z\s]+$/,
    message: '無効な文字が含まれています',
  },
};

export const nftNameValidationRules = {
  required: {
    value: true,
    message: 'タイトルは必須です',
  },
  minLength: {
    value: 1,
    message: '1文字以上入力してください',
  },
  maxLength: {
    value: 10,
    message: '10文字以下で入力してください',
  },
};

export const descriptionValidationRules = {
  required: {
    value: true,
    message: 'マイレポートは必須です',
  },
};

export const teamValidationRules = {
  minLength: {
    value: 1,
    message: '1文字以上入力してください',
  },
  maxLength: {
    value: 100,
    message: '100文字以下で入力してください',
  },
  pattern: {
    value: /^[ぁ-んァ-ン一-龥a-zA-Z\s]+$/,
    message: '無効な文字が含まれています',
  },
};

export const heightValidationRules = {
  pattern: {
    value: /^[0-9]+$/,
    message: '数値のみを入力してください',
  },
  min: {
    value: 1,
    message: '1以上の値を入力してください',
  },
  max: {
    value: 250,
    message: '250以下の値を入力してください',
  },
};

export const weightValidationRules = {
  pattern: {
    value: /^[0-9]+$/,
    message: '数値のみを入力してください',
  },
  min: {
    value: 1,
    message: '1以上の値を入力してください',
  },
  max: {
    value: 150,
    message: '150以下の値を入力してください',
  },
};

export const clubTitleValidationRules = {
  minLength: {
    value: 1,
    message: '1文字以上入力してください',
  },
  maxLength: {
    value: 255,
    message: '255文字以下で入力してください',
  },
  pattern: {
    value: /^[ぁ-んァ-ン一-龥a-zA-Z\s]+$/,
    message: '無効な文字が含まれています',
  },
};

export const personalTitleValidationRules = {
  minLength: {
    value: 1,
    message: '1文字以上入力してください',
  },
  maxLength: {
    value: 255,
    message: '255文字以下で入力してください',
  },
  pattern: {
    value: /^[ぁ-んァ-ン一-龥a-zA-Z\s]+$/,
    message: '無効な文字が含まれています',
  },
};

export const lureSerialCodeValidationRule = {
  required: 'シリアルコードが必要です',
  pattern: {
    value: /^[0-9]{2}\/[0-9]{3}$/,
    message: '無効な文字が含まれています',
  },
};
interface ValidationResult {
  isValid: boolean;
  message?: string;
  [key: string]: string | boolean | undefined;
}

export const validateCode = (data: any, codeName: string): ValidationResult => {
  const code = Object.values(data).join('');
  if (code.length !== 6) {
    return { isValid: false, message: '認証コードは6桁です' };
  }
  return { isValid: true, [codeName]: code };
};
