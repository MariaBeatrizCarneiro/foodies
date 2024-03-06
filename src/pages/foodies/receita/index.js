import React, { useEffect, useState } from "react"
import ReceitaGeral from "@/components/Receita/ReceitaGeral"
import ReceitaIngrediente from "@/components/Receita/ReceitaIngredientes"
import ReceitaPreparo from "@/components/Receita/ReceitaPreparo"
import Image from "next/image"
import { useRouter } from "next/router"

export default function ReceitaInfo() {
  const [pagina, setPagina] = useState("ReceitaGeral")
  const [receita, setReceita] = useState("")
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { query } = router
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [imagemAtual, setImagemAtual] = useState('/receitainfo/Favoriteborder.svg')

  const handleTrocarImagem = async () => {
    if (!userData || !receita) {
      console.log("Missing user data or recipe data.");
      return;
    }

    // Toggle the like status optimistically for immediate UI feedback
    const newImageSrc = imagemAtual === '/receitainfo/Favoriteborder.svg' ? '/receitainfo/Favorite.svg' : '/receitainfo/Favoriteborder.svg';
    setImagemAtual(newImageSrc);

    try {
      const payload = {
        idUsuario: userData._id,
        idReceita: receita._id,
      };

      const response = await fetch('/api/user/like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("token")}`, // Include if needed
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to toggle like status');
      }


    } catch (error) {
      console.error('Error toggling like status:', error);
      setImagemAtual(imagemAtual);

    }
  };



  const handlePageChange = (newPage) => {
    setPagina(newPage)
  }

  useEffect(() => {
    if (router.isReady) {
      const tituloReceita = router.query.query
      fetchInfoReceitas(tituloReceita);
    }
  }, [router.isReady, router.query.query])

  const fetchInfoReceitas = async (query) => {
    try {
      const response = await fetch(`/api/receitas/receitas?titulo=${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error('Failed to fetch favorite recipes')
      }
      const data = await response.json();
      // this will give me recipe data with likes being and array of user _ids
      setReceita(data)
    } catch (error) {
      console.error('Error fetching favorite recipes:', error)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    async function fetchData() {
      // This is correct; ensures code runs only on the client side
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const response = await fetch("/api/user/verificaToken", {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
            if (response.ok) {
              const data = await response.json();
              console.log(data)
              setUserData(data);
            } else {
              // Handle unauthorized or invalid token scenario
              console.error("Token verification failed.");
              router.push("/foodies/login");
            }
          } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
          }
        } else {
          // No token found, redirect or handle accordingly
          router.push("/foodies/login");
        }
      }
    }
    fetchData();
  }, []); 

  useEffect(() => {
    if (receita.likes && userData) {
      const isLiked = receita.likes.includes(userData._id);
      setImagemAtual(isLiked ? '/receitainfo/Favorite.svg' : '/receitainfo/Favoriteborder.svg');
    }
  }, [receita, userData]);

  const renderPage = () => {
    switch (pagina) {
      case "ReceitaGeral":
        return <ReceitaGeral geral={receita} />
      case "ReceitaIngrediente":
        return <ReceitaIngrediente ingredientes={receita} />
      case "ReceitaPreparo":
        return <ReceitaPreparo preparo={receita} />
    }
  }


  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen pb-40">
        <img src="https://images-ext-1.discordapp.net/external/O9fOp7KHXEPsHYJZfIAl_6WlcubBa-W3qkn9QKDVCA0/https/x.yummlystatic.com/web/spinner-light-bg.gif?width=250&height=250" alt="Loading..."></img>
      </div>
    )
  }

  return (
    <div className="font-sans">
      <div className="h-[290px] sm:h-[300px]  md:h-[310px] lg:h-[320px] xl:h-[340px] bg-cover bg-center bg-no-repeat border-b border-gray-300" style={{ backgroundImage: `url(${receita.fotoReceita})` }}>
        <div className="h-2/4 p-8">
          <Image src="/receitainfo/arrowBack.svg" className="cursor-pointer" onClick={() => router.back()} width="40" height="40" />
        </div>
        <div className="h-2/4 flex justify-end items-end p-8 ">
          <Image src={imagemAtual} width="40" height="40" onClick={handleTrocarImagem} className="cursor-pointer" />
        </div>
      </div>
      <div className="">
        <div className="flex">
          <div className="flex w-3/5 p-5 items-center font-extrabold text-lg">
            {receita.titulo}
          </div>
          <div className="w-2/5 p-5 flex justify-end">
            <div className="cursor-pointer w-32 h-10 border border-#868686 rounded-2xl text-verde font-bold flex items-center justify-center gap-2 p-2" style={{ fontSize: "11px", letterSpacing: "0.1px" }}>
              <Image src="/receitainfo/share.svg" width="20" height="20" />
              PARTILHAR
            </div>
          </div>
        </div>
        <div className="flex justify-around items-center border-b-2 border-gray-300 ">
          <button
            onClick={() => handlePageChange("ReceitaGeral")}
            className={pagina === "ReceitaGeral" ? "text-verde border-b-2 border-verde h-10 font-bold" : "h-10"}
          >
            Geral
          </button>
          <button
            onClick={() => handlePageChange("ReceitaIngrediente")}
            className={pagina === "ReceitaIngrediente" ? "text-verde border-b-2 border-verde h-10 font-bold" : "h-10"}
          >
            Ingredientes
          </button>
          <button
            onClick={() => handlePageChange("ReceitaPreparo")}
            className={pagina === "ReceitaPreparo" ? "text-verde border-b-2 border-verde h-10 font-bold" : "h-10"}>
            Preparo
          </button>
        </div>
        {userData && userData._id === "65e89d257f5aa8c1d93f84bb" && userData.admin === true && (
          <div>
            <button>Aceitar</button>
            <button>Apagar</button>
          </div>
        )}
        <div>{renderPage()}</div>
      </div>
    </div>
  )
}


