import { map } from "lodash";
export const joinList2Str = (
  list: Array<Object>,
  key: string,
  connector = ","
) => {
  return map(list, key).join(connector);
};
