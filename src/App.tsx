import { useState, useEffect } from 'react';
import { PokemonList } from './components/pokemon-list';
import { PokemonDetail } from './components/pokemon-detail';

export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState<string>('');
  const [isConfigured, setIsConfigured] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {!isConfigured ? (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h1 className="mb-6 text-center">Pokemon Explorer</h1>
            <p className="text-gray-600 mb-4">
              Enter your API key to get started. If you're using PokeAPI, you can leave this blank.
            </p>
            <input
              type="text"
              placeholder="API Key (optional for PokeAPI)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => setIsConfigured(true)}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Exploring
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="container mx-auto px-4 py-8">
            <header className="mb-8 text-center">
              <h1 className="mb-2">Pokemon Explorer</h1>
              <p className="text-gray-600">Explore over 10,000 Pokemon</p>
            </header>
            
            <PokemonList 
              onSelectPokemon={setSelectedPokemon}
              apiKey={apiKey}
            />
          </div>

          {selectedPokemon && (
            <PokemonDetail
              pokemonId={selectedPokemon}
              onClose={() => setSelectedPokemon(null)}
              apiKey={apiKey}
            />
          )}
        </>
      )}
    </div>
  );
}
