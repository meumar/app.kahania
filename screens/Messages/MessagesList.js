import React, { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, FlatList, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, messages } from "../../constants/colors";
import { getMessagesByPost, markAsReadChat } from "../../http/post";
import TimeAgo from "../../components/UI-widgets/TimeStampField";
import LoadingOverlay from "../../components/UI-widgets/LoadingOverlay";
import { useSocket } from "../../http/SocketContext";

const MessageList = ({ route, navigation }) => {
  const [charListLoading, setCharListLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [chatList, setChatList] = useState([]);
  const [lastMessage, setLastMessage] = useState(false);
  const limit = 5;
  const { post_id, post_name } = route.params;
  const socket = useSocket();

  useLayoutEffect(() => {
    navigation.setOptions({ title: post_name.slice(0, 18) + " - chat" });
  }, []);
  useEffect(() => {
    (async () => {
      setCharListLoading(true);
      const listOfCharts = await getMessagesByPost({ post_id, page, limit });
      setChatList((currentList) => [
        ...currentList,
        ...listOfCharts.filter((e) => e.lastMessage),
      ]);
      chatList.forEach((e) => {
        if (!e?.lastMessage?.sentByUser && !e?.lastMessage?.is_read) {
          setLastMessage(true);
        }
      });
      setCharListLoading(false);
      setPage((c) => c + 1);
    })();
  }, []);
  useEffect(() => {
    const userViewChatMessages = (chat_id) => {
      setChatList((currentList) => [
        ...currentList.map((e) => {
          if (e?._id == chat_id && e?.lastMessage) {
            e.lastMessage.is_read = true;
          }
          return e;
        }),
      ]);
    };
    socket.on("userOpenedChattingFromUser", userViewChatMessages);

    return () => {
      socket.off("userOpenedChattingFromUser", userViewChatMessages);
    };
  }, []);
  const chatOpenHandler = async (chat_id) => {
    await markAsReadChat(chat_id);
    if (lastMessage) {
      socket.emit("userOpenedChatting", chat_id);
    }
    navigation.navigate("MessageChat", { post_id, post_name, saved_chat_id: chat_id });
  };
  const singleChat = (item) => {
    let messageComponent = (
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Ionicons
          name={
            item.lastMessage.is_read
              ? "checkmark-done-circle"
              : "checkmark-done-circle-outline"
          }
          size={18}
          color={colors.primary800}
          style={{ alignSelf: "center" }}
        />
        <Text
          style={[
            styles.messageText,
            !item?.lastMessage?.sentByUser &&
              !item.lastMessage.is_read &&
              styles.unReadMessage,
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {item.lastMessage.message}
        </Text>
      </View>
    );
    return (
      <Pressable
        style={({ pressed }) => [styles.singleChat, pressed && styles.pressed]}
        onPress={chatOpenHandler.bind(this, item._id)}
      >
        <View style={styles.innerChatBox}>
          {messageComponent}
          <TimeAgo
            dateTime={item.lastMessage.sent_on}
            style={styles.timeText}
          />
        </View>
      </Pressable>
    );
  };
  if (charListLoading) {
    return <LoadingOverlay message={messages.LOADING} />;
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={chatList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => singleChat(item)}
        ListEmptyComponent={() =>
          !charListLoading && (
            <View style={styles.nochats}>
              <Text style={styles.loadingText}>No chats added</Text>
            </View>
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  nochats: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    fontFamily: "Inter_600SemiBold",
  },
  pressed: {
    opacity: 0.75,
    backgroundColor: colors.selectedColor,
  },
  container: {
    flex: 1,
  },
  innerChatBox: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 25,
  },
  singleChat: {
    height: 50,
    paddingHorizontal: 12,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.selectedColor,
  },
  unReadMessage: {
    fontFamily: "Inter_600SemiBold",
  },
  messageText: {
    fontSize: 18,
    fontFamily: "Inter_300Light",
  },
  timeText: {
    fontSize: 16,
  },
});

export default MessageList;
