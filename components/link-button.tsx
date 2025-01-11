import Button, { ButtonProps } from './button';
import { useRouter, Href } from 'expo-router';

interface LinkButtonProps extends ButtonProps {
  href: Href;
}

const LinkButton = (props: LinkButtonProps) => {
  const router = useRouter();

  return (
    <Button
      {...props}
      onPress={() => router.push(props.href)}
    />
  )
}

export default LinkButton;
