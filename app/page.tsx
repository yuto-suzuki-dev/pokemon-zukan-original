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
          value={pokemonName}
          onChange={(e) => {
            //入力したときに実行したい処理
            setPokemonName(e.target.value);
          }}
          placeholder="ポケモンの名前を入力してください"
        />
      </div>
      
      <div>
        <p>今あなたが入力した文字は {pokemonName} です</p>
        <button>検索</button>
      </div>
    </>
  )   
}
