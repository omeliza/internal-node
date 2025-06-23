export async function getRandomUUID() {
  try {
    const res = await fetch('/api/random/uuid');
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.uuid;
  } catch (error) {
    console.error('Backend is not reachable:', error);
    throw error;
  }
}