Cypress.on("uncaught:exception", (err, runnable) => {

  return false;
});

  describe("Pesquisa de Processos - Filtros", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.get("section.pesquisa-processo").should("exist");
    });

    it("@fumaca - Buscar sem preencher filtros", () => {
      cy.buscar();
      cy.location("pathname").should("include", "/processos");
    });

it("@basico - Buscar por Objeto", () => {
  cy.visit(
    "https://www.portaldecompraspublicas.com.br/processos?objeto=1&municipio=0"
  );

  cy.url().should("include", "objeto=1");

  cy.get("body").should("contain", "Processos");
  cy.get("body").should("contain", "Resultados para o termo");
});


  it("@basico - Buscar por Processo", () => {
    cy.get("#processo").type("123");
    cy.buscar();
    cy.location("pathname").should("include", "/processos");
    cy.get("body").should("contain", "Processo");
});

it("@basico - Buscar por Órgão", () => {
  cy.visit(
    "https://www.portaldecompraspublicas.com.br/processos?orgao=1&municipio=0"
  );

  cy.url().should("include", "orgao=1");
cy.get("body").should("contain", "Processos");
cy.get("body").should("contain", "Resultados para o termo");
});

  it("@toggle - Exibir/ocultar busca avançada", () => {
    cy.abrirBuscaAvancada();
    cy.fecharBuscaAvancada();
  });

it("@avancado - Todos os Status (URL)", () => {
  const statusOptions = [
    { label: "Em Andamento", value: "2" },
    { label: "Em Republicação", value: "25" },
    { label: "Finalizado", value: "3" },
    { label: "Iminência de deserto", value: "4" },
    { label: "Recebendo Propostas", value: "1" },
  ];

  statusOptions.forEach((status) => {
    const url = `https://www.portaldecompraspublicas.com.br/processos?codigoStatus=${status.value}&municipio=0`;

    cy.visit(url);
    cy.url().should("include", `codigoStatus=${status.value}`);
    cy.contains("Processos").should("be.visible");

    cy.get("body").should("not.contain", "Erro interno");

    cy.log(`✅ Status validado: ${status.label}`);
  });
});



it("@geo - UF e Capitais - Classe de Equivalência", () => {
  const localidades = [
    { uf: "RJ", ufCode: "100133", municipio: "100133068" },
    { uf: "AM", ufCode: "100113", municipio: "100113038" },
    { uf: "BA", ufCode: "100129", municipio: "100129335" },
    { uf: "RS", ufCode: "100143", municipio: "100143304" },
    { uf: "DF", ufCode: "100153", municipio: "100153001" },
  ];

  localidades.forEach(({ uf, ufCode, municipio, cidade }) => {
    const url = `https://www.portaldecompraspublicas.com.br/processos?uf=${ufCode}&municipio=${municipio}`;

    cy.visit(url);

    // validação da UF usada no filtro
    cy.url().should("include", `uf=${ufCode}`);

    // validação do município (capital)
    cy.url().should("include", `municipio=${municipio}`);

    // validação de que a página carregou corretamente
    cy.contains("Processos").should("be.visible");

    cy.log(`✅ Validado: UF ${uf} | Município (capital): ${cidade}`);
  });
});


it("@combinacao - Filtros + Data (produção)", () => {
  const filtros = {
    codigoModalidade: 6,                 
    codigoRealizacao: 1,                 
    codigoJulgamento: 7,                 
    codigoStatus: 3,                     
    tipoData: 1,
    // datas são removidas/normalizadas pelo portal → não validar!
    dataInicial: "2025-07-01T03:00:00.000Z",
    dataFinal: "2025-11-11T03:00:00.000Z",
    uf: 100133,                          
    municipio: 100133062,                
  };

  const url =
    "https://www.portaldecompraspublicas.com.br/processos?" +
    new URLSearchParams(filtros).toString();

  cy.visit(url);

  // 1. Checa rota
  cy.location("pathname").should("include", "/processos");

  // 2. Valida APENAS os filtros que o portal realmente mantém
  const filtrosQuePersistem = [
    "codigoModalidade",
    "codigoRealizacao",
    "codigoJulgamento",
    "codigoStatus",
    "uf",
    "municipio"
  ];

  filtrosQuePersistem.forEach((key) => {
    cy.url().should("include", `${key}=${filtros[key]}`);
  });

  // Não validar datas: o portal reescreve ou remove

  // 3. Página renderizada
  cy.contains("Processos").should("be.visible");

  // 4. Sem erro interno
  cy.get("body").should("not.contain", "Erro interno");

  cy.log("✅ Filtros múltiplos com período validados (datas ignoradas pelo sistema).");
});


it("@periodo - Filtrar período via URL", () => {
  cy.visit(
    "https://www.portaldecompraspublicas.com.br/processos?" +
    "tipoData=1&dataInicial=2025-09-01T03:00:00.000Z&dataFinal=2025-11-30T03:00:00.000Z&municipio=0"
  );

  cy.location("pathname").should("include", "/processos");
  cy.contains("Processos").should("be.visible");
});
});
