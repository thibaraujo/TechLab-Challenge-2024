import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationProvider";
import { IConversation } from "../interfaces/IConversation";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, List, ListItem, Grid, TextField } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { IConversationMessage } from "../interfaces/IConversationMessage";
import { useForm } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send';

export interface TemporaryConversationMessage {
  _id: string
  by: 'system' | 'consumer'
  content: string
  createdAt: string
}

export interface IConversationMessageInput {
  content: string
}

export function Chat() {
  const scrollRef = useRef<HTMLElement>(null)

  const { consumer, isLoading, accessToken, signIn } = useContext(AuthenticationContext)

  const conversationQuery = useQuery({
    queryKey: ['conversations', consumer?._id],
    queryFn: async () => {
      if (!consumer) return null; 
  
      const response = await api.get('/conversations', {
        params: { consumer: consumer._id },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      console.log('response', response.data)
      return (response.data.results[0] ?? null) as IConversation | null;
    },
    enabled: !!consumer, 
  });
  

  const conversation = conversationQuery.data

  const messagesQuery = useQuery({
    queryKey: ['conversations', conversation?._id, 'messages'],
    queryFn: async () => {
      if (!conversation) return null; 
  
      const response = await api.get('/conversationMessages', {
        params: { id: conversation._id },
        headers: { Authorization: `Bearer ${accessToken}` }
      });
  
      setTemporaryConversationMessages([]); // Limpa as mensagens temporárias, se necessário
  
      return response.data as {
        total: number;
        results: IConversationMessage[];
      };
    },
    enabled: !!conversation, // Habilita a execução da consulta somente se conversation estiver definido
    refetchInterval: 20 * 1000 // Intervalo de refetch de 20 segundos, se necessário
  });
  

  const [temporaryConversationMessages, setTemporaryConversationMessages] = useState<TemporaryConversationMessage[]>([])

  const pushTemporaryConversationMessage = useCallback((message: Omit<TemporaryConversationMessage, '_id' | 'createdAt'>) => {
    setTemporaryConversationMessages((messages) => [
      ...messages,
      { _id: self.crypto.randomUUID(), createdAt: new Date().toISOString(), ...message }
    ])
  }, [])

  const messages = useMemo(() => [
    ...messagesQuery.data?.results ?? [],
    ...temporaryConversationMessages
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  [temporaryConversationMessages, messagesQuery.data?.results])

  const documentQuestionOpen = useRef(false)
  const subjectQuestionOpen = useRef(false)

  const send = useMutation({
    mutationFn: async (conversationMessageInput: IConversationMessageInput) => {
      console.log(temporaryConversationMessages)
      if (documentQuestionOpen.current) {
        signIn(conversationMessageInput.content)

        pushTemporaryConversationMessage({ by: 'consumer', content: conversationMessageInput.content })

        documentQuestionOpen.current = false

        return
      }

      if (subjectQuestionOpen.current && conversation) {
        pushTemporaryConversationMessage({ by: 'consumer', content: conversationMessageInput.content })
        console.log('bearer', accessToken)
        await api.post(
          `/conversationMessages`,
          {
            by: 'consumer',
            conversation: conversation?._id,
            content: conversationMessageInput.content
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        subjectQuestionOpen.current = false

        conversationQuery.refetch()

        return
      }

      if (!conversation) {
        console.log("nao tem")
        const resp = await api.post(
          `/conversations`,
          {
            consumer: consumer?._id,
            subject: conversationMessageInput.content
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );

        conversationQuery.refetch()

        await api.post(
          `/conversationMessages`,
          {
            by: 'consumer',
            conversation: resp.data._id,
            content: conversationMessageInput.content
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }
      else {
        console.log("tem")
        await api.post(
          `/conversationMessages`,
          {
            by: 'consumer',
            conversation: conversation?._id,
            content: conversationMessageInput.content
          },
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
      }

      messagesQuery.refetch()
    },
    onSuccess: () => messagesQuery.refetch()
  })

  const form = useForm({
    defaultValues: { content: '' },
  })

  const handleSubmit = useCallback((message: IConversationMessageInput) => {
    message.content = message.content?.trim()

    if (!message.content) return;

    form.reset()

    send.mutate(message)
  }, [send.mutate, form])

  const submit = form.handleSubmit(handleSubmit)

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return

    if (event.shiftKey) return

    event.stopPropagation()

    submit(event)
  }, [submit])

  useEffect(() => {
    if (isLoading) return;

    if (consumer) return;

    if (documentQuestionOpen.current) return;

    documentQuestionOpen.current = true

    pushTemporaryConversationMessage({ by: 'system', content: 'Qual o número do seu documento?' })
  }, [isLoading, consumer])

  useEffect(() => {
    if (conversationQuery.isLoading) return;

    if (conversation !== null) return;
    
    pushTemporaryConversationMessage({ by: 'system', content: 'Qual o assunto do atendimento?' })

    subjectQuestionOpen.current = true
  }, [conversationQuery.isLoading, conversation])

  return (
    <Box display='flex' flexDirection='column' height='100vh' py={2}>
      <Box>
      </Box>
      <Box maxHeight='80%' overflow='hidden scroll' ref={scrollRef} display='flex' justifyContent='center'>
        <List style={{ maxWidth: "90%", width: "100%" }}>
          {messages.map((message) => (
            <ListItem 
              key={`messages:${message._id}`} 
              style={{
                borderRadius: 5,
                backgroundColor: message.by === "consumer" ? "#373e4e" : message.by === "system" ? "#555659" : "#3833bc",
                marginTop: 5,
                maxWidth: "75%",
                width: "fit-content",
                color: "#ffffff",
                marginLeft: message.by === "consumer" ? "auto" : 0,
                marginRight: message.by === "consumer" ? 0 : "auto"
              }}
            >
              <Box>
                <Typography variant='body1'>{message.content}</Typography>
                <span style={{ width: 5 }} />
                <Typography variant='overline'>{message.by === "system" ? "Mensagem enviada pelo sistema" : " "}</Typography>
                <Typography variant='overline'>{new Date(message.createdAt).toLocaleString()}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Box mt='auto' px={4}>
        <Grid container spacing={2}>
          <Grid item sm={11}>
            <TextField {...form.register('content')} multiline fullWidth onSubmit={submit} onKeyUp={handleKeyPress}/>
          </Grid>
          <Grid item sm={1} mt='auto'>
            <LoadingButton loading={send.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SendIcon />} onClick={submit}>
              Send
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
