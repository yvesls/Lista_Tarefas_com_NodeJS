const load = document.getElementById("load");
const table = document.getElementById("table");
const tbody = document.getElementById("tbody");
const btnCriar = document.getElementById("btnSalvarCriacao");
const btnAlterar = document.getElementById("btnAlterar");
const btnExcluir = document.getElementById("btnExcluirSim");
const btnBusca = document.getElementById("buscar");
const campoBusca = document.getElementById("campoBusca");
const nenhumRegistro = document.getElementById("nenhumRegistro");
const iconTaskCon = '<i class="fa-sharp fa-solid fa-circle-check fa-1x text-success" aria-hidden="true"></i>';
const iconTaskNoCon = '<i class="fa-solid fa-circle-xmark fa-1x text-danger"></i>';
let listTarefas = [];

const carregaTodasTarefas = async () => {
    table.style.display = "none";
    load.innerHTML = "<div class='spinner-grow text-atualizar m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    try {
        const response = await fetch("/task");
        const json = await response.json();
        document.getElementById("previsao").value = definirDefaultData();
        campoBusca.value = definirDefaultData();
        if(response.status === 200) {
            if(json.length === 0) {
                nenhumRegistro.innerHTML = "<h2>Nenhum registro encontrado.</h2>";
            }else {
                abstraiResultado(json);
                nenhumRegistro.innerHTML = "";
                table.style.display = "block";
            }
        } else if(response.status === 404) {
            table.style.display = "none";
            nenhumRegistro.innerHTML = "<h2>Página não encontrada.</h2>";
        }else {
            $("#modalErro").show();
        }
    } catch (error) {
        nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
        console.log(error);
    }finally {
        load.innerHTML = ''
    }
}

carregaTodasTarefas();

btnCriar.addEventListener("click", async () => {
    load.innerHTML = "<div class='spinner-grow text-atualizar m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    table.style.display = "none";
    const descricao = document.getElementById("descricao").value;
    const previsao = converterData(document.getElementById("previsao").value);
    let concluida = document.getElementById("concluidaTarefa").checked;
    const dataCriacao = new Date();
    if (descricao.trim() === "" || previsao.trim() === "") {
        console.log("Campo descrição ou data de conclusão vazio");
        return; 
    }
    const formData = { concluida: concluida, data: dataCriacao, previsao: previsao, titulo: descricao };
    try {
        const response = await fetch("/task", {
            method: "POST",
            headers: {
                'Content-type': 'application/json; charset=utf-8', //x-www-form-urlencoded
            },
            body: JSON.stringify(formData),
        })
        const json = await response.json(); 
        if(response.status === 200) {
            $('#modalSucesso').modal('show');
            carregaTodasTarefas();
        } else {
            $('#modalErro').modal('show');
        }
    } catch (error) {
        nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
        console.log(error);
    }finally {
        load.innerHTML = ''
    }
});

btnAlterar.addEventListener("click", async () => {
    load.innerHTML = "<div class='spinner-grow text-atualizar m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    table.style.display = "none";
    const descricao = document.getElementById("descricaoAlterar").value;
    const previsao = converterData(document.getElementById("previsaoAlterar").value);
    let concluida = document.getElementById("concluidaTarefaAlterar").checked;
    const id = document.getElementById("idAlterar").innerHTML;

    if (descricao.trim() === "" || previsao.trim() === "") {
        console.log("Campo descrição ou data de conclusão vazio");
        load.innerHTML = ''
        return; 
    }
    const formData = { concluida: concluida, previsao: previsao, titulo: descricao };
    try {
        const response = await fetch(`/task/${id}`, {
            method: "PUT",
            headers: {
                'Content-type': 'application/json; charset=utf-8', //x-www-form-urlencoded
            },
            body: JSON.stringify(formData),
        })
        const json = await response.json(); 
        if(response.status === 200) {
            $('#modalSucesso').modal('show');
            carregaTodasTarefas();
        } else {
            $('#modalErro').modal('show');
        }
    } catch (error) {
        nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
        console.log(error);
    }finally {
        load.innerHTML = ''
    }
});

function addEventoAlterar(list) {
    for(let i = 0; i < list.length; i++){
        $(`#btnAlterar${parseInt(i)+1}`).click( async function() {
            let id = $(`#btnAlterar${parseInt(i)+1}`).children(':first-child').attr('id');
            document.getElementById("idAlterar").innerHTML = id;
            try {
                const response = await fetch(`/task/${id}`);
                const json = await response.json(); 
                if(response.status === 200) {
                    document.getElementById("descricaoAlterar").value = json.titulo;
                    dataPrevisao = converterData(json.previsao);
                    document.getElementById('previsaoAlterar').value = dataPrevisao;
                    document.getElementById("concluidaTarefaAlterar").checked = json.concluida;
                    $('#alterarTarefa').modal('show');
                } else {
                  $('#modalErro').modal('show');
                }
            } catch (error) {
                nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
                console.log(error);
            }
        });
    }
}  

