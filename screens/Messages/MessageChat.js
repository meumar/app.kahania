import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import IconButton from "../../components/Form-items/IconButtom";
import { colors, messages } from "../../constants/colors";
import { getChatMessages } from "../../http/post";
import moment from "moment";
import TimeAgo from "../../components/UI-widgets/TimeStampField";
import LoadingOverlay from "../../components/UI-widgets/LoadingOverlay";
import { useSocket } from "../../http/SocketContext";
const MessageChat = ({ route, navigation }) => {
  const [messageLoading, setMessageLoading] = useState(false);
  const [storedUserToken, setStoredUserToken] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [page, setPage] = useState(1);
  const [chat_id, setChatId] = useState('');
  const limit = 5;
  const { post_id, post_name, saved_chat_id } = route.params;
  const socket = useSocket();
  useLayoutEffect(() => {
    navigation.setOptions({ title: post_name.slice(0, 18) + " - chat" });
  }, []);
  useEffect(() => {
    (async () => {
      setMessageLoading(true);
      if(saved_chat_id){
        setChatId(saved_chat_id);
      }
      console.log("chat_idchat_idchat_id", saved_chat_id, chat_id);
      const [storedToken] = await Promise.all([AsyncStorage.getItem("token")]);
      const preMessages = await getChatMessages({
        post_id,
        chat_id: (chat_id || saved_chat_id),
        page,
        limit,
      });
      console.log("preMessages", preMessages);
      setChatMessages((currentMessages) => [
        ...currentMessages,
        ...preMessages,
      ]);
      setStoredUserToken(storedToken);
      setPage((c) => c + 1);
      setMessageLoading(false);
    })();
  }, []);
  useEffect(() => {
    if(chat_id){
      socket.emit("connectToChat", chat_id);
    }
  }, [chat_id]);
  useEffect(() => {
    const handleNewMessage = (data) => {
      if (data?.post_id == post_id) {
        data.is_read = true;
        setChatMessages((currentMessages) => [...[data], ...currentMessages]);
        if(data?.new_chat_id){
          setChatId(data.new_chat_id);
        }
        socket.emit("maskAsReadMessage", data.key_index);
      }
    };
    const handleMarkAsReadMessageFromUser = (messageId) => {
      setChatMessages((currentMessages) => [
        ...currentMessages.map((e) => {
          if (e?._id == messageId || e?.key_index == messageId) {
            e.is_read = true;
          }
          return e;
        }),
      ]);
    };
    socket.on("newMessageAddedFromUser", handleNewMessage);
    socket.on("maskAsReadMessageFromUser", handleMarkAsReadMessageFromUser);

    return () => {
      socket.off("newMessageAddedFromUser", handleNewMessage);
      socket.off("maskAsReadMessageFromUser", handleMarkAsReadMessageFromUser);
    };
  }, [socket]);
  function generateRandomString(length) {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }
  const handleSend = () => {
    const key_index = generateRandomString(24);
    if (newMessage.trim() !== "") {
      setChatMessages([
        { message: newMessage, sentByUser: true, key_index: key_index },
        ...chatMessages,
      ]);
      setNewMessage("");
      socket.emit("newMessageAdded", {
        post_id: post_id,
        message: newMessage,
        userToken: storedUserToken,
        sent_on: moment().utc().format(),
        chat_id: chat_id,
        key_index: key_index,
      });
    }
  };

  const handleEmojiIconPress = () => {};
  if (messageLoading) {
    return <LoadingOverlay message={messages.LOADING} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View
            style={[
              styles.messageContainer,
              item.sentByUser ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message.trim()}</Text>
            <View style={styles.messageInfo}>
              <TimeAgo dateTime={item.sent_on} />
              <Ionicons
                name={
                  item.is_read
                    ? "checkmark-done-circle"
                    : "checkmark-done-circle-outline"
                }
                size={18}
                color={colors.primary800}
                style={{ alignSelf: "flex-end" }}
              />
            </View>
          </View>
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <IconButton
          icon="happy-outline" // Emoji icon from Ionicons
          size={24}
          color={colors.primary800}
          onPress={handleEmojiIconPress} // Open emoji keyboard on press
        />
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={(message) => setNewMessage(message)}
          placeholder="Type your message..."
          multiline
        />
        <IconButton
          onPress={handleSend}
          icon="send"
          size={24}
          color={colors.primary800}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageInfo: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E8E8E8",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 15,
    minHeight: 40,
  },
});

export default MessageChat;
