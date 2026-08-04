import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ブラウザのタブなどに表示されるアプリ情報
export const metadata: Metadata = {
  title: "ポケモン図鑑",
  description: "PokeAPIを使用したポケモン図鑑アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800">

        {/* 全ページ共通のヘッダー */}
        <header className="border-b-4 border-red-800 bg-red-600 shadow-md">

          <div className="w-full max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

            {/* アプリ名 */}
            <Link
              href="/"
              className="text-2xl font-bold text-white tracking-wide hover:opacity-80"
            >
              ポケモン図鑑
            </Link>

            {/* ヘッダーのメニュー */}
            <nav className="flex items-center gap-3">

              {/* 一覧画面へのリンク */}
              <Link
                href="/"
                className="rounded-full border-2 border-white px-5 py-2 font-bold text-white hover:bg-white hover:text-red-600"
              >
                ポケモン一覧
              </Link>

              {/* 検索画面へのリンク */}
              <Link
                href="/search"
                className="flex w-40 items-center gap-3 rounded-lg border-2 border-white bg-white px-4 py-2 text-slate-500 shadow-sm hover:bg-red-50"
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
              </Link>

            </nav>

          </div>

        </header>

        {/* 各ページの内容 */}
        <div className="flex-1">
          {children}
        </div>

        {/* 全ページ共通のフッター */}
        <footer className="border-t-4 border-red-800 bg-red-600 mt-8">

          <div className="w-full max-w-6xl mx-auto px-4 py-6 text-center text-white">

            <p className="text-lg font-bold tracking-wide">
              ポケモン図鑑
            </p>

            <p className="text-sm text-red-100 mt-2">
              PokeAPIを使用して作成しています。
            </p>

            <p className="text-xs text-red-200 mt-2">
              Pokémon data provided by PokeAPI
            </p>

          </div>

        </footer>

      </body>
    </html>
  );
}
