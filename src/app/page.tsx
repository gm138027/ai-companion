import { characters } from "@/lib/characters";
import CharacterSelect from "@/components/CharacterSelect";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-white">
          AI Companion
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Choose your virtual companion and start chatting!
        </p>
      </div>

      <div className="mb-12">
        <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Featured Companions
        </h2>
        <CharacterSelect characters={characters} />
      </div>
      
      <div className="rounded-lg bg-blue-50 p-6 dark:bg-blue-900/20">
        <h2 className="mb-2 text-xl font-semibold text-blue-800 dark:text-blue-300">
          About AI Companion
        </h2>
        <p className="text-blue-700 dark:text-blue-400">
          AI Companion is a platform that allows you to chat with various AI personalities.
          Our AI companions are designed to provide engaging conversation,
          emotional support, and entertainment. Choose a personality that
          resonates with you and start chatting now!
        </p>
      </div>
    </main>
  );
}