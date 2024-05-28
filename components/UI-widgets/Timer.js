import React, { useState, useRef, useEffect } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import IconButton from "../Form-items/IconButtom";
import { colors } from "../../constants/colors";

const formatTime = (time) => {
  const getTwoDigits = (num) => (num < 10 ? `0${num}` : num);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;
  return `${getTwoDigits(hours)}:${getTwoDigits(minutes)}:${getTwoDigits(
    seconds
  )}`;
};

const RecordingTimer = ({ stopRecoding }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    (async () => {
      startTimer();
    })();
  }, []);

  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    }
    stopRecoding();
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setTime(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <IconButton
          icon="stop-circle"
          color={colors.error500}
          size={48}
          isMaterialIcons={true}
          style={{ margin: 0 }}
          onPress={stopTimer}
        />
        <Text style={styles.timerText}>{formatTime(time)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  timerText: {
    fontSize: 12,
  },
  buttonContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
});

export default RecordingTimer;
