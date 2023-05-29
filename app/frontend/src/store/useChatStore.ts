import create from 'zustand'

import {
  ChatMessage,
  chatMessages,
  chatMessages2,
  chatMessages3,
  chatMessages4,
  chatMessages5
} from '@/_Mock/chat/dummyChat'

interface ChatState {
  selectedUserId: string
  messages: ChatMessage[]
  addMessage: (message: ChatMessage, id: string) => void
  setSelectedUserId: (userId: string) => void
}

const useChatStore = create<ChatState>(set => ({
  selectedUserId: '1',
  messages: [],

  // it will change state when send message but now only add new data to dummy
  addMessage: (message: ChatMessage, id: string) =>{

    switch (id) {
      case '1':
        chatMessages.push(message)
        set(() => ({
          messages: [...chatMessages].reverse(),
        }))
        break
      case '2':
        chatMessages2.push(message)
        set(() => ({
          messages: [...chatMessages2].reverse(),
        }))
        break
      case '3':
        chatMessages3.push(message)
        set(() => ({
          messages: [...chatMessages3].reverse(),
        }))
        break
      case '4':
        chatMessages4.push(message)
        set(() => ({
          messages: [...chatMessages4].reverse(),
        }))
        break
      case '5':
        chatMessages5.push(message)
        set(() => ({
          messages: [...chatMessages5].reverse(),
        }))
    }

    set(state => ({
      // messages: [message, ...state.messages],

    }))},

  setSelectedUserId: userId => {


    //it will delete when socket connected
    switch (userId) {
      case '1':
        set(() => ({
          messages: [...chatMessages].reverse(),
        }))
        break
      case '2':
        set(() => ({
          messages: [...chatMessages2].reverse(),
        }))
        break
      case '3':
        set(() => ({
          messages: [...chatMessages3].reverse(),
        }))
        break
      case '4':
        set(() => ({
          messages: [...chatMessages4].reverse(),
        }))
        break
      case '5':
        set(() => ({
          messages: [...chatMessages5].reverse(),
        }))
    }


    set(() => ({
      selectedUserId: userId,
    }))
  },


}))

export default useChatStore
