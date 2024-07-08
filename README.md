# Tech Lab Challenge 2024 3q - Thiago Batista Araújo

Abaixo encontra-se algumas especificações e demonstrações do resultado final obtido no desafio.
Deixo um agradecimento pela oportunidade e pela inciativa de incentivar eventos como esse na comunidade universitária. Com certeza todo processo foi muito enriquecedor.
- Para demonstrar as funcionalidades da minha aplicação, foi gravado um vídeo de exibição: <https://youtu.be/yZmkqdATdm4>

## Alterações mais significativas
### Substituição do PostgreSQL pelo MongoDB
  - Motivação: o mongoDB traz nativamente a possibilidade de armazenamento e recuperação de arquivos, o que vai de encontro com algumas propostas do chat: envio de arquivos, fotos, vídeos, etc. Nesse contexto de aplicação, o mongo torna-se interessante por eliminar a necessidade de armazenar essas informações em algum provedor externo. Dentre as soluções desenvolvidas, é possível armazenar e recuperar arquivos pdfs.

### Substituição dos escopos por middlewares de autenticação
  - Motivação: a substituição dos escopos por middlewares de validação foi feita por uma questão pessoal. Com os middlewares é possível gerenciar acesso às rotas, baseado no profile do usuário e consumidor, além de analisar algumas informações na autenticação, como IP, se o token está vencido, etc. 

### Substituição da página inicial do chat (consumidor) por login/registra-se
 - Motivação: a troca do chat inicial no painel do consumidor por uma página de login e registra-se foi feita pensando nos fatores design, facilidade de inserção de dados, e carga do chat.

### Reorganização de pastas
  - Motivação: as rotas foram adicionadas em uma nova pasta, deixando o app.ts mais limpo e compreensível. Além disso, foram adicionados pastas de validação e model no backend.


## BACKLOG
### Features Gerais
  - Layout amigável
  - Sistema de distribuição de atendimento
  - Sistema de disponibilidade do atendente
  - Dark mode na aplicação do consumidor
  - Dark mode na aplicação do atendente
  - Validação das requisições de API
  - Histórico de conversas
  - Envio de arquivos na conversa
  - Persistência na sessão do atendente
  - Criação de outros usuários
  - Atendente ver apenas conversas atribuídas a ele

### Correção de bugs
  - Atualização de usuários
  - Carregar mais que 25 resultados na API
  - Consumidor com erro na aplicação
  - Criptografia de senha de usuários
  - Login sem informar senha
    
### Features extras
  - Ocultamento de acesso à senha de usuários por requisição
  - Bearer auth em rotas
  - Flags de conversa distribuída e não distribuída no painel do atendente
  - Flags de conversa finalizada e em andamento no painel do consumidor
  - Botão de logout
  - Criação de nova conta na aplicação do consumidor
  - Banners de alertas de sucesso ou erro nas requisições
  - Ocultamento de componentes de acordo com o perfil do atendente
    
## Como rodar o projeto
  - clonar o repositório e certificar que seu docker possui a imagem do mongo
  - Usar o comando: docker-compose up -d na raiz do seu projeto
  - Acessar pelo seu navegador: localhost:8081 (painel atendente) e localhost:8082 (painel consumidor)

## Links úteis
- https://mongoosejs.com/
- https://www.npmjs.com/package/celebrate
- https://www.mongodb.com/pt-br
- https://www.npmjs.com/package/multer
- https://www.npmjs.com/package/bcrypt