btnExcluir.addEventListener("click", async () => {
    load.innerHTML = "<div class='spinner-grow text-atualizar m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    table.style.display = "none";
    const id = document.getElementById("idAlterar").innerHTML;
    try {
        const response = await fetch(`/task/${id}`, {
            method: "DELETE"
        })
        const json = await response.json(); 
        if(response.status === 200) {
            $('#modalSucesso').modal('show');
            carregaTodasTarefas();
        } else {
            $('#modalErro').modal('show');
        }
    } catch (error) {
        nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
        console.log(error);
    }finally {
        load.innerHTML = ''
    }
});

function abstraiResultado(json) {
    tbody.innerHTML = ""
    listTarefas = [];
    for(let i = 0; i < json.length; i++) {
        listTarefas[i] = json[i];
        criaLinhaColunaTabela(json[i], i);
    }
    addEventoAlterar(listTarefas);
}

function criaLinhaColunaTabela(json, i) { 
    const tr = document.createElement("TR");
    const th = document.createElement("TH");
    const td1 = document.createElement("TD");
    const td2 = document.createElement("TD");
    const td3 = document.createElement("TD");
    const td4 = document.createElement("TD");
    const td5 = document.createElement("TD");
    tbody.append(tr);
    th.innerHTML = `${i+1}`;
    td1.innerHTML = `${json.titulo}`;
    let dataFormatada = converterData(json.data.substr(0, 10));
    td2.innerHTML = `${dataFormatada}`;
    td3.innerHTML = `${json.previsao}`;
    if(json.concluida === true) {
        td4.innerHTML = `${iconTaskCon}`;
    }else {
        td4.innerHTML = `${iconTaskNoCon}`;
    }
    td5.innerHTML = `<button id="btnAlterar`+ (parseInt(i)+1) +`" class="btn btn-personalizado"><i id="`+ json._id +`" class="fa-solid fa-pen fa-1x text-atualizar"></i></button>`;
    tr.append(th);
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
}

function converterData(data) {
    var partes = data.split("-");
    var novaData = partes[2] + "-" + partes[1] + "-" + partes[0];
    return novaData;
}

function desconverterData(data) {
    var partes = data.split('/');
    var dataInvertida = partes[2] + '-' + partes[1] + '-' + partes[0];
    return dataInvertida;
}

function definirDefaultData() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');
    const dataFormatada = `${ano}-${mes}-${dia}`;
    return dataFormatada;
}

btnBusca.addEventListener("click", async () => {
    load.innerHTML = "<div class='spinner-grow text-atualizar m-auto' role='status'><span class='visually-hidden'>Carregando...</span></div>";
    table.style.display = "none";
    if(campoBusca.value != '') {
        const formData = { previsao: converterData(campoBusca.value) };
        try {
            const response = await fetch(`/task/previsao`, {
                method: "POST",
                headers: {
                    'Content-type': 'application/json; charset=utf-8', //x-www-form-urlencoded
                },
                body: JSON.stringify(formData),
            })
            const json = await response.json(); 
            if(response.status === 200) {
                if(json.length === 0) {
                    nenhumRegistro.innerHTML = "<h2>Nenhum registro encontrado.</h2>";
                }else {
                    abstraiResultado(json);
                    nenhumRegistro.innerHTML = "";
                    table.style.display = "block";
                }
            } else if(response.status === 404) {
                table.style.display = "none";
                nenhumRegistro.innerHTML = "<h2>Página não encontrada.</h2>";
            } else {
                $("#modalErro").show();
            }
        } catch (error) {
            nenhumRegistro.innerHTML = "<h2>Erro de conexão com o banco de dados. Tente novamente mais tarde.</h2>";
            console.log(error);
        }finally {
            load.innerHTML = ''
        }
    }else {
        carregaTodasTarefas();
    } 
}); 

const conOption = document.getElementById("listarConcluidas");
const noConOption = document.getElementById("listarNoConcluidas");

conOption.addEventListener("click", () => {
    filtraListaTarefas(conOption.innerHTML);
});

noConOption.addEventListener("click", () => {
    filtraListaTarefas(noConOption.innerHTML);
});

function filtraListaTarefas(filtro){
    tbody.innerHTML = "";
    let list = [], j = 0;
    if(filtro === "Concluídas") {
        for(let i = 0; i < listTarefas.length; i++) {
            if(listTarefas[i].concluida === true){
                list[j] = listTarefas[i];
                criaLinhaColunaTabela(listTarefas[i], i);
                j++;
            }
        }
        if (list.length === 0) {
            table.style.display = "none";
            nenhumRegistro.innerHTML = "<h2>Nenhum registro encontrado.</h2>";
        } else {
            addEventoAlterar(list);
            table.style.display = "block";
            nenhumRegistro.innerHTML = "";
        }
        
    } else if(filtro === "Não concluídas") {
        for(let i = 0; i < listTarefas.length; i++) {
            if(listTarefas[i].concluida === false){
                list[j] = listTarefas[i];
                criaLinhaColunaTabela(listTarefas[i], i);
                j++;
            }
        }
        if (list.length === 0) {
            table.style.display = "none";
            nenhumRegistro.innerHTML = "<h2>Nenhum registro encontrado.</h2>";
        } else {
            addEventoAlterar(list);
            table.style.display = "block";
            nenhumRegistro.innerHTML = "";
        }
    }
}