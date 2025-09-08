import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import TouchableBox, { TouchableBoxProps } from '@/src/components/touchable-box';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Loader } from '@/src/components/loader';
import { subscribeToOutsidePress } from '@/src/helpers/outside-press';

const SWIPE_THRESHOLD = -75;
const OVER_SWIPE_THRESHOLD = -100;

interface SwipableTouchableBoxProps extends TouchableBoxProps {
  onDelete: () => void; 
  onInteractionStart?: () => void;
}

export interface SwipableTouchableBoxHandle {
  resetPosition: () => void;
}

const SwipableTouchableBox = forwardRef<SwipableTouchableBoxHandle, SwipableTouchableBoxProps>(
  (props, ref) => {
    const translateX = useSharedValue(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const red = useThemeColor({}, 'red');

    const resetPosition = () => {
      translateX.value = withSpring(0);
    };

    useImperativeHandle(ref, () => ({
      resetPosition,
    }));

    useEffect(() => {
      const unsubscribe = subscribeToOutsidePress(() => {
        resetPosition();
      });

      return unsubscribe;
    }, []);

    const panGesture = Gesture.Pan()
      .onStart(() => {
        'worklet';
        runOnJS(setIsSwiping)(true);
        if (props.onInteractionStart) {
          runOnJS(props.onInteractionStart)();
        }
      })
      .onUpdate((event) => {
        'worklet';
        const newTranslateX = event.translationX;
        translateX.value = Math.min(0, Math.max(newTranslateX, OVER_SWIPE_THRESHOLD));
      })
      .onEnd((event) => {
        'worklet';
        if (event.translationX < SWIPE_THRESHOLD) {
          translateX.value = withSpring(SWIPE_THRESHOLD);
        } else {
          translateX.value = withSpring(0);
        }
        runOnJS(setIsSwiping)(false);
      });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });


  const onPressProxy = (fn: () => void) => {
    return () => {
      if (isSwiping || props.isLoading) return;
      fn();
    };
  }

  return (
    <View style={[
      styles.wrapper,
      props.groupFirst && styles.wrapperGroupFirst,
      props.groupLast && styles.wrapperGroupLast,
    ]}>
      <View style={{ ...styles.deleteButton, backgroundColor: red }}>
        <TouchableOpacity
          onPress={onPressProxy(props.onDelete)}
          style={styles.deleteButtonTouchable}
        >
          <Text style={styles.deleteButtonText}>
            {props.isLoading ? <Loader width={24} height={24} color="#fff" /> : 'Delete'}
          </Text>
        </TouchableOpacity>
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={animatedStyle}>
          <TouchableBox
            {...props}
            onPress={onPressProxy(props.onPress)}
          >
            {props.children}
          </TouchableBox>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    overflow: 'hidden',
  },
  wrapperGroupFirst: {
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  wrapperGroupLast: {
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 120,
    paddingLeft: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonTouchable: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '500',
  },
});

export default SwipableTouchableBox;
