import { ReactNode, createContext, useState } from 'react'
import { useToast } from '../ui/use-toast'
import { useMutation } from '@tanstack/react-query'

type StreamResponse = {
  addMessage: () => void
  message: string
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isLoading: boolean
}

export const ChatContext = createContext<StreamResponse>({
  addMessage: () => {},
  message: '',
  handleInputChange: () => {},
  isLoading: false,
})

interface Props {
  field: string
  children: ReactNode
}
export const ChatContexrProvider = ({ field, children }: Props) => {
  const [message, setMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { toast } = useToast()

  const { mutate: sendMessage } = useMutation({
    mutationFn: async ({ message }: { message: string }) => {
      const response = await fetch('/api/message', {
        method: 'POST',
        body: JSON.stringify({ field, message }),
      })
      if (!response) {
        throw new Error('Failed to send message')
      }
      return response.body
    },
  })

  const addMessage = () => sendMessage({ message })
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(event.target.value)
  }

  return (
    <ChatContext.Provider
      value={{ addMessage, message, handleInputChange, isLoading }}
    >
      {children}
    </ChatContext.Provider>
  )
}
