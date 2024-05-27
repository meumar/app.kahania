import React from 'react';
import { Text } from 'react-native';

const LikeCount = ({ count, style }) => {
  const formatNumber = (num) => {
    if (num >= 1000000) {
      return Math.floor(num / 1000000) + 'M';
    } else if (num >= 1000) {
      return Math.floor(num / 1000) + 'k';
    } else {
      return num.toString();
    }
  };

  return <Text style={style}>{formatNumber(count)}</Text>;
};

export default LikeCount;
