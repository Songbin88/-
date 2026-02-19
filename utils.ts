
export const getZodiac = (year: number): string => {
  const zodiacs = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  // The year 1900 was the year of the Rat (index 0 in our array)
  // Traditional calculation (Year - 4) % 12 or similar, but 1900 % 12 = 4. 
  // Let's use a fixed offset. 1924 was wood Rat.
  const index = (year - 1924) % 12;
  return zodiacs[index < 0 ? index + 12 : index];
};

export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}年${m}月${d}日`;
};
