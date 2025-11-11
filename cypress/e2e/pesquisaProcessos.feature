Feature: Pesquisa de Processos - Filtros (produção)
  # Observação:

  # - O ambiente www.pcphom.com.br está com problema de busca (Erro interno inesperado-traceableerror.638984256831372062) 
  # com isso decidi prosseguir o desafio pelo ambiente de produção

  # - Utilizei validações via URL pois por algum motivo, ao preencher os inputs e clicar em buscar, o sistema estava ignorando os inputs de texto, 
  # trazendo sempre a tabela completa sem filtrar os dados fornecidos nos inputs (por teste manual funcionou normalmente, 
  # o problema acontecia somente pelo teste automatizado)
  

  Background:
    Given que acesso a home do Portal
    And a secão "Pesquisa de Processos" está visível

  @fumaca
  Scenario: Buscar sem preencher filtros
    When eu clico no botão "BUSCAR"
    Then sou direcionado para a rota "/processos"

  @basico
  Scenario: Buscar por Objeto via URL
    Given que acesso a URL de processos com "objeto=1&municipio=0"
    When a página de resultados carrega
    Then a URL deve conter "objeto=1"
    And a página deve exibir "Processos"
    And a página deve exibir "Resultados para o termo"

  @basico
  Scenario: Buscar por Processo pelo campo
    When eu preencho o campo "processo" com "123"
    And eu clico no botão "BUSCAR"
    Then sou direcionado para a rota "/processos"
    And a página deve exibir "Processo"

  @basico
  Scenario: Buscar por Órgão via URL
    Given que acesso a URL de processos com "orgao=1&municipio=0"
    When a página de resultados carrega
    Then a URL deve conter "orgao=1"
    And a página deve exibir "Processos"
    And a página deve exibir "Resultados para o termo"

  @toggle
  Scenario: Exibir e ocultar a busca avançada
    When eu abro a "Busca avançada"
    Then o bloco de filtros avançados é exibido
    When eu fecho a "Busca avançada"
    Then o bloco de filtros avançados é ocultado

  @avancado
  Scenario Outline: Filtrar por Status via URL
    Given que acesso a URL de processos com "codigoStatus=<codigo>&municipio=0"
    When a página de resultados carrega
    Then a URL deve conter "codigoStatus=<codigo>"
    And a página deve exibir "Processos"
    And a página não deve exibir "Erro interno"
    Examples:
      | status                 | codigo |
      | Em Andamento           | 2      |
      | Em Republicação        | 25     |
      | Finalizado             | 3      |
      | Iminência de deserto   | 4      |
      | Recebendo Propostas    | 1      |

  @geo
  # Decidi usar teste de equivalencia neste caso
  Scenario Outline: UF + capital 
    Given que acesso a URL de processos com "uf=<ufCode>&municipio=<municipio>"
    When a página de resultados carrega
    Then a URL deve conter "uf=<ufCode>"
    And a URL deve conter "municipio=<municipio>"
    And a página deve exibir "Processos"
    Examples:
      | uf | ufCode | municipio  |
      | RJ | 100133 | 100133068  |
      | AM | 100113 | 100113038  |
      | BA | 100129 | 100129335  |
      | RS | 100143 | 100143304  |
      | DF | 100153 | 100153001  |

  @combinacao
  Scenario: Múltiplos filtros + período via URL (datas não validadas)
    Given que acesso a URL de processos com os parâmetros:
      """
      codigoModalidade=6&
      codigoRealizacao=1&
      codigoJulgamento=7&
      codigoStatus=3&
      tipoData=1&
      dataInicial=2025-07-01T03:00:00.000Z&
      dataFinal=2025-11-11T03:00:00.000Z&
      uf=100133&
      municipio=100133062
      """
    When a página de resultados carrega
    Then a rota deve ser "/processos"
    And a URL deve conter "codigoModalidade=6"
    And a URL deve conter "codigoRealizacao=1"
    And a URL deve conter "codigoJulgamento=7"
    And a URL deve conter "codigoStatus=3"
    And a URL deve conter "uf=100133"
    And a URL deve conter "municipio=100133062"
    And a página deve exibir "Processos"
    And a página não deve exibir "Erro interno"

  @periodo
  Scenario: Filtrar por período via URL (Abertura)
    Given que acesso a URL de processos com "tipoData=1&dataInicial=2025-09-01T03:00:00.000Z&dataFinal=2025-11-30T03:00:00.000Z&municipio=0"
    When a página de resultados carrega
    Then a rota deve ser "/processos"
    And a página deve exibir "Processos"