import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import TimeAgo from "./TimeStampField";
import { colors } from "../../constants/colors";
import IconButton from "../Form-items/IconButtom";
import LikeCount from "./LikeCount";
import { likeHandler } from "../../http/post";
import LinkButton from "../Form-items/LinkButton";
import { Audio } from "expo-av";

function PostItem({ data, reportPost }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [postText, setPostText] = useState("");
  const [hasMoreText, setHasMoreText] = useState(false);
  const [postFile, setPostFile] = useState("");
  const [postFileType, setPostFileType] = useState("");
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);

  const maxTextLength = 100;
  const navigation = useNavigation();
  useEffect(() => {
    return sound
      ? () => {
          console.log("Unloading Sound");
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  useEffect(() => {
    if (data?.file) {
      setPostFile(data.file);
    }
    if (data?.file_type) {
      setPostFileType(data.file_type);
    }
    if (data?.likedByUser) {
      setIsLiked(true);
    }
    if (data?.likeCount) {
      setLikeCount(data.likeCount);
    }
    if (data?.body) {
      if (data.body.length > maxTextLength) {
        setPostText(data.body.slice(0, maxTextLength));
        setHasMoreText(true);
      } else {
        setPostText(data.body);
      }
    }
  }, []);
  function gotoChatHandler() {
    if (data?.userPost) {
      navigation.navigate("MessageList", {
        post_id: data._id,
        post_name: data.title,
      });
    } else {
      navigation.navigate("MessageChat", {
        post_id: data._id,
        post_name: data.title,
      });
    }
  }
  function onReportHandler() {
    reportPost(data._id);
  }
  function showTotalText() {
    setPostText(data.body);
    setHasMoreText(false);
  }
  async function onLikeHandler() {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((c) => c - 1);
      await likeHandler(data._id, "dislike");
    } else {
      setIsLiked(true);
      setLikeCount((c) => c + 1);
      await likeHandler(data._id, "like");
    }
  }

  async function playAudio() {
    try {
      if (data?.file) {
        const { sound: newSound } = await Audio.Sound.createAsync({ uri: data.file });
        setSound(newSound);
        setIsPlaying(true);
        await newSound.playAsync();
        newSound.setOnPlaybackStatusUpdate((status) => {
          if ("didJustFinish" in status && status.didJustFinish) {
            setIsPlaying(false);
          }
        });
      }
    } catch (e) {
      console.log("Play error", e);
    }
  }

  return (
    <View style={[styles.card, styles.elevationStyle]}>
      <View style={styles.contentBox}>
        <View style={{ flexDirection: "row" }}>
          <Ionicons
            name={data.is_public ? "earth-outline" : "location-outline"}
            size={36}
            style={{ marginTop: 2 }}
          />
          <View style={{ flexDirection: "column", marginLeft: 12 }}>
            <Text style={styles.heading} numberOfLines={1} ellipsizeMode="tail">
              {data.title}
            </Text>
            <TimeAgo dateTime={data.createdAt} />
          </View>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={styles.body}>{postText}</Text>
          {hasMoreText && (
            <LinkButton textStyle={styles.body} onPress={showTotalText}>
              ...Read more
            </LinkButton>
          )}
        </View>
        {postFile && postFileType == "audio/webm" && (
          <View>
            <IconButton
              icon={isPlaying ? "stop-circle-outline" : "play-circle-outline"}
              onPress={playAudio}
              color={colors.primary800}
              size={32}
            />
          </View>
        )}
        {postFile && postFileType !== "audio/webm" && (
          <View style={{ marginTop: 12 }}>
            <Image source={{ uri: postFile }} style={styles.image} />
          </View>
        )}
      </View>
      <View style={styles.actionContainer}>
        <Pressable onPress={onLikeHandler}>
          <IconButton
            icon={isLiked ? "like1" : "like2"}
            // icon={"like1"}
            color={colors.primary800}
            size={18}
            isAntDesign={true}
          />
          <View style={styles.likeContainer}>
            <LikeCount count={likeCount} style={styles.likeFont} />
            <Text style={{ ...styles.likeFont, ...{ marginLeft: 6 } }}>
              Likes
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={gotoChatHandler}>
          <IconButton
            icon="comments-o"
            color={colors.primary800}
            size={18}
            isFontAwesome={true}
          />
          <View style={styles.likeContainer}>
            <Text style={{ ...styles.likeFont, ...{ marginLeft: 6 } }}>
              Chat
            </Text>
          </View>
        </Pressable>
        <Pressable onPress={onReportHandler}>
          <IconButton
            icon="report-gmailerrorred"
            color={colors.primary800}
            size={18}
            isMaterialIcons={true}
          />
          <View style={styles.likeContainer}>
            <Text style={{ ...styles.likeFont }}>Report</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

export default PostItem;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 250,
    resizeMode: "center",
    borderRadius: 15,
    borderWidth: 0.1,
    borderColor: colors.subText,
    marginBottom: 10,
    marginTop: 10,
  },
  likeFont: {
    fontSize: 10,
    color: colors.mainText,
    fontFamily: "Inter_400Regular",
  },
  likeContainer: {
    flexDirection: "row",
    marginTop: -6,
  },
  actionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 6,
    height: 35,
  },
  contentBox: {
    borderBottomColor: colors.subText,
    borderBottomWidth: 0.4,
    paddingBottom: 12,
    minHeight: 75,
  },
  body: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
  },
  card: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "white",
    borderRadius: 4,
    paddingVertical: 15,
    paddingHorizontal: 25,
  },
  elevationStyle: {
    elevation: 4,
  },
  heading: {
    fontSize: 18,
    // color: colors.primary800,
    fontFamily: "Inter_600SemiBold",
  },
});
