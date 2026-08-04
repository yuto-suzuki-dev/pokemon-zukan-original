"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";

interface SearchPokemon {
  id: number;
  jaName: string;
  image: string;
}

export default function SearchModal() {
  // 検索モーダルの開閉状態
  const [isOpen, setIsOpen] = useState(false);

  // 検索欄へ入力した文字
  const [keyword, setKeyword] = useState("");

  // 検索結果
  const [searchResults, setSearchResults] = useState<SearchPokemon[]>([]);

  // 検索中かどうか
  const [isLoading, setIsLoading] = useState(false);

  // 検索結果が存在しない場合などのメッセージ
  const [message, setMessage] = useState("");

  // Escapeキーでモーダルを閉じる
  useEffect(() => {
    const closeModalWithEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", closeModalWithEscapeKey);

    return () => {
      window.removeEventListener("keydown", closeModalWithEscapeKey);
    };
  }, []);

  // モーダルを開く
  const openModal = () => {
    setIsOpen(true);
  };

  // モーダルを閉じる
  const closeModal = () => {
    setIsOpen(false);
    setKeyword("");
    setSearchResults([]);
    setMessage("");
  };

  // ポケモンを検索
  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedKeyword = keyword.trim();

    if (!trimmedKeyword) {
      setSearchResults([]);
      setMessage("ポケモン名を入力してください。");
      return;
    }

    setIsLoading(true);
    setMessage("");
    setSearchResults([]);

    try {
      const response = await fetch("/api/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword: trimmedKeyword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? "検索に失敗しました。");
      }

      setSearchResults(data.results);

      if (data.results.length === 0) {
        setMessage("該当するポケモンが見つかりませんでした。");
      }
    } catch (error) {
      console.error("ポケモン検索エラー", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "検索中にエラーが発生しました。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* 検索モーダルを開くボタン */}
      <button
        type="button"
        onClick={openModal}
        className="flex w-40 items-center gap-3 rounded-lg border-2 border-white bg-white px-4 py-2 text-slate-500 shadow-sm hover:bg-red-50 cursor-pointer"
      >
        <span
          aria-hidden="true"
          className="text-xl"
        >
          🔍
        </span>

        <span className="font-bold">
          検索する
        </span>
      </button>

      {/* 検索モーダル */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onMouseDown={closeModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-modal-title"
            className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
            onMouseDown={(event) => {
              event.stopPropagation();
            }}
          >
            {/* モーダル上部 */}
            <div className="mb-6 flex items-center justify-between">
              <h2
                id="search-modal-title"
                className="text-2xl font-bold text-slate-800"
              >
                ポケモン検索
              </h2>

              <button
                type="button"
                onClick={closeModal}
                aria-label="検索モーダルを閉じる"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-xl text-slate-500 hover:bg-slate-100 cursor-pointer"
              >
                ×
              </button>
            </div>

            {/* 検索フォーム */}
            <form
              onSubmit={handleSearch}
              className="flex gap-3"
            >
              <input
                type="text"
                value={keyword}
                onChange={(event) => {
                  setKeyword(event.target.value);
                }}
                placeholder="例）ピカチュウ、カヌチャン"
                className="min-w-0 flex-1 rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100"
                autoFocus
              />

              <button
                type="submit"
                disabled={isLoading}
                className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 cursor-pointer"
              >
                {isLoading ? "検索中..." : "検索"}
              </button>
            </form>

            {/* メッセージ */}
            {message && (
              <p className="mt-6 text-center text-slate-500">
                {message}
              </p>
            )}

            {/* 検索結果 */}
            {searchResults.length > 0 && (
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {searchResults.map((pokemon) => {
                  return (
                    <Link
                      key={pokemon.id}
                      href={`/pokemon/${pokemon.id}`}
                      onClick={closeModal}
                      className="flex items-center gap-4 rounded-lg border border-slate-200 bg-slate-50 p-4 hover:border-red-300 hover:bg-red-50"
                    >
                      {/* ポケモンの画像 */}
                      <div className="flex h-24 w-24 shrink-0 items-center justify-center">
                        <img
                          src={pokemon.image}
                          alt={pokemon.jaName}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>

                      {/* ポケモンの名前と番号 */}
                      <div>
                        <p className="text-sm text-slate-500">
                          #{String(pokemon.id).padStart(4, "0")}
                        </p>

                        <p className="mt-1 text-lg font-bold text-slate-800">
                          {pokemon.jaName}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
