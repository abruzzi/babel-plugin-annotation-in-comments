import React, {useEffect, useState} from "react";

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // @operational("fetchQuotes", "", "")
    const fetchQuotes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("https://quote-service.com/quotes");
        if (!response.ok) {
          throw new Error("Failed to fetch quotes");
        }
        const json = await response.json();
        setQuotes(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuotes();
  }, []);

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      <ul>
        {quotes.map((quote, index) => (
          <li key={index}>{quote}</li>
        ))}
      </ul>
    </div>
  );
}

export default Quotes;
