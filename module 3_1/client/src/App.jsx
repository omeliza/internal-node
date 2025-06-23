import { useEffect, useState } from "react";
import { getRandomUUID } from "./api/getRandomUUID";

export default function App() {
  const [randomUUID, setRandomUUID] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRandomUUID = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const result = await getRandomUUID();
      setRandomUUID(result);
    } catch (error) {
      console.error("Error fetching UUID:", error);
      setRandomUUID(null);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomUUID();
  }, []);

  return (
    <div>
      <main>
        {errorMessage && <h1 style={{ color: 'red' }}>{errorMessage}</h1>}
        {isLoading && <h1>Loading...</h1>}
        {randomUUID && !isLoading && (
          <>
            <h1>Random UUID: {randomUUID}</h1>
            <button onClick={fetchRandomUUID} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </>
        )}
      </main>
    </div>
  );
}
