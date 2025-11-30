# Contribuindo para Marc Aromas

Obrigado por considerar contribuir para o projeto Marc Aromas! 🕯️

## Como Contribuir

### Reportando Bugs

Se você encontrou um bug, por favor abra uma issue incluindo:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Ambiente (OS, Node version, browser)

### Sugerindo Melhorias

Para sugestões de features, abra uma issue com:

- Descrição clara da funcionalidade
- Casos de uso
- Benefícios para os usuários
- Mockups ou wireframes (opcional)

### Pull Requests

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. Crie uma **branch** descritiva:
   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

4. **Desenvolva** sua feature/correção:
   - Siga os padrões de código do projeto
   - Adicione testes se aplicável
   - Atualize a documentação

5. **Commit** suas mudanças:
   ```bash
   git commit -m "feat: adiciona nova funcionalidade X"
   # ou
   git commit -m "fix: corrige bug Y"
   ```

6. **Push** para seu fork:
   ```bash
   git push origin feature/nome-da-feature
   ```

7. Abra um **Pull Request** explicando:
   - O que foi mudado
   - Por que foi mudado
   - Como testar

## Padrões de Código

### JavaScript/React

- Use ES6+ features
- Componentes funcionais com hooks
- Nomes descritivos em camelCase
- Comentários quando necessário

### Commits

Seguimos [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: nova funcionalidade
fix: correção de bug
docs: mudanças na documentação
style: formatação, ponto e vírgula, etc
refactor: refatoração de código
test: adição de testes
chore: mudanças em build, configs, etc
```

### Code Style

- **Indentação**: 2 espaços
- **Quotes**: Single quotes para strings
- **Semicolons**: Obrigatórios
- **Linha**: Max 100 caracteres

## Testes

Sempre adicione testes para novas funcionalidades:

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

## Documentação

Atualize a documentação relevante:

- README.md (se feature principal)
- PLATFORM_DOCUMENTATION.md (features/endpoints)
- Comentários no código
- JSDoc para funções complexas

## Processo de Review

Pull requests passam por review antes de merge:

1. **Automated checks**: Linting, testes
2. **Code review**: Por um maintainer
3. **Testing**: Testes adicionais se necessário
4. **Merge**: Após aprovação

## Dúvidas?

Abra uma issue ou entre em contato:
- Email: dev@marcaromas.com.br
- Discord: [Link do servidor]

Obrigado por contribuir! 🙏
