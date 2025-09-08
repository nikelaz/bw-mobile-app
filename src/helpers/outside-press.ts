const observers: Function[] = [];

export const subscribeToOutsidePress = (subscriber: Function) => {
  observers.push(subscriber);

  // return an unsubscribe function
  return () => {
    const index = observers.indexOf(subscriber);
    if (index !== -1) observers.splice(index, 1);
  };
};

export const dispatchOutsidePress = () => {
  // a copy is needed if subscribers unsubscribe during iteration
  const observersCopy = [...observers];

  // for loop is better than array methods for performance here
  for (let i = 0; i < observersCopy.length; i++) {
    observersCopy[i]();
  }
};
