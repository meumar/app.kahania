import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";
import * as Location from "expo-location";
import { AuthContext } from "../../store/auth-context";
import { fetchFeed, reportHandler } from "../../http/post";
import PostItem from "../../components/UI-widgets/PostItem";
import SkeletonPlaceholderComponent from "../../components/UI-widgets/SkeletonPlaceholderComponent";
import { useRoute } from "@react-navigation/native";
import CustomModal from "../../components/UI-widgets/Modal";
import { reportReasons, colors } from "../../constants/colors";

const HomeScreen = (props) => {
  const authCtx = useContext(AuthContext);
  const [postsData, setPostsData] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasDataMore, setHasDataMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);

  const [modalVisible, setModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [selectedPost, setSelectedPost] = useState("");
  const [reportOtherReason, setReportOtherReason] = useState("");

  const limit = () => {
    return 5;
  };

  const fetchData = async (qty) => {
    let params = { page: page, limit: qty };
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status == "granted") {
      let { coords } = await Location.getCurrentPositionAsync({});
      params["longitude"] = coords.longitude;
      params["latitude"] = coords.latitude;
    }
    setLoadingMore(true);
    const data = await fetchFeed(params);
    if (data === "logout") return authCtx.logout();
    if (data === "done") {
      setLoadingMore(false);
      setRefreshing(false);
      setHasDataMore(false);
      return;
    }
    setPage(page + 1);
    setPostsData([...postsData, ...data]);
    setLoadingMore(false);
    setRefreshing(false);
  };

  const onRefresh = async () => {
    setPostsData([]);
    setRefreshing(true);
    setPage(1);
    fetchData(limit());
  };
  const route = useRoute();
  useEffect(() => {
    fetchData(limit());
    const focusListener = props.navigation.addListener("focus", () => {
      let refresh = false;
      if (route.params) {
        refresh = route.params.loadNewPosts || false;
      }
      if (refresh) {
        onRefresh();
      }
    });

    return () => {
      focusListener();
    };
  }, []);

  const fetchMore = async () => {
    if (hasDataMore) {
      await fetchData(limit());
    }
  };
  const setReportPost = (value) => {
    setSelectedPost(value);
    setModalVisible(true);
  };
  const resetReportData = () => {
    setReportReason("");
    setSelectedPost("");
    setReportOtherReason("");
    setModalVisible(false);
  };
  const reportPost = async () => {
    await reportHandler({
      reason: reportOtherReason || reportReason,
      post_id: selectedPost,
    });
    resetReportData();
    onRefresh();
  };
  return (
    <View style={{ flex: 1 }}>
      <>
        {refreshing ? (
          <SkeletonPlaceholderComponent />
        ) : (
          <FlatList
            style={styles.postContainer}
            data={postsData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <PostItem data={item} reportPost={setReportPost} />
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onEndReached={fetchMore}
            ListEmptyComponent={() =>
              !loadingMore && (
                <Text style={styles.loadingText}>No posts added</Text>
              )
            }
            onEndReachedThreshold={0.5}
            ListFooterComponent={() =>
              loadingMore ? (
                <Text style={styles.loadingText}>Loading</Text>
              ) : (
                <Text style={styles.loadingText}>End of the list</Text>
              )
            }
          />
        )}
        <CustomModal
          heading="Why are you reporting?"
          modalVisible={modalVisible}
        >
          <View>
            {reportReason == "Other" ? (
              <View>
                <TextInput
                  style={styles.reasonTextBox}
                  multiline={true}
                  placeholder="Reason..."
                  onChangeText={(value) => setReportOtherReason(value)}
                />
              </View>
            ) : (
              <View>
                {reportReasons.map((r) => {
                  return (
                    <Pressable
                      onPress={() => setReportReason(r)}
                      key={r}
                      style={[
                        styles.reasonItem,
                        reportReason == r && styles.selectedReason,
                      ]}
                    >
                      <Text>{r}</Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
          <View style={styles.modalActions}>
            <Pressable
              onPress={reportPost}
              disabled={
                selectedPost && reportReason
                  ? reportReason == "Other" && !reportOtherReason
                    ? true
                    : false
                  : true
              }
            >
              <Text style={styles.saveButton}>Save</Text>
            </Pressable>
          </View>
        </CustomModal>
      </>
    </View>
  );
};

const styles = StyleSheet.create({
  saveButton: {
    fontWeight: "600",
    color: colors.primary800,
  },
  modalActions: {
    alignItems: "flex-end",
  },
  reasonTextBox: {},
  selectedReason: {
    backgroundColor: colors.primary100,
    borderRadius: 12,
  },
  reasonItem: {
    padding: 6,
  },
  postContainer: { backgroundColor: "#e6e6e6" },
  loadingText: { padding: 10, fontWeight: "bold", textAlign: "center" },
});

export default HomeScreen;
