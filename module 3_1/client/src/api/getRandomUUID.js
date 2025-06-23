export async function getRandomUUID() {
  try {
    const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/random/uuid`);
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    return data.uuid;
  } catch (error) {
    console.error('Error fetching UUID:', error);
    throw error;
  }
}