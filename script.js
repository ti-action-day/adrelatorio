const WEBHOOK_URL = "https://hook.us1.make.com/ujqg95vfaj5a2ebdbicrydh12erc1lhu";

const form = document.getElementById("reportForm");
const statusMessage = document.getElementById("statusMessage");
const submitButton = form.querySelector("button");

document.getElementById("data").valueAsDate = new Date();

const cliente = getQueryParam("c") || "sem_cliente";

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const dados = {
    cliente: cliente,
    data: getValue("data"),
    quantidade_recebida: getNumber("recebida"),
    quantidade_cadastrada_dh: getNumber("cadastrada"),
    atenderam_responderam_dia: getNumber("responderam"),
    agendamentos_dia: getNumber("agendamentos"),
    resgates_1: getNumber("resgates1"),
    resgates_2: getNumber("resgates2"),
    leads_abaixo_40_anos: getNumber("abaixo40"),
    fora_da_localizacao: getNumber("foraLocalizacao"),
    observacoes: getValue("observacoes"),
    origem: "Relatório Diário Action Day Digital",
    enviado_em: new Date().toISOString()
  };

  salvarLocalmente(dados);

  try {
    setLoading(true);
    await enviarWebhook(dados);

    showStatus("Relatório enviado com sucesso.", "success");

    form.reset();
    document.getElementById("data").valueAsDate = new Date();
  } catch (error) {
    console.error(error);
    showStatus("Erro ao enviar. Salvo localmente.", "error");
  } finally {
    setLoading(false);
  }
});

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

function getValue(id) {
  return document.getElementById(id).value.trim();
}

function getNumber(id) {
  return Number(document.getElementById(id).value || 0);
}

function salvarLocalmente(dados) {
  const registros = JSON.parse(localStorage.getItem("relatorios")) || [];
  registros.push(dados);
  localStorage.setItem("relatorios", JSON.stringify(registros));
}

async function enviarWebhook(dados) {
  const formData = new FormData();

  Object.keys(dados).forEach((campo) => {
    formData.append(campo, dados[campo]);
  });

  await fetch(WEBHOOK_URL, {
    method: "POST",
    mode: "no-cors",
    body: formData
  });
}

function showStatus(message, type) {
  statusMessage.innerText = message;
  statusMessage.className = type;

  setTimeout(() => {
    statusMessage.innerText = "";
    statusMessage.className = "";
  }, 4000);
}

function setLoading(state) {
  submitButton.disabled = state;
  submitButton.innerText = state ? "Enviando..." : "Enviar relatório";
}