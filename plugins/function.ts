export const cloneDeep = (data: any) => {
  return JSON.parse(JSON.stringify(data));
};

export default defineNuxtPlugin(() => {});
