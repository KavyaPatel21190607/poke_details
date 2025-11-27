import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface PokemonDetailProps {
  pokemonId: number;
  onClose: () => void;
  apiKey: string;
}

interface PokemonData {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: Array<{ type: { name: string } }>;
  abilities: Array<{ ability: { name: string }; is_hidden: boolean }>;
  stats: Array<{ base_stat: number; stat: { name: string } }>;
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
}

export function PokemonDetail({ pokemonId, onClose, apiKey }: PokemonDetailProps) {
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPokemonDetail();
  }, [pokemonId]);

  const fetchPokemonDetail = async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching Pokemon details:', error);
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    normal: 'bg-gray-400',
    fire: 'bg-orange-500',
    water: 'bg-blue-500',
    electric: 'bg-yellow-400',
    grass: 'bg-green-500',
    ice: 'bg-cyan-400',
    fighting: 'bg-red-600',
    poison: 'bg-purple-500',
    ground: 'bg-yellow-600',
    flying: 'bg-indigo-400',
    psychic: 'bg-pink-500',
    bug: 'bg-lime-500',
    rock: 'bg-yellow-700',
    ghost: 'bg-purple-700',
    dragon: 'bg-indigo-600',
    dark: 'bg-gray-700',
    steel: 'bg-gray-500',
    fairy: 'bg-pink-400',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <h2 className="capitalize">{pokemon?.name || 'Loading...'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : pokemon ? (
          <div className="p-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6">
                <img
                  src={pokemon.sprites.other['official-artwork'].front_default}
                  alt={pokemon.name}
                  className="w-64 h-64 object-contain"
                />
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="text-gray-500 text-sm mb-1">#{pokemon.id.toString().padStart(4, '0')}</div>
                  <h3 className="capitalize mb-3">{pokemon.name}</h3>
                </div>

                {/* Types */}
                <div>
                  <div className="text-sm text-gray-600 mb-2">Type</div>
                  <div className="flex gap-2">
                    {pokemon.types.map((t) => (
                      <span
                        key={t.type.name}
                        className={`px-4 py-1 rounded-full text-white capitalize ${typeColors[t.type.name] || 'bg-gray-400'}`}
                      >
                        {t.type.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Physical Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Height</div>
                    <div>{(pokemon.height / 10).toFixed(1)} m</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600 mb-1">Weight</div>
                    <div>{(pokemon.weight / 10).toFixed(1)} kg</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-6">
              <h3 className="mb-3">Base Stats</h3>
              <div className="space-y-3">
                {pokemon.stats.map((s) => (
                  <div key={s.stat.name}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm capitalize text-gray-600">
                        {s.stat.name.replace('-', ' ')}
                      </span>
                      <span className="text-sm">{s.base_stat}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${(s.base_stat / 255) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Abilities */}
            <div>
              <h3 className="mb-3">Abilities</h3>
              <div className="flex flex-wrap gap-2">
                {pokemon.abilities.map((a) => (
                  <span
                    key={a.ability.name}
                    className={`px-4 py-2 rounded-lg capitalize ${
                      a.is_hidden ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {a.ability.name.replace('-', ' ')}
                    {a.is_hidden && ' (Hidden)'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-gray-600">
            Failed to load Pokemon details
          </div>
        )}
      </div>
    </div>
  );
}
