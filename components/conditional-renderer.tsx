type ConditionalRendererProps = Readonly<{
  children: React.ReactNode,
  isVisible: boolean,
}>;

const ConditionalRenderer = (props: ConditionalRendererProps) => {
  return props.isVisible ? props.children : null;
};

export default ConditionalRenderer;
