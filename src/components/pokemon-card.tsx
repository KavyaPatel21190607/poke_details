interface PokemonCardProps {
  id: number;
  name: string;
  onClick: () => void;
}

export function PokemonCard({ id, name, onClick }: PokemonCardProps) {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

  return (
    <button
      onClick={onClick}
      className="bg-white rounded-lg shadow hover:shadow-lg transition-all p-4 text-center group cursor-pointer"
    >
      <div className="aspect-square mb-3 flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="text-gray-500 text-sm mb-1">#{id.toString().padStart(4, '0')}</div>
      <h3 className="capitalize">{name}</h3>
    </button>
  );
}
