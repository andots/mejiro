export const validateUrl = (url: string): boolean => {
  try {
    const u = new URL(url);
    if (!u.host || (u.protocol !== "http:" && u.protocol !== "https:")) {
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
};
