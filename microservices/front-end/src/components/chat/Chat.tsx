import { FC, useEffect, useState } from "react";
import { useUserContext } from "../../UserContext";
import { Socket } from "socket.io-client";
import { get24HourTime } from "../../utility/get24HourTime";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
} from "@chatscope/chat-ui-kit-react";

interface ChatProps {
  socket: Socket | undefined;
}

const Chat: FC<ChatProps> = ({ socket }) => {
  const { currentUser } = useUserContext();
  const [messages, setMessages] = useState<JSX.Element[]>([]);

  const insertMessage = (
    text: string,
    time: string,
    name: string,
    direction: "incoming" | "outgoing"
  ) => {
    const newMessage = (
      <Message
        model={{
          message: text,
          sentTime: time,
          sender: name,
          direction: direction,
          position: "single",
        }}
      >
        <Message.Footer sender={name} sentTime={time} />
      </Message>
    );

    setMessages((curMessages) => {
      return [...curMessages, newMessage];
    });
  };

  const messageSendHandler = (
    _innerHtml: string,
    _textContent: string,
    innerText: string
  ) => {
    const currentTime = get24HourTime();
    const SELF_REFERENCE = "You";

    insertMessage(innerText, currentTime, SELF_REFERENCE, "outgoing");

    socket?.emit(
      "send message",
      innerText,
      currentTime,
      currentUser.displayName
    );
  };

  useEffect(() => {
    const onReceiveMessage = (
      text: string,
      time: string,
      displayName: string
    ): void => {
      insertMessage(text, time, displayName, "incoming");
    };

    socket?.on("receive message", onReceiveMessage);

    const cleanup = () => {
      socket?.off("receive message", onReceiveMessage);
    };

    return cleanup;
  }, [socket]);

  return (
    <div style={{ position: "relative", height: "100%" }}>
      <MainContainer>
        <ChatContainer>
          {/* <ConversationHeader>
            <ConversationHeader.Content userName="Emily" /> // get display name
            on initial setup
          </ConversationHeader> */}
          <MessageList>{...messages}</MessageList>
          <MessageInput
            placeholder="Type message here"
            attachButton={false}
            onSend={messageSendHandler}
          />
        </ChatContainer>
      </MainContainer>
    </div>
  );
};

export default Chat;
