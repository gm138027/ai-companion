"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Character, getCharacterById } from "@/lib/characters";
import ChatInterface from "@/components/ChatInterface";
import Link from "next/link";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.characterId) {
      const characterId = Array.isArray(params.characterId)
        ? params.characterId[0]
        : params.characterId;

      const foundCharacter = getCharacterById(characterId);
      if (foundCharacter) {
        setCharacter(foundCharacter);
      } else {
        // Redirect to home if character not found
        router.push("/");
      }
    }
    setLoading(false);
  }, [params.characterId, router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500 mx-auto"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl">Character not found</h1>
          <Link
            href="/"
            className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto h-screen max-w-4xl p-4">
      <div className="mb-4">
        <Link
          href="/"
          className="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
        >
          ← Back to all characters
        </Link>
      </div>
      <div className="h-[calc(100vh-120px)] overflow-hidden rounded-lg border border-gray-200 shadow-lg dark:border-gray-700">
        <ChatInterface character={character} />
      </div>
    </div>
  );
}