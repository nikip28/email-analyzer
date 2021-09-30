import { useEffect, useState } from "react";
import "./App.css";

const API_ENDPOINT = "http://localhost:5000/snippets";

function App() {
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      getSnippets(code);
    } else {
      setLoader(false);
    }
  }, []);

  const getSnippets = (code) => {
    let url = API_ENDPOINT;
    if (code) {
      url = url + `?code=${code}`;
    }
    setLoader(true);
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.authUrl) {
          window.location.href = data.authUrl;
        } else {
          setData(data.snippets);
          setLoader(false);
          if (code)
            window.history.pushState({}, null, "http://localhost:3000/");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log("error", error);
      });
  };

  return (
    <div className="App">
      {loader ? (
        <div>Loading...</div>
      ) : (
        <>
          <button onClick={() => getSnippets()}>Analyze my emails</button>
          <ul style={{ textAlign: "left" }}>
            {data.map((ele, index) => (
              <li key={index}>{ele}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
