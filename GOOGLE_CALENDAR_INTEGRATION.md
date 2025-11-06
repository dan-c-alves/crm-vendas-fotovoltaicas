# 📅 Integração Google Calendar - CRM Fotovoltaico

## Como Funciona

A integração com o Google Calendar permite que todas as tarefas criadas no CRM sejam automaticamente sincronizadas com o seu calendário do Google, garantindo que você nunca perca um follow-up importante.

## ✅ Funcionalidades

### 1. **Sincronização Automática**
- Quando você cria uma tarefa na página "Tarefas" com uma data/hora definida, o sistema automaticamente:
  - Cria um evento no seu Google Calendar
  - Define lembretes automáticos (10 min antes no telemóvel + 1 dia antes por email)
  - Adiciona informações do lead (nome, telefone, status)

### 2. **Atualização em Tempo Real**
- Se você alterar a data de uma tarefa → o evento no calendário é reagendado
- Se você marcar uma tarefa como concluída → o evento é removido do calendário
- Se você apagar uma tarefa → o evento é removido do calendário

### 3. **Lembretes Inteligentes**
- **10 minutos antes**: notificação push no telemóvel
- **1 dia antes**: email de lembrete
- Sincroniza com todos os dispositivos conectados à sua conta Google

## 🔧 Como Configurar

### Passo 1: Conectar Google Calendar
1. Acesse **Configurações** no menu lateral
2. Na seção "Integração com Google Calendar", clique em **"Conectar Google Calendar"**
3. Você será redirecionado para a página de login do Google
4. Faça login com a conta **danilocalves86@gmail.com**
5. Autorize as permissões solicitadas:
   - Ver informações básicas do perfil
   - Acessar o Google Calendar
   - Criar/editar/eliminar eventos

### Passo 2: Confirmar Conexão
- Após autorizar, você será redirecionado de volta para o CRM
- A página de Configurações mostrará: ✅ **"Conectado com sucesso!"**
- O email da conta conectada será exibido

### Passo 3: Usar a Integração
1. Vá para a página **"Tarefas"**
2. Crie uma nova tarefa ou edite uma existente
3. Defina a **data e hora** da próxima ação
4. Salve a tarefa
5. O evento será criado automaticamente no Google Calendar!

## 📱 Como Verificar no Telemóvel

1. Abra o aplicativo **Google Calendar** no seu telemóvel
2. Os eventos criados aparecerão com o formato:
   ```
   FOLLOW-UP: [Nome do Lead] ([Telefone])
   ```
3. Você receberá notificações push 10 minutos antes do horário agendado

## 🔄 Fluxo de Sincronização

### Criar Tarefa
```
Você cria tarefa no CRM
    ↓
Sistema cria evento no Google Calendar
    ↓
Evento aparece no seu calendário
    ↓
Você recebe lembretes automáticos
```

### Atualizar Tarefa
```
Você altera data da tarefa
    ↓
Sistema remove evento antigo
    ↓
Sistema cria novo evento com nova data
    ↓
Calendário atualizado
```

### Concluir Tarefa
```
Você marca tarefa como concluída
    ↓
Sistema remove evento do calendário
    ↓
Tarefa desaparece da lista
```

## ⚙️ Detalhes Técnicos

### Informações do Evento
Cada evento criado contém:
- **Título**: `FOLLOW-UP: [Nome do Lead] ([Telefone])`
- **Descrição**: Status atual do lead + notas de conversa
- **Duração**: 30 minutos (padrão)
- **Timezone**: Europe/Lisbon (Portugal)
- **Lembretes**:
  - Email: 1 dia (1440 minutos) antes
  - Popup: 10 minutos antes

### Campos Sincronizados
O sistema sincroniza:
- `data_proxima_acao`: data/hora da tarefa
- `google_event_id`: ID do evento no Google Calendar (armazenado no banco)
- `nome_lead`: usado no título
- `telefone`: usado no título
- `status`: incluído na descrição
- `notas_conversa`: incluído na descrição

## 🔒 Segurança

- O token de acesso ao Google é armazenado de forma segura no banco de dados
- Apenas o usuário autorizado (danilocalves86@gmail.com) pode conectar
- O sistema usa OAuth 2.0 do Google para autenticação
- Os tokens são renovados automaticamente quando necessário

## ❓ Resolução de Problemas

### "Falha na conexão"
**Causa**: Email não está na lista de teste do Google Cloud Console

**Solução**:
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para "APIs & Services" → "OAuth consent screen"
3. Na seção "Test users", adicione: danilocalves86@gmail.com
4. Tente conectar novamente

### Eventos não aparecem no calendário
**Causa**: Token expirado ou permissões insuficientes

**Solução**:
1. Vá para Configurações
2. Clique em "Reconectar Google Calendar"
3. Autorize novamente as permissões

### Lembretes não chegam no telemóvel
**Causa**: Notificações desativadas no app Google Calendar

**Solução**:
1. Abra o app Google Calendar no telemóvel
2. Vá para Configurações → Notificações
3. Ative "Eventos" e "Lembretes"

## 📊 Status da Integração

Você pode verificar o status da integração a qualquer momento:
- Acesse **Configurações**
- Veja a seção "Integração com Google Calendar"
- Status possível:
  - ✅ **Conectado**: integração ativa e funcionando
  - ⚠️ **Falha na conexão**: precisa reconectar
  - ⏳ **Não conectado**: aguardando primeira conexão

## 💡 Dicas de Uso

1. **Sempre defina data/hora** nas tarefas para sincronização automática
2. **Use notas de conversa** para adicionar detalhes aos eventos
3. **Marque como concluída** para limpar o calendário automaticamente
4. **Verifique o calendário** regularmente no telemóvel
5. **Mantenha o app Google Calendar atualizado** para melhor experiência

## 🚀 Próximos Passos

Após conectar o Google Calendar:
1. ✅ Teste criando uma tarefa com data futura
2. ✅ Verifique se o evento apareceu no Google Calendar
3. ✅ Confirme que recebe notificações no telemóvel
4. ✅ Experimente atualizar e concluir tarefas

---

**Nota**: A integração funciona em segundo plano e não requer ação manual após a configuração inicial. Todas as tarefas futuras serão sincronizadas automaticamente! 🎉
