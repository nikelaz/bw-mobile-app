import Container from './container';
import { Platform } from 'react-native';

const AndroidOffsetContainer = (props: GenericChildrenProps) => (
  <Container
    style={{
      ...Platform.select({
        android: {
          paddingTop: 60
        }
      })
    }}
  >
    {props.children}
  </Container>
);

export default AndroidOffsetContainer;
