import { FC, useEffect, useState } from "react";
import { useUserContext } from "../../UserContext";
import io, { Socket } from "socket.io-client";
import { get24HourTime } from "../../utility/get24HourTime";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
} from "@chatscope/chat-ui-kit-react";

const Chat: FC = () => {
  const { currentUser } = useUserContext();
  const [messages, setMessages] = useState<JSX.Element[]>([]);
  const [socket, setSocket] = useState<Socket>();

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
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList
  ) => {
    console.log(innerHtml, textContent, innerText);
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

  const onReceiveMessage = (
    text: string,
    time: string,
    displayName: string
  ): void => {
    insertMessage(text, time, displayName, "incoming");
  };

  useEffect(() => {
    const socket = io("http://localhost:3111", { query: { roomId: "1" } });
    socket.on("connect", () => {
      console.log("socket connected");
    });

    socket.on("receive message", onReceiveMessage);
    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div style={{ position: "relative", height: "500px" }}>
      <MainContainer>
        <ChatContainer>
          <ConversationHeader>
            <ConversationHeader.Content userName="Emily" /> // get display name
            on initial setup
          </ConversationHeader>
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
