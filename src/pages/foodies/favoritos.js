import React, { useEffect, useState } from 'react';
import ProtectPage from "@/utils/hooks/protectPagesHook";
import ReceitaInfo from './receita'; // Ensure this is used or remove if it's not needed
import Link from 'next/link';
import { useRouter } from 'next/router'; // Correct the import for useRouter

export default function FavoritosPage() {
  const { loading: userLoading, userData } = ProtectPage();
  const [favoritos, setFavoritos] = useState([]);
  const [loadingFavoritos, setLoadingFavoritos] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!userLoading && userData?._id) {
      fetchFavoritos(userData._id);
    }
  }, [userLoading, userData]);

  const fetchFavoritos = async (idDoUsuario) => {
    setLoadingFavoritos(true);
    try {
      const response = await fetch(`/api/user/receitasFav`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idDoUsuario })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch favorite recipes');
      }

      const data = await response.json();
      setFavoritos(data);
    } catch (error) {
      console.error('Error fetching favorite recipes:', error);
    }
    setLoadingFavoritos(false)
  };

  const handleImagemClick = (recipe) => {
    const receitaSelecionada = recipe.titulo;
    console.log("Receita clicada:", receitaSelecionada);
    router.push({
      pathname: '/foodies/receita',
      query: { query: receitaSelecionada }
    })
  }

  if (userLoading || loadingFavoritos) return (
    <div className="flex justify-center items-center h-screen">
      <img src="https://images-ext-1.discordapp.net/external/O9fOp7KHXEPsHYJZfIAl_6WlcubBa-W3qkn9QKDVCA0/https/x.yummlystatic.com/web/spinner-light-bg.gif?width=250&height=250" alt="Loading..."></img>
    </div>
  )


  return (
    <main className="justify-center items-start text-center w-full overflow-hidden min-h-screen px-4 md:px-14 lg:px-20 xl:px-28 pt-5">
      <p className="text-center py-5 text-2xl 2xl:text-4xl">Os teus favoritos:</p>
      {favoritos.length === 0 && (
        <div>Ainda não tens nenhuma receita adicionada aos teus favoritos. <Link href={"/foodies/search"}>Adiciona-a aqui!</Link></div>
      )}
      <div className="flex flex-wrap mb-10 pb-10">
        {favoritos.map((recipe) => (
          <div key={recipe._id} className="w-1/2 md:w-1/3 lg:w-1/4 p-4">
            <div className="bg-cinzaClaro rounded-2xl h-full flex flex-col justify-between">
              <img onClick={() => handleImagemClick(recipe)} src={recipe.fotoReceita} alt="Favorite Recipe" className="rounded-t-2xl w-full h-40 object-cover" />
              <div className="flex-grow flex flex-col justify-center border-t-2 border-cinza">
                <p className="font-sans font-normal text-center p-3 text-sm md:text-base lg:text-lg xl:text-xl text-black">{recipe.titulo}</p>
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
