"use client";

import {useState} from "react";

export default function Home() {
  const [pokemonName, setPokemonName] = useState("");
 
  return (
    <>
      <h1>ポケモン図鑑</h1>
      <h2>検索してみよう！</h2>
      <p>名前を入力するとポケモンを検索できます。</p> 
      <div>
        <input 
          type="text"
          placeholder="ポケモンの名前を入力してください"
        />
        <button>検索</button>
      </div>
    </>
  )   
}
