# EcoBrain - Sistema de Gerenciamento Financeiro Pessoal

EcoBrain é uma aplicação completa para gerenciamento financeiro pessoal focada em proporcionar visibilidade clara dos gastos, orçamento e investimentos. Este projeto foi desenvolvido com React e Express, mas está estruturado para facilitar a migração do backend para Ruby on Rails.

## Estrutura do Projeto

```
├── client/              # Frontend React
│   ├── src/             
│   │   ├── components/  # Componentes React
│   │   ├── hooks/       # Custom hooks
│   │   ├── lib/         # Utilitários
│   │   └── pages/       # Páginas
├── db/                  # Scripts de banco de dados
├── server/              # Backend Express 
└── shared/              # Esquemas compartilhados
```

## Funcionalidades Implementadas

- **Autenticação**: Sistema de login e registro com sessões
- **Dashboard**: Visão geral financeira e gráficos
- **Transações**: Gerenciamento de receitas e despesas
- **Orçamento**: Controle de orçamento por categoria
- **Metas**: Acompanhamento de metas financeiras
- **Relatórios**: Relatórios e análises
- **Investimentos**: Gerenciamento de investimentos
- **Insights com IA**: Mockup de sugestões de IA para economia e finanças

## Tecnologias Utilizadas

### Frontend
- React 
- TanStack Query (React Query) para gerenciamento de estado do servidor
- Shadcn/UI + Tailwind CSS para componentes e estilização
- Recharts para visualização de dados
- Zod para validação de formulários
- React Hook Form para gerenciamento de formulários
- Wouter para roteamento

### Backend (atual - Express)
- Node.js + Express
- Drizzle ORM para acesso ao banco de dados
- PostgreSQL como banco de dados
- Autenticação com Passport.js

## Guia para Migração para Ruby on Rails

### 1. Estrutura de Endpoints da API

O frontend espera os seguintes endpoints REST:

#### Autenticação
- `POST /api/register` - Criar nova conta
- `POST /api/login` - Autenticar usuário
- `POST /api/logout` - Sair da sessão
- `GET /api/user` - Obter usuário atual autenticado

#### Transações
- `GET /api/transactions` - Listar transações
- `GET /api/transactions/recent` - Obter transações recentes
- `POST /api/transactions` - Criar nova transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Excluir transação

#### Categorias
- `GET /api/categories` - Listar categorias
- `POST /api/categories` - Criar categoria

#### Orçamento
- `GET /api/budget` - Obter dados de orçamento
- `GET /api/budget/categories` - Obter categorias de orçamento
- `PUT /api/budget/categories/:id` - Atualizar categoria de orçamento

#### Dashboard
- `GET /api/dashboard/overview` - Obter resumo do dashboard
- `GET /api/dashboard/spending-chart` - Obter dados para gráfico de gastos

#### Metas
- `GET /api/goals` - Listar metas financeiras
- `POST /api/goals` - Criar meta
- `PUT /api/goals/:id` - Atualizar meta
- `DELETE /api/goals/:id` - Excluir meta

#### Investimentos
- `GET /api/investments` - Listar investimentos
- `POST /api/investments` - Criar investimento
- `PUT /api/investments/:id` - Atualizar investimento
- `DELETE /api/investments/:id` - Excluir investimento

#### Relatórios
- `GET /api/reports` - Obter dados para relatórios

### 2. Estrutura do Banco de Dados

O banco de dados PostgreSQL contém as seguintes tabelas:

- **users**: Usuários do sistema
  - id (PK)
  - username
  - password (hash)
  - email
  - first_name
  - last_name
  - created_at
  - updated_at

- **categories**: Categorias de transações
  - id (PK)
  - user_id (FK para users)
  - name
  - type (income/expense)
  - color
  - icon
  - created_at
  - updated_at

- **transactions**: Registro de transações
  - id (PK)
  - user_id (FK para users)
  - category_id (FK para categories)
  - description
  - amount
  - type (income/expense)
  - date
  - notes
  - is_recurring
  - created_at
  - updated_at

- **budget_categories**: Orçamentos por categoria
  - id (PK)
  - user_id (FK para users)
  - category_id (FK para categories)
  - amount
  - month
  - year
  - created_at
  - updated_at

- **goals**: Metas financeiras
  - id (PK)
  - user_id (FK para users)
  - name
  - target (valor alvo)
  - current_amount
  - deadline
  - priority
  - notes
  - created_at
  - updated_at

- **investments**: Investimentos
  - id (PK)
  - user_id (FK para users)
  - name
  - type
  - amount
  - current_value
  - return_rate
  - start_date
  - maturity_date
  - notes
  - created_at
  - updated_at

### 3. Autenticação em Rails

Para implementar a autenticação no Rails:

1. **Devise**: Use a gem Devise para autenticação básica
2. **JWT ou Sessions**: Decida entre tokens JWT ou sessions tradicionais
   - O frontend atual espera uma autenticação baseada em sessions

### 4. Formatos de Resposta

Os endpoints devem retornar respostas JSON com o seguinte formato:

- **Sucesso Singular**: `{ id: 1, name: "Nome", ... }`
- **Sucesso Plural**: `[ { id: 1, ... }, { id: 2, ... } ]`
- **Erro**: `{ message: "Mensagem de erro" }` ou `{ errors: { campo: ["erro"] } }`

### 5. Validações

As validações necessárias incluem:

- Autenticação do usuário em todas as rotas protegidas
- Validação de tipos e formatos nos dados de entrada
- Autorização: usuários só acessam seus próprios dados

### 6. Implementação de Rails

1. Crie um novo projeto Rails:
```
rails new ecobrain-backend --api --database=postgresql
```

2. Configure as gems necessárias no Gemfile:
```ruby
gem 'devise'
gem 'jbuilder'
gem 'rack-cors'
gem 'active_model_serializers'
```

3. Configure o banco de dados no `config/database.yml`

4. Configure o CORS para permitir solicitações do frontend

5. Implemente os modelos seguindo o esquema de banco de dados

6. Implemente os controllers para os endpoints necessários

7. Configure as rotas no `config/routes.rb`

8. Configure a autenticação com Devise

9. Implemente os serializers para formatar as respostas JSON

### 7. Dicas para Testes

- Use RSpec para testes
- Teste todos os endpoints da API
- Verifique autenticação e autorização
- Valide formatos de resposta

## Desenvolvimento Futuro

Algumas ideias para expansão do projeto:

1. **Integração Bancária**: Conectar a contas bancárias para importação automática de transações
2. **Exportação de Dados**: Permitir exportação em CSV ou PDF
3. **Planejamento Tributário**: Ferramentas para otimização fiscal
4. **Integração de Criptomoedas**: Rastreamento de investimentos em criptomoedas
5. **Notificações**: Alertas para vencimentos de contas, metas atingidas, etc.
6. **Análise Preditiva**: Estimativas futuras baseadas em gastos e receitas passados

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adicionar nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT.