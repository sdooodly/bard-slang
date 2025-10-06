'use client';
import { useState, useEffect } from "react";

// Define the available styles for the UI
const styles = [
  { key: "shakespearean", label: "Shakespearean" },
  { key: "corporate", label: "Corporate" },
  { key: "slang", label: "Internet slang" },
];


export default function Home() {
  const [inputText, setInputText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('shakespearean');
  const [convertedText, setConvertedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setError('Enter a phrase to convert.');
      return;
    }

    setIsLoading(true);
    setError('');
    setConvertedText('');

    try {
      // Calls the API route defined in Step 3
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText, style: selectedStyle }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Conversion failed due to an unknown error.');
      } else {
        setConvertedText(data.result);
      }
    } catch (err) {
      console.error(err);
      setError('Network error. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <main className="flex min-h-screen flex-col items-center p-4 md:p-8 bg-earth">
    <h1
      className="text-3xl md:text-5xl font-extrabold mb-6 text-earth-dark-green text-center fancy-title cursor-pointer select-none"
      style={{ letterSpacing: '0.08em', textShadow: '0 2px 12px var(--earth-shadow)' }}
      onClick={e => {
        const el = e.currentTarget;
        el.animate([
          { transform: 'scale(1)', color: 'var(--earth-orange)' },
          { transform: 'scale(1.15)', color: 'var(--earth-green)' },
          { transform: 'scale(1)', color: 'var(--earth-dark-green)' }
        ], { duration: 600, easing: 'ease' });
      }}
    >
      <span style={{
        background: 'linear-gradient(90deg, var(--earth-brown), var(--earth-green), var(--earth-orange))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        display: 'inline-block',
        padding: '0.1em 0.3em',
        borderRadius: '0.3em',
        boxShadow: '0 2px 12px var(--earth-shadow)'
      }}>
        Bard Slang
      </span>
    </h1>

  <div className="w-full max-w-2xl bg-earth-cream p-4 md:p-6 rounded-lg shadow-earth">
        <textarea
          className="w-full p-2 md:p-3 border border-earth-green rounded-md focus:ring-earth-green focus:border-earth-green text-base md:text-lg bg-earth-cream text-earth-brown resize-none"
          rows={3}
          placeholder="Enter the phrase you wish to convert..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          disabled={isLoading}
        />

        <div className="mt-4 flex flex-col md:flex-row md:flex-wrap justify-between items-center space-y-2 md:space-y-0 md:space-x-4">
          <label className="font-medium text-earth-dark-green mb-2 md:mb-0">Select Style:</label>
          <div className="flex flex-wrap space-x-2 md:space-x-4">
            {styles.map((style) => (
              <label key={style.key} className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-earth-green focus:ring-earth-dark-green"
                  name="style"
                  value={style.key}
                  checked={selectedStyle === style.key}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  disabled={isLoading}
                />
                <span className="ml-2 text-earth-dark-green">{style.label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleConvert}
          className={`mt-6 w-full py-2 md:py-3 rounded-md text-earth-cream font-semibold transition duration-200 shadow-earth ${
            isLoading
              ? 'bg-earth-green cursor-not-allowed'
              : 'bg-earth-dark-green hover:bg-earth-green'
          }`}
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : 'Convert Text'}
        </button>
      </div>

  <footer className="w-full max-w-2xl flex flex-col items-center text-earth-dark-green fixed bottom-0 left-1/2 -translate-x-1/2 bg-earth-cream p-2 md:p-4 z-50 shadow-earth">
        <div className="flex items-center space-x-2">
          <span>Made with Next.js, React, Gemini API</span>
          <a href="https://github.com/sdooodly" target="_blank" rel="noopener noreferrer" className="ml-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="var(--earth-green)" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.552 3.295-1.23 3.295-1.23.654 1.653.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.804 5.624-5.475 5.92.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 21.796 24 17.298 24 12c0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        </div>
      </footer>

  <div className="w-full max-w-2xl mt-4 md:mt-8">
        {error && (
          <p className="bg-earth-orange border border-earth-brown text-earth-cream p-3 rounded mb-4">
            Error: {error}
          </p>
        )}

        {convertedText && (
          <div className="bg-earth-green p-6 rounded-lg shadow-earth">
            <h2 className="text-xl font-semibold mb-2 text-earth-brown">Converted Text:</h2>
            <p className="text-earth-brown whitespace-pre-wrap">{convertedText}</p>
          </div>
        )}
      </div>
    </main>
  );
}