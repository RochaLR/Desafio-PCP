// Helpers para a tela de pesquisa
Cypress.Commands.add("abrirBuscaAvancada", () => {
  cy.contains("a.busca-av", "Busca avançada").click();
  cy.get(".busca-av-block").should("be.visible");
});

Cypress.Commands.add("fecharBuscaAvancada", () => {
  cy.contains("a.busca-av", "Busca avançada").click();
  cy.get(".busca-av-block").should("not.be.visible");
});

Cypress.Commands.add("buscar", () => {
  cy.get("a.btn-pesquisa-p.second").contains("BUSCAR").click();
});
