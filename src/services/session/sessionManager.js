const SESSION_STORAGE_KEY = 'vms_session';
const LEGACY_USER_ID_KEY = 'vms_user_id';
const SESSION_VERSION = 1;

const hasStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readStorageItem = (key) => {
  if (!hasStorage()) {
    return '';
  }

  try {
    return window.localStorage.getItem(key) || '';
  } catch {
    return '';
  }
};

const writeStorageItem = (key, value) => {
  if (!hasStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Intentionally ignore storage failures to avoid breaking API-driven flows.
  }
};

const removeStorageItem = (key) => {
  if (!hasStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Intentionally ignore storage failures to avoid breaking API-driven flows.
  }
};

const normalizeUserId = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

const parseSession = (rawSession) => {
  if (!rawSession) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawSession);
    const userId = normalizeUserId(parsed?.userId);

    if (!userId) {
      return null;
    }

    return {
      version: Number(parsed?.version) || SESSION_VERSION,
      userId,
      email: normalizeUserId(parsed?.email),
      firstName: normalizeUserId(parsed?.firstName),
      lastName: normalizeUserId(parsed?.lastName),
      createdAt: normalizeUserId(parsed?.createdAt),
    };
  } catch {
    return null;
  }
};

export const getSession = () => {
  const storedSession = parseSession(readStorageItem(SESSION_STORAGE_KEY));

  if (storedSession?.userId) {
    return storedSession;
  }

  const legacyUserId = normalizeUserId(readStorageItem(LEGACY_USER_ID_KEY));
  if (!legacyUserId) {
    return null;
  }

  const migratedSession = {
    version: SESSION_VERSION,
    userId: legacyUserId,
    email: '',
    firstName: '',
    lastName: '',
    createdAt: new Date().toISOString(),
  };

  writeStorageItem(SESSION_STORAGE_KEY, JSON.stringify(migratedSession));
  return migratedSession;
};

export const getSessionUserId = () => {
  return getSession()?.userId || '';
};

export const isAuthenticated = () => {
  return Boolean(getSessionUserId());
};

export const saveSessionFromUser = (user) => {
  const userId = normalizeUserId(user?.id);
  if (!userId) {
    return null;
  }

  const nextSession = {
    version: SESSION_VERSION,
    userId,
    email: normalizeUserId(user?.email),
    firstName: normalizeUserId(user?.first_name),
    lastName: normalizeUserId(user?.last_name),
    createdAt: new Date().toISOString(),
  };

  writeStorageItem(SESSION_STORAGE_KEY, JSON.stringify(nextSession));
  writeStorageItem(LEGACY_USER_ID_KEY, userId);

  return nextSession;
};

export const clearSession = () => {
  removeStorageItem(SESSION_STORAGE_KEY);
  removeStorageItem(LEGACY_USER_ID_KEY);
};

