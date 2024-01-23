import moment from "moment";

// get current timestamp
export const setCurrentTimestamp = function (): Number {
  return Number(moment().format("x"));
};

//add time to current timestamp
export const addTimeToCurrentTimestamp = function (
  number: moment.DurationInputArg1,
  timeFormat: moment.DurationInputArg2
): Number {
  return Number(moment().add(number, timeFormat).format("x"));
};
