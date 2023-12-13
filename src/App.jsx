import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function App() {
  const { register, handleSubmit, reset, setFocus, watch } = useForm();
  const [open, setOpen] = useState(false);
  const [carros, setCarros] = useState([]);

  const [openEdit, setOpenEdit] = useState(false);
  const [openStats, setOpenStats] = useState(false);
  //states para carregar as info no modal de edição:
  const [modalModelo, setModalModelo] = useState("");
  const [modalMarca, setModalMarca] = useState("");
  const [modalAno, setModalAno] = useState("");
  const [modalPreco, setModalPreco] = useState("");
  const [modalFoto, setModalFoto] = useState("");

  //state para busca/filtro
  const [busca, setBusca] = useState("");

  //state para estatísticas
  const [totalCars, setTotalCars] = useState(0);
  const [media, setMedia] = useState(0);
  const [modeloTop, setModeloTop] = useState("");
  const [marcaTop, setMarcaTop] = useState("");
  const [anoTop, setAnoTop] = useState("");
  const [precoTop, setPrecoTop] = useState("");
  const [fotoTop, setFotoTop] = useState("");

  function onOpenModal() {
    setOpen(true);
  }

  function onCloseModal() {
    setOpen(false);
  }

  function mostraCarro(indice) {
    setModalModelo(carros[indice].modelo);
    setModalMarca(carros[indice].marca);
    setModalAno(carros[indice].ano);
    setModalPreco(carros[indice].preco);
    setModalFoto(carros[indice].foto);
    setOpenEdit(true);
  }

  function excluiCarro(indice) {
    const modelo = carros[indice].modelo;
    if (confirm(`Confirma a exclusão do carro ${modelo}?`)) {
      const carros2 = [...carros];
      carros2.splice(indice, 1);
      setCarros(carros2);
      localStorage.setItem("carros", JSON.stringify(carros2));
    }
  }

  function gravaDados(data) {
    const carros2 = [...carros];
    carros2.push({
      modelo: data.modelo,
      marca: data.marca,
      ano: data.ano,
      preco: data.preco,
      foto: data.foto,
    });
    setCarros(carros2);
    setFocus("modelo");
    reset({ modelo: "", marca: "", ano: "", preco: "", foto: "" });
    localStorage.setItem("carros", JSON.stringify(carros2));
  }

  //Logica da estatística
  function showStatistic() {
    if (carros.length > 0) {
      const nCarros = carros.length;
      let somatorio = 0;
      carros.forEach((obj) => (somatorio = somatorio + Number(obj.preco)));
      const mediaCarros = somatorio / nCarros;

      let max = carros.map((x) => x);
      max.sort(function (a, b) {
        return b.preco - a.preco;
      });

      setModeloTop(max[0].modelo);
      setMarcaTop(max[0].marca);
      setAnoTop(max[0].ano);
      setPrecoTop(max[0].preco);
      setFotoTop(max[0].foto);
      setMedia(mediaCarros.toFixed(2));
      setTotalCars(nCarros);
    }
    setOpenStats(true);
  }

  const listaCarros = carros.map((carro, i) => (
    <tr key={i}>
      <td>{carro.modelo}</td>
      <td>{carro.marca}</td>
      <td>{carro.ano}</td>
      <td>
        {Number(carro.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td width={180}>
        <img
          src={carro.foto}
          width={150}
          height={100}
          alt={`Foto do Carro ${carro.modelo} da marca ${carro.marca}`}
          className="center"
        />
      </td>
      <td>
        <i
          className="bi bi-search fs-4 text-info"
          style={{ cursor: "pointer" }}
          title="Ver Detalhes"
          onClick={() => mostraCarro(i)}
        ></i>
        <i
          className="bi bi-trash3 fs-4 text-danger"
          style={{ cursor: "pointer" }}
          title="Excluir Carro"
          onClick={() => excluiCarro(i)}
        ></i>
      </td>
    </tr>
  ));

  function toFilterCars(obj) {
    const lowerBusca = busca.toLowerCase();

    if (
      obj.modelo.toLowerCase().includes(lowerBusca) ||
      obj.marca.toLowerCase().includes(lowerBusca)
    ) {
      return true;
    } else {
      return false;
    }
  }

  const buscaCarros = carros.filter(toFilterCars);

  const listaCarrosBuscados = buscaCarros.map((carro, i) => (
    <tr key={i}>
      <td>{carro.modelo}</td>
      <td>{carro.marca}</td>
      <td>{carro.ano}</td>
      <td>
        R${" "}
        {Number(carro.preco).toLocaleString("pt-br", {
          minimumFractionDigits: 2,
        })}
      </td>
      <td width={180}>
        <img
          src={carro.foto}
          width={150}
          height={100}
          alt={`Foto do Carro ${carro.modelo} da marca ${carro.marca}`}
          className="center"
        />
      </td>
      <td>
        <i
          className="bi bi-search fs-4 text-info"
          style={{ cursor: "pointer" }}
          title="Ver Detalhes"
          onClick={() => mostraCarro(i)}
        ></i>
        <i
          className="bi bi-trash3 fs-4 text-danger"
          style={{ cursor: "pointer" }}
          title="Excluir Carro"
          onClick={() => excluiCarro(i)}
        ></i>
      </td>
    </tr>
  ));

  useEffect(() => {
    if (localStorage.getItem("carros")) {
      const carros2 = JSON.parse(localStorage.getItem("carros"));
      setCarros(carros2);
    }
  }, []);

  return (
    <>
      <div className="container-fluid">
        <nav className="navbar bg-secondary">
          <div className="container-fluid">
            <a className="navbar-brand text-white" href="#">
              <img
                src="./logoteucarro.png"
                alt="Logo"
                className="d-inline-block align-text-center"
              />
              Revendedora de Automóveis
            </a>
          </div>
        </nav>
        <div className="container mt-2">
          <h2 className="d-flex justify-content-between">
            <span>Listagem dos Carros</span>
            <button className="btn btn-primary px-3" onClick={showStatistic}>
              Estatísticas
            </button>
            <button className="btn btn-danger px-3" onClick={onOpenModal}>
              Adicionar
            </button>
          </h2>
          {/*CAMPO DE BUSCA/FILTRO*/}
          <div className="container-fluid">
            <div className="d-flex">
              <h4 className="me-3">Procurar Carro: </h4>
              <input
                type="text"
                placeholder="Digite aqui a marca ou modelo do veículo"
                value={busca}
                onChange={(ev) => setBusca(ev.target.value)}
                className="w-50"
              />
            </div>
          </div>
          {/*fim campo de busca/filtro*/}
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Modelo</th>
                <th>Marca</th>
                <th>Ano</th>
                <th>Preço</th>
                <th>Foto</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {busca ? (
                listaCarrosBuscados.length ? (
                  listaCarrosBuscados
                ) : (
                  <h3>Nenhum resultado para sua pesquisa</h3>
                )
              ) : (
                listaCarros
              )}
            </tbody>
          </table>
        </div>
        <Modal open={open} onClose={onCloseModal} center>
          <div className="card">
            <div className="card-header">Inclusão de Carro no Sistema</div>
            <form className="card-body" onSubmit={handleSubmit(gravaDados)}>
              <h5 className="card-title">Informe os Detalhes do Carro</h5>
              <div className="mb-3">
                <label htmlFor="modelo" className="form-label">
                  Modelo:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="modelo"
                  required
                  {...register("modelo")}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="marca" className="form-label">
                  Marca:
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="marca"
                  required
                  {...register("marca")}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="ano" className="form-label">
                  Ano:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="marca"
                  required
                  {...register("ano")}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="preco" className="form-label">
                  Preço:
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="preco"
                  required
                  step="0.01"
                  min="0.0"
                  {...register("preco")}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="foto" className="form-label">
                  URL da Foto:
                </label>
                <input
                  type="url"
                  className="form-control"
                  rows="3"
                  required
                  {...register("foto")}
                />
              </div>
              <input
                type="submit"
                value="Enviar"
                className="btn btn-primary px-5"
              />
            </form>
            {watch("foto") && (
              <img
                src={watch("foto")}
                className="rounded mx-auto d-block"
                width={240}
                height={200}
              />
            )}
          </div>
        </Modal>
        <Modal open={openEdit} onClose={() => setOpenEdit(false)} center>
          <div className="card">
            <img
              src={modalFoto}
              className="card-img-top"
              width={400}
              height={320}
            />
            <div className="card-body">
              <h5>{modalModelo}</h5>
              <p>Marca: {modalMarca}</p>
              <p>Ano: {modalAno}</p>
              <p>
                Preço: R${" "}
                {Number(modalPreco).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>
          </div>
        </Modal>
        <Modal open={openStats} onClose={() => setOpenStats(false)} center>
          <div className="card">
            {carros.length > 0 ? (
              <div>
                <h3>Número total de veículos: {totalCars}</h3>
                <h5>
                  Média de valor dos veículos: R${" "}
                  {Number(media).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </h5>
                <h6>
                  <u>Carro de maior valor</u>
                </h6>
                <h6>Modelo: {modeloTop}</h6>
                <h6>Marca: {marcaTop}</h6>
                <h6>Ano: {anoTop}</h6>
                <h6>
                  Preço: R${" "}
                  {Number(precoTop).toLocaleString("pt-br", {
                    minimumFractionDigits: 2,
                  })}
                </h6>
                <img width={200} src={fotoTop} />
              </div>
            ) : (
              <div className="w-200 p-5">
                <h3>Adicione ao menos um Carro para ter as estatísticas.</h3>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </>
  );
}

export default App;
