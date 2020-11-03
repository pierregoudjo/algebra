type Action<Type, Data> = {
  type: Type;
} & Data;

const toString = <Type, Data>(action: Action<Type, Data>) => {
  const { type, ...data } = action;
  return `Action of type ${action.type} and data of ${JSON.stringify(data)}`;
};

export type { Action };
export { toString };
