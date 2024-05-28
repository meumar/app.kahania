import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
} from "react-native";
import { useState, useLayoutEffect, useEffect } from "react";
import * as Location from "expo-location";
import Card from "../../components/UI-widgets/Card";
import { colors, messages } from "../../constants/colors";
import Select from "../../components/UI-widgets/Select";
import Button from "../../components/Form-items/Button";

import { createPost } from "../../http/post";
import LoadingOverlay from "../../components/UI-widgets/LoadingOverlay";
import IconButton from "../../components/Form-items/IconButtom";

import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";

function NewPost({ navigation }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [postDetails, setPostDetails] = useState({
    title: {
      isValid: true,
      value: "",
      message: "",
    },
    body: {
      isValid: true,
      value: "",
      message: "",
    },
    file: {
      isValid: true,
      value: "",
      message: "",
    },
    file_type: {
      isValid: true,
      value: "",
      message: "",
    },
    is_public: {
      isValid: true,
      value: true,
      message: "",
    },
    location: {
      isValid: true,
      value: [],
      message: "",
    },
    tags: {
      isValid: true,
      value: [],
      message: "",
    },
  });
  const [recording, setRecording] = useState();
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordedSound, setRecordedSound] = useState();

  async function startRecording() {
    try {
      if (permissionResponse.status !== "granted") {
        await requestPermission();
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
    });
    const { sound, status } = await recording.createNewLoadedSoundAsync();
    setRecordedSound(sound);
    const uri = recording.getURI();
    if (uri) {
      onInputChange("file", uri);
      onInputChange("file_type", "audio/webm");
    } else {
      onInputChange("file", "");
      onInputChange("file_type", "");
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      // allowsMultipleSelection: true,
      quality: 1,
    });
    if (!result.canceled) {
      onInputChange("file", result.assets[0].uri);
      onInputChange("file_type", result.assets[0].mimeType);
    } else {
      onInputChange("file", "");
      onInputChange("file_type", "");
    }
  };

  const shareOptions = [
    {
      title: "Public",
      icon: "public",
    },
    {
      title: "Private",
      icon: "lock",
    },
  ];
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setError(messages.locationPermissionError);
        onInputChange("is_public", false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      onInputChange("location", [
        location.coords.longitude,
        location.coords.latitude,
      ]);
    })();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <Button onPress={sharePostHandler} disabled={!postDetails.body.value}>
            Post
          </Button>
        );
      },
    });
  }, [postDetails.body.value, navigation]);
  function resetForm() {
    setPostDetails((currentForm) => {
      return {
        ...currentForm,
        ...{
          title: {
            isValid: true,
            value: "",
            message: "",
          },
          body: {
            isValid: true,
            value: "",
            message: "",
          },
          file: {
            isValid: true,
            value: "",
            message: "",
          },
          file_type: {
            isValid: true,
            value: "",
            message: "",
          },
          is_public: {
            isValid: true,
            value: true,
            message: "",
          },
          tags: {
            isValid: true,
            value: [],
            message: "",
          },
        },
      };
    });
  }
  function onSelect(value) {
    onInputChange("is_public", value.title == "Public" ? true : false);
  }
  function onInputChange(type, value) {
    setError("");
    setPostDetails((current) => {
      return {
        ...current,
        ...{ [type]: { value: value, isValid: true, message: "" } },
      };
    });
  }
  function createParams() {
    let params = {
      title: postDetails.title.value
        ? postDetails.title.value
        : postDetails.body.value.slice(0, 24),
      body: postDetails.body.value,
      is_public: postDetails.is_public.value,
      location: { type: "Point", coordinates: postDetails.location.value },
    };
    if (postDetails.file.value) {
      params["file"] = postDetails.file.value;
      params["file_type"] = postDetails.file.value;
    }
    if (postDetails.tags.value) {
      params["tags"] = postDetails.tags.value;
    }
    return params;
  }
  async function sharePostHandler() {
    const postPayload = createParams();
    setLoading(true);
    const postResultDetails = await createPost(postPayload);
    if (postResultDetails?.success) {
      setLoading(false);
      resetForm();
      navigation.navigate("Home", { loadNewPosts: true });
    } else {
      setError(postResultDetails.message || messages.ERROR);
      setLoading(false);
    }
  }
  if (loading) {
    return <LoadingOverlay message={messages.postSharingMessage} />;
  }
  return (
    <View style={styles.container}>
      <ScrollView style={styles.inputContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <Card parentStyle={styles.card}>
          <View style={styles.settings}>
            <View style={styles.left}>
              <Select
                data={shareOptions}
                defaultValue={{ title: "Public", icon: "public" }}
                onSelect={onSelect}
              />
              <Text style={styles.head}>
                {postDetails.is_public.value
                  ? "Anyone can"
                  : "Within 1km radius"}
              </Text>
            </View>
            <View style={styles.right}>
              <IconButton
                icon="add-to-photos"
                color={colors.primary800}
                size={30}
                isMaterialIcons={true}
                style={{ margin: 0 }}
                onPress={pickImage}
              />
              <IconButton
                icon="mic"
                color={colors.primary800}
                size={30}
                isMaterialIcons={true}
                style={{ margin: 0 }}
                onPress={recording ? stopRecording : startRecording}
              />
            </View>
          </View>
          {postDetails.file.value && (
            <View>
              {postDetails.file_type.value == "audio/webm" ? (
                <Button onPress={() => recordedSound.replayAsync()}>
                  Play
                </Button>
              ) : (
                <Image
                  source={{ uri: postDetails.file.value }}
                  style={styles.image}
                />
              )}
            </View>
          )}
          <View>
            <TextInput
              placeholder="Title..."
              onChangeText={onInputChange.bind(this, "title")}
              maxLength={24}
            />
          </View>
          <TextInput
            style={styles.title}
            multiline={true}
            placeholder="Post something..."
            onChangeText={onInputChange.bind(this, "body")}
          />
        </Card>
      </ScrollView>
    </View>
  );
}

export default NewPost;

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
  container: {
    flex: 1,
    padding: 12,
  },
  card: {
    padding: 24,
    flex: 1,
    minHeight: 500,
  },
  title: {
    borderBottomColor: colors.primary800,
    width: "100%",
    fontSize: 24,
    marginTop: 8,
  },
  settings: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  inputContainer: {
    marginTop: 8,
    flex: 1,
    // borderTopColor: colors.subText,
    // borderTopWidth: 1,
  },
  left: {
    // alignSelf: "flex-start",
  },
  right: {
    // alignSelf: "flex-end",
    flexDirection: "row",
  },
  head: {
    marginTop: 4,
    color: colors.subText,
  },
  errorText: {
    color: colors.error500,
    textAlign: "center",
  },
});
