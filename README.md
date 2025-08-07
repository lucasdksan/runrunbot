# Runrun Bot

Bot de discord que faz integração ao runrun.it

![Banner Bot Runrunit](/github/dog-icon.jpg)

## Descrição

Este projeto consiste no desenvolvimento de um bot inteligente para auxiliar na gestão de empresas, integrando-se à plataforma Runrun.it. O bot é capaz de interagir com o sistema para automatizar tarefas, acompanhar atividades e gerar contações automáticas com o apoio de inteligência artificial, utilizando como base as descrições das tarefas cadastradas. Além disso, o sistema possui um MCP que faz integração ao Runrun.it.

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

* O MCP possui duas ferramentas:
  * get_description: Responsável por obter a descrição da tarefa a partir do ID da tarefa publicado no chat.
  * send_comment: Envia um comentário sobre a tarefa. Requer o ID da tarefa e o comentário.

## Edit Type

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

## Technologies

- **Git**: 2.46.1
- **NVM**: 1.1.12
- **NodeJS**: 20.17.0
- **NestJs**: 11.0.7