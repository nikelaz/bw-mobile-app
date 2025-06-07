import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { useState, useImperativeHandle, forwardRef } from 'react';
import type { Budget } from '@nikelaz/bw-shared-libraries';
import TouchableBox from '@/src/components/touchable-box';
import { useThemeColor } from '@/src/hooks/useThemeColor';
import { Loader } from '@/src/components/loader';
import months from '@/data/months';

const SWIPE_THRESHOLD = -75;
const OVER_SWIPE_THRESHOLD = -100;

type SwipableBudgetItemProps = Readonly<{
  budget: Budget; 
  onPress: () => void; 
  onDelete: () => void; 
  onInteractionStart?: () => void;
  groupFirst?: boolean;
  groupLast?: boolean;
  isLoading?: boolean;
}>;

export interface SwipableBudgetItemHandle {
  resetPosition: () => void;
}

const SwipableBudgetItem = forwardRef<SwipableBudgetItemHandle, SwipableBudgetItemProps>(
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

  const budgetDate = new Date(props.budget.month);

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
            group={true}
            arrow={false}
            onPress={onPressProxy(props.onPress)}
            noSeparator={props.groupLast}
          >
            {months[budgetDate.getMonth()]} {budgetDate.getFullYear()}
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
    width: 100,
    paddingLeft: 25,
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
    fontWeight: 500,
  },
});

export default SwipableBudgetItem;
