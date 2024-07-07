import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationProvider";
import { IConversation } from "../interfaces/IConversation";
import { LoadingButton } from "@mui/lab";
import { Box, Typography, List, ListItem, Grid, TextField, Button, styled } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../services/api";
import { IConversationMessage } from "../interfaces/IConversationMessage";
import { useForm } from "react-hook-form";
import SendIcon from '@mui/icons-material/Send';
import { useParams } from "react-router-dom";
import { CloudUpload } from "@mui/icons-material";

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
  const params = useParams()
  const conversationId = params.conversationId
  const [showSendMessage, setShowSendMessage] = useState(false);

  const {accessToken } = useContext(AuthenticationContext);

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  useQuery({
    queryKey: ['conversations', conversationId],
    queryFn: async () => {
      console.log("dentro do conversation: " , accessToken)
      const response = await api.get(`/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })

      response.data.deletedAt? setShowSendMessage(false) : setShowSendMessage(true);

      return response.data as IConversation
    }
  });

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
    refetchInterval: 20*1000
  });
  



  const messages = useMemo(() => [
    ...messagesQuery.data?.results ?? []
  ].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
  [messagesQuery.data?.results])

  const downloadFile = async ( fileId: string ) => {
  
    const response = await api.get(`/files`, {
      params: { file: fileId },
      headers: { Authorization: `Bearer ${accessToken}`},
      responseType: 'blob'
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

  useEffect(() => {
    if (!scrollRef.current) return

    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = useMutation({
    mutationFn: async (conversationMessageInput: IConversationMessageInput) => {

      console.log('bearer', accessToken)
      await api.post(
        `/conversationMessages`,
        {
          by: 'consumer',
          conversation: conversationId,
          content: conversationMessageInput.content,
          type: "TEXT"
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
    },
    onSuccess: () => messagesQuery.refetch()
  })

  const form = useForm({
    defaultValues: { content: '' },
  })

  const handleSubmit = useCallback((message: IConversationMessageInput) => {
    message.content = message.content?.trim()

    if (!message.content) return;
    form.reset();
    send.mutate(message)
        
  }, [send.mutate, form])

  const submit = form.handleSubmit(handleSubmit)

  const handleKeyPress = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Enter') return

    if (event.shiftKey) return

    event.stopPropagation()

    submit(event)
  }, [submit])

  const upload = async (event: any) => {
    console.log("aqui: ", event.target.files)
    const file = event.target.files[0];
    const response = await api.post(`/files`, {file}, {
      params: { conversation: conversationId },
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": 'multipart/form-data' }
    });

    location.reload();
    console.log("arquivoooo: ", response)
  };

  return (
    <Box display='flex' flexDirection='column' height='100vh' py={2} position={"fixed"} width={"70vw"}>
      <Box>
      </Box>
      <Box maxHeight='80%' overflow='auto' ref={scrollRef} display='flex' justifyContent='center'>
        <List style={{ maxWidth: "90%", width: "100%" }}>
          {messages.map((message) => (
            <ListItem 
              key={`messages:${message.id}`} 
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
                {message.type == "FILE" && (
                  <Button variant="contained" onClick={() => downloadFile(message.fileId)}>Download</Button>
                )}
              </Box>
            </ListItem>
            
          ))}
        </List>
      </Box>
      {showSendMessage && (
        <Box mt='auto' px={4} mb={1}>
          <Grid container spacing={2}>
            <Grid item sm={9}>
              <TextField {...form.register('content')} multiline fullWidth onSubmit={submit} onKeyUp={handleKeyPress}/>
            </Grid>
            <Grid item sm={1} mt='auto' mr={6}>
              <LoadingButton loading={send.isPending} variant="contained" style={{ padding: 16 }} startIcon={<SendIcon />} onClick={submit}>
                Enviar
              </LoadingButton>
            </Grid>
            <Grid item sm={1} mt='auto'>
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                style={{ padding: 16 }}
                startIcon={<CloudUpload />}
                onChange={(e) => upload(e)}
              >
                Arquivo
                <VisuallyHiddenInput type="file" id="file" name="file" accept=".pdf"/>
              </Button>
            </Grid>
          </Grid>
        </Box>
      )}
      
    </Box>
  )
}