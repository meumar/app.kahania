import { Text, StyleSheet } from "react-native";
import React from "react";
import moment from "moment";
import { colors } from "../../constants/colors";

const TimeAgo = ({ dateTime, style }) => {
  const timeAgoString = () => {
    const now = moment();
    const then = moment(dateTime);
    const diff = now.diff(then, "seconds");

    if (diff < 60) {
      return `${diff} seconds ago`;
    } else if (diff < 3600) {
      return `${Math.floor(diff / 60)} minutes ago`;
    } else if (diff < 86400) {
      return `${Math.floor(diff / 3600)} hours ago`;
    } else if (diff < 604800) {
      return `${Math.floor(diff / 86400)} days ago`;
    } else if (diff < 2592000) {
      return `${Math.floor(diff / 604800)} weeks ago`;
    } else if (diff < 31536000) {
      return `${Math.floor(diff / 2592000)} months ago`;
    } else {
      return `${Math.floor(diff / 31536000)} years ago`;
    }
  };

  return <Text style={[styles.text, style]}>{timeAgoString()}</Text>;
};

export default TimeAgo;

const styles = StyleSheet.create({
  text: {
    color: colors.faddedText,
    fontSize: 10
  },
});
