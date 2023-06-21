/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(() => {
        cy.visit('./src/index.html');

    }) 

    it('verifica o título da aplicação', function() {
        
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT');
    }),

    it('preenche os campos obrigatórios e envia o formulário', function() {
        const textLong = 'TestetesteTestetesteTestetesteTestetesteTestetesteTestetesteTestetesteTesteteste';
        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('lucasjogabonito@hotmail.com')
        cy.get('#open-text-area').type(textLong, { delay: 0 })
        cy.contains('button[type="submit"]', 'Enviar').click()
        cy.get('.success').should('be.visible')
    }),

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function() {
        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('lucas.oliveira')
        cy.get('#open-text-area').type('Teste')
        cy.contains('button[type="submit"]', 'Enviar').click()
        cy.get('.error').should('be.visible')
        
    }),

    it('campo telefone continua vazio quando preenchido com valor não numérico', function() {
        cy.get('#phone').type('colecole').should('be.empty')
    }),

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function() {
        cy.get('#firstName').type('Lucas')
        cy.get('#lastName').type('Oliveira')
        cy.get('#email').type('lucas.oliveira@teste.com')
        cy.get('#open-text-area').type('Teste')
        cy.get('#phone-checkbox').check()
        cy.contains('button[type="submit"]', 'Enviar').click()
        cy.get('.error').should('be.visible')
    }),

    it('preenche e limpa os campos nome, sobrenome, email e telefone', () => {
        cy.get('#firstName').type('Lucas').should('have.value', 'Lucas')
        .clear().should('have.value', '')
        cy.get('#lastName').type('Oliveira').should('have.value', 'Oliveira')
        .clear().should('have.value', '')
        cy.get('#email').type('lucas.oliveira').should('have.value', 'lucas.oliveira')
        .clear().should('have.value', '')
        cy.get('#phone').type('313131').should('have.value', '313131')
        .clear().should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', () => {
        cy.contains('button[type="submit"]', 'Enviar').click()
        cy.get('.error').should('be.visible')
    }),

    it('envia o formuário com sucesso usando um comando customizado', () => {
        cy.fillMandatoryFieldsAndSubmit()
        cy.get('.success').should('be.visible')
    }),

    it('seleciona um produto (YouTube) por seu texto', () => {
        cy.get('#product').select('YouTube').should('have.value', 'youtube')
    }),

    it('seleciona um produto (Mentoria) por seu valor (value)', () => {
        cy.get('#product').select('mentoria').should('have.value', 'mentoria')
    }),

    it('seleciona um produto (Blog) por seu índice', () => {
        cy.get('#product').select(1).should('have.value', 'blog')
    }),

    it('marca o tipo de atendimento "Feedback"', () => {
        cy.get('input[type="radio"][value="feedback"]')
        .check()
        .should('have.value', 'feedback')
    }),

    it('marca cada tipo de atendimento', () => {
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(($item) => {
            cy.wrap($item).check()
            cy.wrap($item).should('be.checked')
            
        })
    })
   
  })

  describe('Marcar e desmarcar elementos do tipo checkbox', function (){
    beforeEach(() => {
        cy.visit('./src/index.html');

    }) 

    it('marca ambos checkboxes, depois desmarca o último', ()=> {
        cy.get('#check input[type="checkbox"]')
        .check()
        .each(($checkbox, index) =>{
            cy.wrap($checkbox).should('be.checked')

            if (index === 1){
                cy.wrap($checkbox).uncheck().should('not.be.checked')
            }
        })

        // Outra forma de testar
        //cy.get('#check input[type="checkbox"]')
        //.as('checkboxes')
        //.check()
        //
        //cy.get('@checkboxes')
        //.each(($checkbox) =>{
        //    cy.wrap($checkbox).should('be.checked')
        //})

        //cy.get('@checkboxes').last().uncheck().should('not.be.checked')
    })
    
  })

  describe('Upload de arquivos', function() {
    beforeEach(()=> {
        cy.visit('./src/index.html');
    })

    it('seleciona um arquivo da pasta fixtures', () => {
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('cypress/fixtures/example.json')
        .then((input) => {
            expect(input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', () =>{
        cy.get('input[type="file"]')
        .selectFile('cypress/fixtures/example.json', { action: 'drag-drop'})
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', () => {
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
        .selectFile('@sampleFile')
        .should(($input) =>{
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })
  })

  describe('Links que abrem em outra aba do navegador', function() {
    this.beforeEach(() => {
        cy.visit('./src/index.html')
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', () => {
        cy.get('#privacy a').should('have.attr', 'target', '_blank')
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', () => {
        cy.get('#privacy a')
        .invoke('removeAttr', 'target')
        .click()
        

        cy.contains('Talking About Testing').should('be.visible')
    })

    it('testa a página da política de privacidade de forma independente', () => {
        cy.visit('./src/privacy.html')
        cy.contains('Talking About Testing').should('be.visible')
    })
})

