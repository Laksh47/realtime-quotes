const getTimestamp = () => {
  const dt = new Date();
  const time = dt.toLocaleTimeString("en-us", { timeZoneName: "short" });
  return `${dt.toDateString()}, ${time}`;
};

const serialize = (obj) => {
  if (obj) return JSON.stringify(obj);
  return null;
};

const deserialize = (obj) => {
  if (obj && obj !== "") return JSON.parse(obj);
  return null;
};

export { getTimestamp, serialize, deserialize };
