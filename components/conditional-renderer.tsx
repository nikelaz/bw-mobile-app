interface ConditionalRendererProps {
  children: React.ReactNode;
  isVisible: boolean;
};

const ConditionalRenderer = (props: ConditionalRendererProps) => {
  if (props.isVisible) {
    return props.children;
  }

  return null;
};

export default ConditionalRenderer
