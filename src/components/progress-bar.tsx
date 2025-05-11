import { useThemeColor } from '@/hooks/useThemeColor';
import { DimensionValue, StyleSheet, View } from 'react-native';

const ProgressBar = (props: ProgressBarProps) => {
  const bgColor = useThemeColor({}, 'systemGrey4');
  const isOverflowing = props.progress && props.progress > 1;
  const colorDanger = useThemeColor({}, 'danger');
  const colorSecondary = useThemeColor({}, 'secondary');
  const barColor = isOverflowing ? colorDanger : colorSecondary;
  const width: DimensionValue = `${(props.progress || 0) * 100}%`;

  return (
    <View style={{ ...styles.wrapper, backgroundColor: bgColor }}>
      <View style={{ ...styles.progress, width, backgroundColor: barColor }} />
    </View>
  );
};

interface ProgressBarProps {
  progress: number;
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 15,
    height: 2,
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    top: 0,
    left: 0,
    bottom: 0,
    height: 2,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  }
});

export default ProgressBar;

