# Runrun Bot

Bot de discord que faz integração ao runrun.it

![Banner Bot Runrunit](/github/dog-icon.jpg)

## Descrição

Este projeto consiste no desenvolvimento de um bot inteligente para auxiliar na gestão de empresas, integrando-se à plataforma Runrun.it. O bot é capaz de interagir com o sistema para automatizar tarefas, acompanhar atividades e gerar contações automáticas com o apoio de inteligência artificial, utilizando como base as descrições das tarefas cadastradas. Além disso, o sistema possui um MCP que faz integração ao Runrun.it.

## Iniciar o projeto

Clone the project

```bash
  git clone 'link do repositório'
```

Install dependencies

```bash
  npm i
```

Start LocalHost

```bash
  npm run start:dev
```

Start build

```bash
  npm run build
```

```bash
  git checkout -b 'edit type/taskName'
```

All new commit

```bash
  git commit -m 'edit type - commitTitle'
```

## MCP

```json
"AG.N1 MCP":{
  "type": "sse",
  "url": "http://localhost:3000/sse"
}
```

> Insira esta configuração no seu arquivo mcp.json para acessar o mcp.

## Funcionalidades

> O projeto é dividido em três entidades principais: Lembretes, responsável por registrar lembretes. Tarefas, responsável por gerenciar, atualizar, iniciar, pausar e assim por diante, relacionados às tarefas. Usuários, responsável por registrar usuários e conectar o usuário do Discord ao Runrunit. Observação: shared contém apenas funcionalidades que são compartilhadas entre as outra entidades principais.

* **Reminders**
  - register_reminder: Responsavel por registrar um lembrete ao usuário do discord.
  - list_reminder: Lista todos os lembres do usuário.
  - schedules: Valida todos os lembretes, valida a data, se a data corresponder à data atual, envia a mensagem ao usuário.

* **Tasks**
  - Primeira messageCreate: Responsável por analisar o canal principal. Se o usuário enviar "Bom dia", o bot envia a lista de tarefas do mesmo runrunit.
  - Segunda messageCreate: Responsável por analisar o canal principal. Se o usuário enviar "Fechando", o bot pausa todas as tarefas em andamento do usuário.
  - play_task: Inicia a tarefa que o usuário colocar o codigo.
  - pause_task: Pausa tarefa que o usuário colocar o codigo.
  - estimate: Estima a carga de trabalho de uma tarefa com base em uma descrição de até 4.000 caracteres.
  - estimate_task: Estima a carga de trabalho de uma tarefa apenas colocando o id da tarefa.
  - get_description **(MCP)**: Obtém a descrição da tarefa e a envia ao agente de IA.
  - send_comment **(MCP)**: Esta ferramenta permite que o agente de IA envie um comentário sobre a tarefa. 
  - play_task **(MCP)**: Esta ferramenta permite que o agente de IA inicia a tarefa.
  - pause_task **(MCP)**: Esta ferramenta permite que o agente de IA pausa a tarefa.

* **Users**
  - register: Responsável por registrar um usuário do discord no sistema.

## Tipos de edição

- **test**: indica qualquer tipo de criação ou alteração de códigos de teste. Exemplo: Criação de testes unitários.
- **feat**: indica o desenvolvimento de uma nova feature ao projeto. Exemplo: Acréscimo de um serviço, funcionalidade, endpoint, etc.
- **refactor**: usado quando houver uma refatoração de código que não tenha qualquer tipo de impacto na lógica/regras de negócio do sistema. Exemplo: Mudanças de código após um code review
- **style**: empregado quando há mudanças de formatação e estilo do código que não alteram o sistema de nenhuma forma.
Exemplo: Mudar o style-guide, mudar de convenção lint, arrumar indentações, remover espaços em brancos, remover comentários, etc..
- **fix**: utilizado quando há correção de erros que estão gerando bugs no sistema.
Exemplo: Aplicar tratativa para uma função que não está tendo o comportamento esperado e retornando erro.
- **chore**: indica mudanças no projeto que não afetem o sistema ou arquivos de testes. São mudanças de desenvolvimento.
Exemplo: Mudar regras do eslint, adicionar prettier, adicionar mais extensões de arquivos ao .gitignore
- **docs**: usado quando há mudanças na documentação do projeto.
Exemplo: adicionar informações na documentação da API, mudar o README, etc.
- **build**: utilizada para indicar mudanças que afetam o processo de build do projeto ou dependências externas.
Exemplo: Gulp, adicionar/remover dependências do npm, etc.
- **perf**: indica uma alteração que melhorou a performance do sistema.
Exemplo: alterar ForEach por while, melhorar a query ao banco, etc.
- **ci**: utilizada para mudanças nos arquivos de configuração de CI.
Exemplo: Circle, Travis, BrowserStack, etc.
- **revert**: indica a reverão de um commit anterior.

## Tecnologias

- **Git**: 2.46.1
- **NVM**: 1.1.12
- **NodeJS**: 20.17.0
- **NestJs**: 11.0.7