import { Box, Button, Grid, List, ListItem, Skeleton, TextField, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api.js";
import { IConversation } from "../interfaces/IConversation.js";
import { IConversationMessage } from "../interfaces/IConversationMessage.js";
import { useAccessToken } from "../hooks/useAuthenticationContext.js";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send.js';
import CloseIcon from '@mui/icons-material/Close.js';
import { LoadingButton } from "@mui/lab";

interface IConversationMessageInput {
  content: string
}

export function ConversationScreen() {
  const params = useParams()
  const conversationId = params.conversationId
  const scrollRef = useRef<HTMLElement>(null)

  if (!params.conversationId) throw new Error('No conversationId provided')

  const accessToken = useAccessToken()
  const navigate = useNavigate();

  const conversation = useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      const response = await api.get(`/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      return response.data as IConversation
    }
  })

  const messagesQuery = useQuery({
    queryKey: ['conversations', conversationId, 'messages'],
    queryFn: async () => {
      const response = await api.get(`/conversationMessages`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          id: conversationId
        }
      });
  
      console.log(response);
  
      return response.data as {
        total: number; // todo: alterar aqui
        results: IConversationMessage[]; 
      };
    },
    refetchInterval: 20 * 1000
  });
  

  const send = useMutation({
    mutationFn: async (conversationMessageInput: IConversationMessageInput) => {
      await api.post(
        `/conversationMessages`,
        {
          by: 'user',
          conversation: conversationId,
          content: conversationMessageInput.content,
          type: "TEXT"
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    },
    onSuccess: () => messagesQuery.refetch()
  });
  
  const downloadFile = async ( fileId: string ) => {
  
    const response = await api.get(`/files`, {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${accessToken}`, responseType: 'blob'}
    });

    const href = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = href;
    link.setAttribute('download', "file.pdf");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(href);

    console.log("arquivoooo: ", response)
  };

  const close = useMutation({
    mutationFn: async () => {
      await api.delete(`/conversations`, {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { id: conversationId }
      });
    },
    onSuccess: () => {
      messagesQuery.refetch();
      let path = location.href;
      if(path.includes("my_conversations")) navigate("/my_conversations");
      else navigate("/conversations");
      location.reload();
    }
  });
  

  const form = useForm({
    defaultValues: { content: '' },
  })

  const handleSubmit = useCallback((message: IConversationMessageInput) => {
    if (!message.content) return;

    send.mutate(message, {
      onSuccess: () => {
        form.reset()
      }
    })
  }, [send.mutate, form])

  const submit = form.handleSubmit(handleSubmit)

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return

    if (event.shiftKey) return

    event.stopPropagation()

    submit(event)
  }, [submit])

  const messages = useMemo(() => {
    return (messagesQuery.data?.results ?? []).slice().sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  }, [messagesQuery.data?.results])

  useEffect(() => {
    if (!scrollRef.current) return

    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  if (conversation.isLoading) return (
    <Skeleton variant="rounded" width={210} height={60} />
  )

  if (!conversation.data) throw new Error('Failed to load conversation')

  return (
    <Box display='flex' flexDirection='column' height='90vh' py={2} position={"fixed"} width={"70vw"}>
      <Box>
        <Typography variant='h5'>{conversation.data.subject}</Typography>
        {conversation.data.consumer.name && <Typography variant='subtitle1'>{conversation.data.consumer.name}</Typography>}
        <Typography variant='subtitle1'>{conversation.data.consumer.document}</Typography>
      </Box>
      <Box maxHeight='80%' overflow='hidden scroll' ref={scrollRef}>
        <List style={{maxWidth: "99%"}}>
          {messages.map((message) => (
            <ListItem key={`messages:${message.id}`} style={{
              borderRadius: 5,
              backgroundColor: message.by == "consumer" ? "#373e4e" : message.by == "system" ? "#555659" : "#3833bc",
              marginTop: 5,
              maxWidth: "75%",
              width: "fit-content",
              color: "#ffffff",
              marginLeft: message.by == "consumer" ? 0 : "auto"
            }}>
              <Box>
                <Typography variant='body1'>{message.content} </Typography>
                <span style={{ width: 5 }}/>
                <Typography variant='overline'>{message.by == "system" ? "Mensagem enviada pelo sistema" : " "}</Typography>
                <Typography variant='overline'>{new Date(message.createdAt).toLocaleString()}</Typography>
                {message.type == "FILE" && (
                  <Button variant="contained" onClick={() => downloadFile(message.fileId)}>Download</Button>
                )}
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>
      <Box mt='auto' px={4} mb={1}>
        <Grid container spacing={2}>
          <Grid item sm={9}>
            <TextField {...form.register('content')} multiline fullWidth onSubmit={submit} onKeyUp={handleKeyPress}/>
          </Grid>
          <Grid item sm={1} mt='auto' mr={4}>
            <LoadingButton loading={send.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SendIcon />} onClick={submit}>
              Enviar
            </LoadingButton>
          </Grid>
          <Grid item sm={1} mt='auto'>
            <LoadingButton loading={close.isPending} variant="contained" style={{ padding: 16 }} startIcon={<CloseIcon />} onClick={() => close.mutate()}>
              Fechar
            </LoadingButton>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}