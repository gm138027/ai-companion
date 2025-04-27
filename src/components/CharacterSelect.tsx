import Link from "next/link";
import { Character } from "@/lib/characters";

interface CharacterSelectProps {
  characters: Character[];
}

export default function CharacterSelect({ characters }: CharacterSelectProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
      {characters.map((character) => (
        <Link
          key={character.id}
          href={`/chat/${character.id}`}
          className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-transform hover:scale-105 hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
        >
          <div className="aspect-square w-full overflow-hidden">
            <img
              src={character.avatar}
              alt={character.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div className="p-4">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {character.name}
            </h3>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              {character.personality}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {character.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}