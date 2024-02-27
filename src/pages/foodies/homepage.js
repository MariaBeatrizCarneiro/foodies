import { useState, useEffect } from 'react';

export default function Home() {
  const [receitas, setReceitas] = useState([]);

  const fetchReceitas = async () => {
    try {
      const response = await fetch('/api/receitas/todasReceitas');
      if (!response.ok) {
        throw new Error('Falha ao buscar receitas');
      }
      const data = await response.json();
      setReceitas(data);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
    }
  };

  useEffect(() => {
    fetchReceitas();
  }, []);


  const receitasOrdenadasPorLikes = receitas.sort((a, b) => b.likes - a.likes);
  const top10Receitas = receitasOrdenadasPorLikes.slice(0, 10);

  const receitasRapidas = receitas.filter((e) => e.tempoPreparo < 40);

  const receitasFaceis = receitas.filter((e) => e.dificuldade == "Fácil");

  const receitasSaudavies = receitas.filter((e) => e.calorias < 200);

  const receitasBaratas = receitas.filter((e) => e.preco < 2);

  const pratosPrincipais = receitas.filter((e) => e.categoria == "Prato Principal");

  return (
    <div className="min-h-screen">
      <p className='text-3xl text-center py-5'>Todas as Receitas:</p>
      <ul>
        {receitas.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Top 10 Receitas:</p>
      <ul>
        {top10Receitas.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Receitas Rápidas:</p>
      <ul>
        {receitasRapidas.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Receitas Fáceis:</p>
      <ul>
        {receitasFaceis.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Receitas Saudáveis:</p>
      <ul>
        {receitasSaudavies.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Receitas Baratas:</p>
      <ul>
        {receitasBaratas.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

      <p className='text-3xl text-center py-5'>Pratos Principais:</p>
      <ul>
        {pratosPrincipais.map(e => {
          return (
            <li key={e._id}>
              <p className='text-2xl py-2'>{e.titulo}</p>
              <p>Ingredientes: {e.ingredientes}</p>
              <p>Quantidades: {e.quantidades}</p>
              <p>Dificuldade: {e.dificuldade}</p>
              <p>TempoPreparo: {e.tempoPreparo}</p>
              <p>Calorias: {e.calorias}</p>
              <p>Preco: {e.preco}</p>
              <p>Likes: {e.likes}</p>
              <p>Categoria: {e.categoria}</p>
            </li>
          );
        })}
      </ul>

    </div>
  );  
}