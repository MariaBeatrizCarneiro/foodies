import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
  
  export default function SearchPage() {
    const [receitas, setReceitas] = useState([]);
    const [receitasOriginais, setReceitasOriginais] = useState([]);
    const [filtroDificuldade, setFiltroDificuldade] = useState([]);
    const [filtroCategoria, setFiltroCategoria] = useState([]);
    const [filtroOrdem, setFiltroOrdem] = useState(null);
    const [alimentoQueQuer, setAlimentoQueQuer] = useState("");
    const [alimentoQueNaoQuer, setAlimentoQueNaoQuer] = useState("");
    const [alimentosQueQuer, setAlimentosQueQuer] = useState([]);
    const [alimentosQueNaoQuer, setAlimentosQueNaoQuer] = useState([]);
    const [showMenuFiltros, setShowMenuFiltros] = useState(false);
    const [showMenuDificuldade, setShowMenuDificuldade] = useState(false);
    const [showMenuCategoria, setShowMenuCategoria] = useState(false);
    const [showMenuOrdenar, setShowMenuOrdenar] = useState(false);
    const [dificuldadeSelecionada, setDificuldadeSelecionada] = useState({});
    const [categoriaSelecionada, setCategoriaSelecionada] = useState({});
    const [erroIncluir, setErroIncluir] = useState("");
    const [erroExcluir, setErroExcluir] = useState("");
    const [imagensAtuais, setImagensAtuais] = useState({});
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
  
    const router = useRouter();
    const refDificuldade = useRef();
    const refCategoria = useRef();
    const refOrdenar = useRef();
  
    // Arrays
    const alimentosArray = receitas.reduce((accumulator, current) => { accumulator.push(...current.ingredientes); return accumulator; }, []);
    const alimentosUnicosArray = Array.from(new Set(alimentosArray));
    const dificuldades = ["Fácil", "Médio", "Difícil"];
    const categorias = ["Entrada", "Prato Principal", "Sobremesa", "Lanche"];
    const ordens = ["Mais caloricas primeiro", "Menos caloricas primeiro", "Mais baratas primeiro", "Mais caras primeiro"];
  
    useEffect(() => {
      fetchReceitas();
    }, []);
  
    useEffect(() => {
      const imagensInicial = receitasOriginais.reduce((acc, receita) => {
        acc[receita.id] = '/receitainfo/Favoriteborder.svg';
        return acc;
      }, {});
      setImagensAtuais(imagensInicial);
    }, [receitasOriginais]);
    
    useEffect(() => {
      if (router.isReady) {
        const foodName = router.query.query;
        if (foodName) {
          setAlimentosQueQuer([foodName]);
          aplicarFiltros();
        }
      }
    }, [router.isReady, router.query.query]);
  
    useEffect(() => {
      aplicarFiltros();
    }, [filtroDificuldade, filtroCategoria, filtroOrdem, alimentosQueQuer, alimentosQueNaoQuer, receitasOriginais]);
        

    useEffect(() => {
      // Atualizar estado dificuldadeSelecionada quando filtroDificuldade muda
      const newDificuldadeSelecionada = {};
      dificuldades.forEach((dificuldade) => {
        newDificuldadeSelecionada[dificuldade] = filtroDificuldade.includes(dificuldade);
      });
      setDificuldadeSelecionada(newDificuldadeSelecionada);
    }, [filtroDificuldade]);
    
    useEffect(() => {
      // Atualizar estado categoriaSelecionada quando filtroCategoria muda
      const newCategoriaSelecionada = {};
      categorias.forEach((categoria) => {
        newCategoriaSelecionada[categoria] = filtroCategoria.includes(categoria);
      });
      setCategoriaSelecionada(newCategoriaSelecionada);
    }, [filtroCategoria]);
  
    const fetchReceitas = async () => {
      try {
        const response = await fetch("/api/receitas/todasReceitas");
        if (!response.ok) {
          throw new Error("Falha ao buscar receitas");
        }
        const data = await response.json();
        setReceitasOriginais(data);
        setReceitas(data);
      } catch (error) {
        console.error("Erro ao buscar receitas:", error);
      }
    };
  
    const aplicarFiltros = () => {
      let receitasFiltradas = [...receitasOriginais];
  
      if (filtroDificuldade && filtroDificuldade.length > 0) {
        receitasFiltradas = receitasFiltradas.filter((receita) => filtroDificuldade.includes(receita.dificuldade));
      }
  
      if (filtroCategoria && filtroCategoria.length > 0) {
        receitasFiltradas = receitasFiltradas.filter((receita) => filtroCategoria.includes(receita.categoria));
      }
  
      if (filtroOrdem === "Mais caloricas primeiro") {
        receitasFiltradas.sort((a, b) => b.calorias - a.calorias);
      } else if (filtroOrdem === "Menos caloricas primeiro") {
        receitasFiltradas.sort((a, b) => a.calorias - b.calorias);
      } else if (filtroOrdem === "Mais caras primeiro") {
        receitasFiltradas.sort((a, b) => b.preco - a.preco);
      } else if (filtroOrdem === "Mais baratas primeiro") {
        receitasFiltradas.sort((a, b) => a.preco - b.preco);
      }
  
      receitasFiltradas = receitasFiltradas.filter(
        (receita) =>
          alimentosQueQuer.every((alimento) =>
            receita.ingredientes.map((ingrediente) => ingrediente.toLowerCase()).includes(alimento.toLowerCase())
          ) &&
          !alimentosQueNaoQuer.some((alimento) =>
            receita.ingredientes.map((ingrediente) => ingrediente.toLowerCase()).includes(alimento.toLowerCase())
          )
      );
  
      setReceitas(receitasFiltradas);
    };
  
    useEffect(() => {
      aplicarFiltros();
    }, [filtroDificuldade, filtroCategoria, filtroOrdem, alimentosQueQuer, alimentosQueNaoQuer]);
  

    const handleReceitaInfo = (e) => {
      const receitaSelecionada = e.titulo;
      router.push({
        pathname: '/foodies/receita',
        query: { query: receitaSelecionada }
      });
    };


    // Função que é executada quando o form 'INCLUIR' é submetido (carregando no enter)
    const handleIncluir = (e) => {
      e.preventDefault();
      const novoAlimento = alimentoQueQuer.charAt(0).toUpperCase() + alimentoQueQuer.slice(1);
      if (!receitasOriginais.flatMap((receita) => receita.ingredientes).includes(novoAlimento)) {
        setErroIncluir("Alimento não encontrado");
        setTimeout(() => { setErroIncluir("") }, 1000);
        return;
      }

      if (alimentosQueQuer.includes(novoAlimento)) {
        setErroIncluir("Alimento já está na lista");
        setTimeout(() => { setErroIncluir("") }, 1000);
        return;
      }

      if (alimentosQueNaoQuer.includes(novoAlimento)) {
        const newAlimentosQueNaoQuer = alimentosQueNaoQuer.filter((alimento) => alimento !== novoAlimento);
        setAlimentosQueNaoQuer(newAlimentosQueNaoQuer);
      }

      setAlimentosQueQuer([...alimentosQueQuer, novoAlimento]);
      setAlimentoQueQuer("");
    };

    // Função que é executada quando o form 'EXCLUIR' é submetido (carregando no enter)
    const handleExcluir = (e) => {
      e.preventDefault();
      const novoAlimento = alimentoQueNaoQuer.charAt(0).toUpperCase() + alimentoQueNaoQuer.slice(1);
      if (!receitasOriginais.flatMap((receita) => receita.ingredientes).includes(novoAlimento)) {
        setErroExcluir("Alimento não encontrado");
        setTimeout(() => { setErroExcluir("") }, 1000);
        return;
      }

      if (alimentosQueNaoQuer.includes(novoAlimento)) {
        setErroExcluir("Alimento já está na lista");
        setTimeout(() => { setErroExcluir("") }, 1000);
        return;
      }

      if (alimentosQueQuer.includes(novoAlimento)) {
        const newAlimentosQueQuer = alimentosQueQuer.filter((alimento) => alimento !== novoAlimento);
        setAlimentosQueQuer(newAlimentosQueQuer);
      }

      setAlimentosQueNaoQuer([...alimentosQueNaoQuer, novoAlimento]);
      setAlimentoQueNaoQuer("");
    };

    const handleRemoverAlimentoQueQuer = (alimento) => {
      const newAlimentosQueQuer = alimentosQueQuer.filter((item) => item !== alimento);
      setAlimentosQueQuer(newAlimentosQueQuer);
    };    

    const handleRemoverAlimentoQueNaoQuer = (alimento) => {
      const newAlimentosQueNaoQuer = alimentosQueNaoQuer.filter((item) => item !== alimento);
      setAlimentosQueNaoQuer(newAlimentosQueNaoQuer);
    };

    // Função para manipular a seleção de filtros de dificuldade
    const handleFiltroDificuldade = (dificuldade) => {
      setDificuldadeSelecionada({ ...dificuldadeSelecionada, [dificuldade]: !dificuldadeSelecionada[dificuldade] });
      if (filtroDificuldade.includes(dificuldade)) {
        setFiltroDificuldade(filtroDificuldade.filter((item) => item !== dificuldade));
      } else {
        setFiltroDificuldade([...filtroDificuldade, dificuldade]);
      }
    };

    // Função para manipular a seleção de filtros de categoria
    const handleFiltroCategoria = (categoria) => {
      setCategoriaSelecionada({ ...categoriaSelecionada, [categoria]: !categoriaSelecionada[categoria] });
      if (filtroCategoria.includes(categoria)) {
        setFiltroCategoria(filtroCategoria.filter((item) => item !== categoria));
      } else {
        setFiltroCategoria([...filtroCategoria, categoria]);
      }
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          !refCategoria.current.contains(event.target) &&
          !refOrdenar.current.contains(event.target) &&
          !refDificuldade.current.contains(event.target)
        ) {
          setShowMenuCategoria(false);
          setShowMenuOrdenar(false);
          setShowMenuDificuldade(false);
        }
      };
    
      document.addEventListener('mousedown', handleClickOutside);
    
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [refCategoria, refOrdenar, refDificuldade]);
    
    // Function to toggle the visibility of the dropdown menus
    const toggleDropdownMenu = (menuName) => {
      setShowMenuCategoria(menuName === 'Categoria' ? !showMenuCategoria : false);
      setShowMenuOrdenar(menuName === 'Ordenar' ? !showMenuOrdenar : false);
      setShowMenuDificuldade(menuName === 'Dificuldade' ? !showMenuDificuldade : false);
    };
    
    



  return (
    <main className="justify-center items-start text-center w-full overflow-hidden min-h-screen px-4 md:px-14 lg:px-20 xl:px-28 pt-5">
      
      {/* Botões de Filtros */}
      <div className="relative flex justify-between">

        {/* Botão de Dificuldades */}
        <div ref={refDificuldade} onClick={() => toggleDropdownMenu('Dificuldade')}>
          <button className="btnDificuldade py-2 px-3 mx-1 bg-verdeClaro text-white text-sm font-semibold rounded-xl hover:bg-verde focus:outline-none focus:bg-verde" onClick={() => setShowMenuDificuldade(!showMenuDificuldade)}>
            Dificuldades ▿
          </button>
          {showMenuDificuldade && (
            <div className="absolute top-10 left-0 mt-2 bg-white rounded-lg shadow-lg z-40">
              <ul>
                {dificuldades.map((dificuldade) => (
                  <li key={dificuldade} className="bg-gray-50 py-2 px-4 text-left">
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4" 
                        onChange={() => handleFiltroDificuldade(dificuldade)} 
                        checked={dificuldadeSelecionada[dificuldade] || alimentosQueQuer.includes(dificuldade)}
                      />
                      <div className="ml-2" onClick={() => handleFiltroDificuldade(dificuldade)}>{dificuldade}</div>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Botão de Categorias */}
        <div ref={refCategoria} onClick={() => toggleDropdownMenu('Categoria')}>
          <button className="btnCategoria py-2 px-3 mx-1  bg-verdeClaro text-white text-sm font-semibold rounded-xl hover:bg-verde focus:outline-none focus:bg-verde" onClick={() => setShowMenuCategoria(!showMenuCategoria)}>
            Categorias ▿
          </button>
          {showMenuCategoria && (
            <div className="absolute top-10 items-center mt-2 bg-white rounded-lg shadow-lg z-40">
              <ul>
                {categorias.map((categoria) => (
                  <li key={categoria} className="bg-gray-50 py-2 px-4 text-left">
                    <label className="inline-flex items-center">
                      <input 
                        type="checkbox" 
                        className="form-checkbox h-4 w-4" 
                        onChange={() => handleFiltroCategoria(categoria)} 
                        checked={categoriaSelecionada[categoria] || alimentosQueQuer.includes(categoria)}
                      />
                      <span className="ml-2" onClick={() => handleFiltroCategoria(categoria)}>{categoria}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Botão de Ordenação */}
        <div ref={refOrdenar} onClick={() => toggleDropdownMenu('Ordenar')}>
          <button className="btnOrdenar py-2 px-3 mx-1  bg-verdeClaro text-white text-sm font-semibold rounded-xl hover:bg-verde focus:outline-none focus:bg-verde" onClick={() => setShowMenuOrdenar(!showMenuOrdenar)}>
            Ordenar por ▿
          </button>
          {showMenuOrdenar && (
            <div className="absolute top-10 right-0 mt-2 bg-white rounded-lg shadow-lg z-40">
              <ul>
                {ordens.map((ordem) => (
                  <li key={ordem} className="bg-gray-50 py-2 px-4">
                    <button className="w-full text-left focus:outline-none" onClick={() => { setFiltroOrdem(ordem); setShowMenuOrdenar(false); }}>
                      {ordem}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Barra de pesquisa para incluir alimentos */}
      <div className="flex items-center justify-center mt-4">
        <form className="flex w-full" onSubmit={handleIncluir}>
          <input list="alimentoQueQuer" type="text" value={alimentoQueQuer} onChange={(e) => setAlimentoQueQuer(e.target.value)} placeholder="Qual o alimento que tem para hoje?" className="w-full p-2 me-2 border border-gray-300 rounded-xl focus:outline-none focus:border-verde" />
          <datalist id="alimentoQueQuer">
            {alimentosUnicosArray.map((e, index) => (
              <option key={index} value={e} />
            ))}
          </datalist>
          <button type="submit" className="py-2 px-4 bg-verdeClaro text-white text-sm font-semibold rounded-xl hover:bg-verde focus:outline-none focus:bg-verde">Incluir</button>
        </form>
        <p className="text-red-500 text-sm">{erroIncluir}</p>
      </div>


      {/* Barra de pesquisa para excluir alimentos */}
      <div className="flex items-center justify-center mt-4">
        <form className="flex w-full" onSubmit={handleExcluir}>
          <input list="alimentoQueNaoQuer" type="text" value={alimentoQueNaoQuer} onChange={(e) => setAlimentoQueNaoQuer(e.target.value)} placeholder="Não quero cozinhar com..." className="w-full p-2 me-2 border border-gray-300 rounded-xl focus:outline-none focus:border-red-500" />
          <datalist id="alimentoQueNaoQuer">
            {alimentosUnicosArray.map((e, index) => (
              <option key={index} value={e} />
            ))}
          </datalist>
          <button type="submit" className="py-2 px-4 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 focus:outline-none focus:bg-red-600">Excluir</button>
        </form>
        <p className="text-red-500 text-sm">{erroExcluir}</p>
      </div>

      {/* Lista de alimentos e filtros selecionados */}
        <div className="flex mt-2 flex-wrap p-2 rounded-lg">
          {alimentosQueQuer.map((alimento, index) => (
            <label key={index} className="flex items-center py-1 px-2 rounded-xl m-1 bg-gray-100" onClick={() => handleRemoverAlimentoQueQuer(alimento)}>
              <input type="checkbox" className="form-checkbox h-4 w-4 mr-2" checked={true} onChange={() => {}} />
              {alimento}
            </label>
          ))}
          {/* Alimentos que não quer */}
          {alimentosQueNaoQuer.map((alimento, index) => (
            <label key={index} className="flex items-center py-1 px-2 rounded-xl m-1 bg-gray-100" onClick={() => handleRemoverAlimentoQueNaoQuer(alimento)}>
              <input type="checkbox" className="form-checkbox h-4 w-4 mr-2" checked={true} onChange={() => {}} />
              Sem {alimento}
            </label>
          ))}

          {/* Filtro de dificuldade */}
          {filtroDificuldade.map((filtro, index) => (
            <label key={index} className="flex items-center py-1 px-2 rounded-xl m-1 bg-gray-100">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 mr-2" 
                checked={true}
                onChange={(e) =>
                  e.target.checked
                    ? setFiltroDificuldade([...filtroDificuldade, filtro])
                    : setFiltroDificuldade(filtroDificuldade.filter((item) => item !== filtro))
                }
              />
              {filtro}
            </label>
          ))}

          {/* Filtro de categoria */}
          {filtroCategoria.map((filtro, index) => (
            <label key={index} className="flex items-center py-1 px-2 rounded-xl m-1 bg-gray-100">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 mr-2" 
                checked={true}
                onChange={(e) =>
                  e.target.checked
                    ? setFiltroCategoria([...filtroCategoria, filtro])
                    : setFiltroCategoria(filtroCategoria.filter((item) => item !== filtro))
                }
              />
              {filtro}
            </label>
          ))}

          {/* Filtro de ordem */}
          {filtroOrdem && (
            <div className="flex items-center py-1 px-2 rounded-xl m-1 bg-gray-100" onClick={() => setFiltroOrdem(null)}>
              <input type="checkbox" className="form-checkbox h-4 w-4 mr-2" checked={true} onChange={() => {}} />
              {filtroOrdem}
            </div>
          )}
        </div>

      {/* Cards de receitas pretendidas */}
      <p className="text-center py-5 text-2xl 2xl:text-4xl">Receitas:</p>
      <div className="flex flex-wrap mb-10 pb-10">
        {receitas.map((e) => (
          <div onClick={() => handleReceitaInfo(e)} className="w-1/2 md:w-1/3 lg:w-1/4 p-4 relative" key={e._id}>
            <div className="bg-cinzaClaro rounded-2xl h-full flex flex-col justify-between min-w-[160px] relative">
              <img src={e.fotoReceita} className="rounded-t-2xl w-full h-40 object-cover" />
              <div className="flex-grow flex flex-col justify-center border-t-2 border-cinza">
                <p className="font-sans font-normal text-center p-2 text-sm md:text-base lg:text-lg xl:text-xl text-black">{e.titulo}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

