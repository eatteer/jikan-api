import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [results, setResults] = useState([])
  const [currentAnime, setCurrentAnime] = useState(null)
  const timer = useRef(null)

  const getAnimeList = async (query) => {
    const url = `https://api.jikan.moe/v3/search/anime?q=${query}&page=1`
    try {
      const response = await fetch(url)
      if (response.ok) {
        const json = await response.json()
        return json.results
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onKeyUp = (e) => {
    /* Clear timer while typing */
    clearTimeout(timer.current)
    timer.current = setTimeout(async () => {
      if (query.length >= 3) {
        console.log("Making request")
        const results = await getAnimeList(query)
        setIsOpen(true)
        setResults(results)
      }
    }, 1000)
  }

  const fetchData = async (e) => {
    if (e.keyCode === 13) {
      if (query.length >= 3) {
        console.log("Making request")
        const results = await getAnimeList(query)
        setIsOpen(true)
        setResults(results)
      }
    }
  }

  const onClick = (result) => {
    const url = `https://api.jikan.moe/v3/anime/${result.mal_id}`
    fetch(url)
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(json => {
        setCurrentAnime(json)
        setQuery("")
      })
      .catch(error => console.error(error))
  }

  if (!query && isOpen) setIsOpen(false)

  return (
    <div className='w-full flex flex-col items-center'>
      <div className='w-full p-4 sm:w-4/5 lg:w-2/5'>
        <h1 className='text-6xl font-bold text-center my-4 text-blue-600'>Jikan API</h1>
        <div className='relative '>
          <input
            type="search"
            placeholder="Anime name"
            className='w-full p-2 border-2 rounded-md border-blue-600 outline-none'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyUp={fetchData}
          />
          {isOpen &&
            <ul className='z-50 w-full bg-white absolute top-12 h-96 border-2 rounded-sm border-gray-300 shadow-xl overflow-auto'>
              {results[0] && results.map(result =>
                <li key={result.mal_id} className='p-2 cursor-pointer hover:bg-gray-300' onClick={() => onClick(result)}>
                  <div className='flex'>
                    <img
                      src={result.image_url}
                      alt={result.title}
                      className='w-[82px] h-[128px] object-cover object-center rounded-md' />
                    <div className='ml-4'>
                      <p className='font-bold text-lg line-clamp-1'>{result.title}</p>
                      <p>{new Date(result.start_date).toLocaleDateString()}</p>
                      <p>{result.airing ? "Currently Airing" : "Finished Airing"}</p>
                      <p>{result.score}</p>
                    </div>
                  </div>
                </li>)}
            </ul>}
        </div>
        {currentAnime &&
          <div className='mt-4 flex flex-col'>
            <h2 className='text-2xl font-bold text-blue-600 mb-2'>{currentAnime.title}</h2>
            <div className='flex mb-4'>
              <img
                src={currentAnime.image_url}
                alt={currentAnime.title}
                className='w-[142px] h-[220px] mr-4 object-cover object-center rounded-md' />
              <div>
                <p>
                  <span className='font-bold text-gray-700'>Status: </span>
                  {currentAnime.status}</p>
                <p className='text-gray-800'>
                  <span className='font-bold text-gray-700'>Type: </span>
                  {currentAnime.type}</p>
                <p className='text-gray-800'>
                  <span className='font-bold text-gray-700'>Episodes: </span>
                  {currentAnime.episodes}
                </p>
                <p className='text-gray-800'>
                  <span className='font-bold text-gray-700'>Score: </span>
                  {currentAnime.score}
                </p>
                <p className='text-gray-800'>
                  <span className='font-bold text-gray-700'>Start Date: </span>
                  {new Date(currentAnime.aired.from).toLocaleDateString()}
                </p>
                <p className='text-gray-800'>
                  <span className='font-bold text-gray-700'>End Date: </span>
                  {new Date(currentAnime.aired.to).toLocaleDateString()}
                </p>
              </div>
            </div>
            <h3 className='text-2xl font-bold text-gray-700 mb-2'>Synopsis</h3>
            <p className='text-sm text-gray-800 mb-2'>{currentAnime.synopsis.replace("[Written by MAL Rewrite]", "")}</p>
          </div>}
      </div>
    </div>
  );
}

export default App;
