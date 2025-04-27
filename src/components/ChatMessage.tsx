import Image from "next/image";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
  avatarSrc?: string;
}

export default function ChatMessage({
  content,
  role,
  avatarSrc,
}: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        <div className="relative h-10 w-10 overflow-hidden rounded-full">
          {isUser ? (
            <div className="flex h-full w-full items-center justify-center bg-blue-500 text-white">
              You
            </div>
          ) : (
            avatarSrc && (
              <Image
                src={avatarSrc}
                alt="Character avatar"
                width={40}
                height={40}
                className="object-cover"
              />
            )
          )}
        </div>
        <div
          className={`mx-2 rounded-lg p-3 ${
            isUser
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
          }`}
        >
          {content}
        </div>
      </div>
    </div>
  );
}