import { Path, Svg } from 'react-native-svg';
import { useAnimatedValue, Animated, Easing } from 'react-native';
import { useEffect } from 'react';

type LoaderProps = Readonly<{
  width: string | number,
  height: string | number,
  className?: string,
  color: string,
}>;

export const Loader = (props: LoaderProps) => {
  const spinValue = useAnimatedValue(0);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <Animated.View style={{ transform: [{rotate: spin }]}}>
      <Svg 
        viewBox="0 0 24 24"
        width={props.width}
        height={props.height}
      >
        <Path fill={props.color} d="M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z" />
      </Svg>
    </Animated.View>
  );
};
