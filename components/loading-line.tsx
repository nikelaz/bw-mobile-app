import { useAnimatedValue, Animated, View, Easing, Dimensions } from 'react-native';
import { useEffect } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

type LoadingLineProps = Readonly<{
  width?: number | string,
  height?: number,
  style?: any
}>;

export const LoadingLine = (props: LoadingLineProps) => {
  const width = props.width || '100%';
  const transformValue = useAnimatedValue(0);
  const height = props.height || 20;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(transformValue, {
          toValue: 1,
          duration: 850,
          useNativeDriver: true
        }),
        Animated.timing(transformValue, {
          toValue: 0,
          duration: 850,
          useNativeDriver: true
        })
      ])
    ).start();
  }, [transformValue]);

  const color = transformValue.interpolate({
    inputRange: [0, 1],
    outputRange: [useThemeColor({}, 'systemGrey6'), useThemeColor({}, 'systemGrey5')]
  });

  return (
    <Animated.View style={{
      backgroundColor: color,
      width: width,
      height: height,
      overflow: 'hidden',
      borderRadius: 5,
      ...props.style,
    }}></Animated.View>
  );
};
