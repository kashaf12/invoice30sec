"use client";

import { SearchIcon, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import { Button } from "@/components/ui/button";

const AVAILABLE_PAGES = [
  { path: "/", label: "Home" },
  { path: "/privacy", label: "Privacy Policy" },
  { path: "/terms", label: "Terms of Service" },
];

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<typeof AVAILABLE_PAGES>([]);

  useEffect(() => {
    if (query.trim() === "") {
      setSuggestions([]);
      return;
    }

    const filtered = AVAILABLE_PAGES.filter(
      (page) =>
        page.path.toLowerCase().includes(query.toLowerCase()) ||
        page.label.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(filtered);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (suggestions.length > 0) {
        router.push(suggestions[0].path);
      } else {
        // If no suggestions but valid path format, try navigating
        if (query.startsWith("/")) {
          router.push(query);
        }
      }
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Empty>
        <EmptyHeader>
          <div className="flex items-center justify-center gap-2 mb-4">
            <AlertCircle
              className="w-12 h-12 text-red-400"
              aria-hidden="true"
            />
          </div>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="relative w-full sm:w-[350px]">
            <InputGroup>
              <InputGroupInput
                placeholder="Try searching for pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <InputGroupAddon>
                <SearchIcon className="h-4 w-4" />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>

            {suggestions.length > 0 && (
              <div className="absolute top-full z-10 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
                <ul className="py-1">
                  {suggestions.map((page) => (
                    <li key={page.path}>
                      <button
                        className="w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground"
                        onClick={() => router.push(page.path)}
                      >
                        <span className="font-medium">{page.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          {page.path}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <EmptyDescription>
            Need help?{" "}
            <a
              href="mailto:kashafaahmed@gmail.com"
              className="underline underline-offset-2 hover:text-primary"
            >
              Contact support
            </a>
          </EmptyDescription>
        </EmptyContent>
      </Empty>
    </div>
  );
}
