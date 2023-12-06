# Backend-desafio-2

**Objetivo:**

- Desenvolver uma API RESTful para autenticação de usuários, que permita operações de cadastro (sign up), autenticação (sign in) e recuperação de informações do usuário.

## Setup

### Requisitos

```
Node.js 18.x ou superior
```

### Instalando as dependências

```bash
$ npm install
```

## Executando

```bash
# em modo desenvolvimento
$ npm run start

# em modo desenvolvimento com watch
$ npm run start:dev

# em modo produção
$ npm run start:prod
```

## Teste

```bash
# testes unitários
$ npm run test

# cobertura de testes
$ npm run test:cov
```

## Hospedagem

- AWS
- URL base: http://52.67.173.17:3000/

## Rotas

- **Sign up** - POST

```
/auth/sign-up
```

- **Sign in** - POST

```
/auth/sign-in
```

- **Buscar todos os usuários** - GET

```
/user/
```

- **Buscar um usuário** - GET

```
/user/{id}
```

- **Atualizar um usuário** - PATCH

```
/user/{id}
```
