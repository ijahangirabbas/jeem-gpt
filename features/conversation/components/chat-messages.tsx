"use client";

import { isTextUIPart, type UIMessage } from "ai";
import type { ChatStatus } from "ai";
import { useState } from "react";
import { Search, Loader2, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import { Loader } from "@/components/ai-elements/loader";

type ToolCallRendererProps = {
  toolInvocation: {
    state: string;
    toolCallId: string;
    input?: { query?: string };
    output?: string;
  };
};

function ToolCallRenderer({ toolInvocation }: ToolCallRendererProps) {
  const [isOpen, setIsOpen] = useState(false);
  const query = toolInvocation.input?.query || "";
  const isSearching = toolInvocation.state !== "output-available";

  let searchResults: { title: string; url: string; snippet: string }[] = [];
  if (toolInvocation.state === "output-available" && toolInvocation.output) {
    try {
      searchResults = JSON.parse(toolInvocation.output);
    } catch (e) {
      console.error("Failed to parse tool result:", e);
    }
  }

  return (
    <div className="my-2 max-w-xl rounded-lg border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
      <button
        onClick={() => !isSearching && setIsOpen(!isOpen)}
        disabled={isSearching}
        className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-xs font-medium hover:bg-muted/50 disabled:pointer-events-none transition-colors"
      >
        <div className="flex items-center gap-2">
          {isSearching ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
          ) : (
            <Search className="h-3.5 w-3.5 text-emerald-500" />
          )}
          <span className="text-foreground">
            {isSearching ? `Searching the web for "${query}"...` : `Searched the web for "${query}"`}
          </span>
        </div>
        {!isSearching && (
          <div>
            {isOpen ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />}
          </div>
        )}
      </button>
      
      {isOpen && searchResults.length > 0 && (
        <div className="border-t border-border bg-muted/10 px-4 py-3 text-xs flex flex-col gap-3">
          {searchResults.map((result, idx) => (
            <div key={idx} className="flex flex-col gap-1 border-b border-border/50 pb-2 last:border-0 last:pb-0">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                {result.title}
                <ExternalLink className="h-3 w-3" />
              </a>
              <p className="text-muted-foreground leading-normal">{result.snippet}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

type ChatMessagesProps = {
  messages: UIMessage[];
  status: ChatStatus;
};

/** Extracts plain text from a `UIMessage` by joining all text parts. */
function getMessageText(message: UIMessage) {
  return message.parts
    .filter(isTextUIPart)
    .map((part) => part.text)
    .join("");
}

/**
 * Renders the conversation message list with markdown responses and a loading indicator.
 */
export function ChatMessages({ messages, status }: ChatMessagesProps) {
  const isWaiting =
    status === "submitted" && messages.at(-1)?.role === "user";

  return (
    <Conversation>
      <ConversationContent className="py-8">
        {messages.map((message) => (
          <Message key={message.id} from={message.role}>
            <MessageContent>
              {message.parts && message.parts.length > 0 ? (
                message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <MessageResponse key={index}>
                        {part.text}
                      </MessageResponse>
                    );
                  }
                  if (part.type.startsWith("tool-")) {
                    return (
                      <ToolCallRenderer
                        key={(part as any).toolCallId}
                        toolInvocation={part as any}
                      />
                    );
                  }
                  return null;
                })
              ) : (
                <MessageResponse>{getMessageText(message)}</MessageResponse>
              )}
            </MessageContent>
          </Message>
        ))}

        {isWaiting ? (
          <Message from="assistant">
            <MessageContent>
              <Loader />
            </MessageContent>
          </Message>
        ) : null}
      </ConversationContent>
    </Conversation>
  );
}
