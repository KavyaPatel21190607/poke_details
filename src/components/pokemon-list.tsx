import { useState, useEffect } from 'react';
import { PokemonCard } from './pokemon-card';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';

interface PokemonListItem {
  id: number;
  name: string;
  url: string;
}

interface PokemonListProps {
  onSelectPokemon: (id: number) => void;
  apiKey: string;
}

export function PokemonList({ onSelectPokemon, apiKey }: PokemonListProps) {
  const [pokemon, setPokemon] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCount, setTotalCount] = useState(10000);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchPokemon();
  }, [currentPage]);

  const fetchPokemon = async () => {
    setLoading(true);
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const url = `https://pokeapi.co/api/v2/pokemon?limit=${itemsPerPage}&offset=${offset}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      setTotalCount(data.count);
      
      const pokemonWithIds = data.results.map((p: any, index: number) => ({
        id: offset + index + 1,
        name: p.name,
        url: p.url
      }));
      
      setPokemon(pokemonWithIds);
    } catch (error) {
      console.error('Error fetching Pokemon:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPokemon = pokemon.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div>
      {/* Search Bar */}
      <div className="mb-6 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pokemon Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
          {filteredPokemon.map((p) => (
            <PokemonCard
              key={p.id}
              id={p.id}
              name={p.name}
              onClick={() => onSelectPokemon(p.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
        </div>

        <button
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Page Jump */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <span className="text-gray-600">Go to page:</span>
        <input
          type="number"
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              setCurrentPage(page);
            }
          }}
          className="w-20 px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}
