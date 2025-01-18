import { useRouter, Href } from 'expo-router';
import TouchableBox, { TouchableBoxProps } from './touchable-box';

interface LinkBoxProps extends TouchableBoxProps {
  href: Href;
}

const LinkBox = (props: LinkBoxProps) => {
  const router = useRouter();

  return (
      <TouchableBox
        {...props}
        onPress={() => router.navigate(props.href)}
      >
        {props.children}
      </TouchableBox>
  )
};

export default LinkBox;
