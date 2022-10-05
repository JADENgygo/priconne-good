/// <reference types="cypress" />

context("ui test", () => {
  beforeEach(() => {
    fetch("http://localhost:9099/emulator/v1/projects/priconne-good/accounts", {
      method: "DELETE",
    });
    cy.visit("localhost:3000");
  });

  it("ui test", () => {
    cy.get("#login").click();
    cy.get("#twitterLogin").click();
    cy.get("button").first().click(); // add new accountボタン
    cy.get("#autogen-button").click();
    cy.get("#sign-in").click();

    cy.get("#memberName0").type("test name0");
    cy.get("#memberName0").should("have.value", "test name0");

    cy.get("#memberName28").type("test name28");
    cy.get("#memberName28").should("have.value", "test name28");

    cy.get("#minusButton0").click();
    cy.get("#count0").should("have.text", "0");

    cy.get("#minusButton28").click();
    cy.get("#count28").should("have.text", "0");

    cy.get("#plusButton0").click();
    cy.get("#plusButton0").click();
    cy.get("#minusButton0").click();
    cy.get("#memberName0").should("have.value", "test name0");
    cy.get("#count0").should("have.text", "1");

    cy.get("#plusButton28").click();
    cy.get("#plusButton28").click();
    cy.get("#minusButton28").click();
    cy.get("#memberName28").should("have.value", "test name28");
    cy.get("#count28").should("have.text", "1");

    cy.get("#confirmResetButton0").click();
    cy.get("#cancelResetButton0").click();
    cy.get("#confirmResetButton0").click();
    cy.get("#resetButton0").click();
    cy.get("#count0").should("have.text", "0");

    cy.get("#confirmResetButton28").click();
    cy.get("#cancelResetButton28").click();
    cy.get("#confirmResetButton28").click();
    cy.get("#resetButton28").click();
    cy.get("#count28").should("have.text", "0");

    cy.get("#plusButton0").click();
    cy.get("#plusButton28").click();
    cy.get("#confirmAllResetButton").click();
    cy.get("#cancelAllResetButton").click();
    cy.get("#confirmAllResetButton").click();
    cy.get("#allResetButton").click();
    cy.get("#count0").should("have.text", "0");
    cy.get("#count28").should("have.text", "0");

    cy.get("#plusButton0").click();
    cy.get("#plusButton28").click();
    cy.get("#logout").click();
    cy.get("#login").click();
    cy.get("#twitterLogin").click();
    cy.get("li").first().click(); // ユーザー選択で最初のユーザーを選択
    cy.get("#memberName0").should("have.value", "test name0");
    cy.get("#memberName28").should("have.value", "test name28");
    cy.get("#count0").should("have.text", "1");
    cy.get("#count28").should("have.text", "1");

    cy.get("#delete").click();
    cy.get("#confirm").type("プリコネ");
    cy.get("#deleteButton").click();
    cy.url().should("eq", "http://localhost:3000/?theme=light");
    cy.get("#login").should("exist");
  });
});
