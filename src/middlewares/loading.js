import { showLoadingBar, closeLoadingBar } from "../actions/common";

// 计数器，用于并发请求时，合并loading mask.
let maskCount = 0;
// 延迟时间 300ms以内，用户不会感觉到延迟.
const delayTime = 300;

let openTimerCount = 0;
let openTimer;
let closeTimerCount = 0;
let closeTimer;

function mask(dispatch) {
  if (openTimerCount > 1) {
    clearTimeout(openTimer);
    --openTimerCount;
  }
  // 延迟打开loading mask
  // 如果请求时间很短(<= delayTime)，则不打开loading mask.
  if (++maskCount > 1) return;
  ++openTimerCount;
  //dispatch(showLoadingBar())
  openTimer = setTimeout(() => {
    --openTimerCount;
    dispatch(showLoadingBar());
  }, delayTime);
}

function unmask(dispatch) {
  if (closeTimerCount > 0) {
    clearTimeout(closeTimer);
    --closeTimerCount;
  }
  // 延迟关闭loading mask,
  // 如果两次请求的时间间隔很短，则合并两个请求的loading mask.
  if (--maskCount > 0) return;
  ++closeTimerCount;
  closeTimer = setTimeout(() => {
    if (maskCount !== 0) return;
    --closeTimerCount;
    dispatch(closeLoadingBar());
  }, delayTime);
}

export default function loadingMiddleware({ dispatch }) {
  return (next) => (action) => {
    const { payload, meta } = action;
    if (isPromise(payload) && !(meta && meta.noMask)) {
      mask(dispatch);
      payload
        .then(
          () => unmask(dispatch),
          () => unmask(dispatch)
        )
        .catch(() => {
          unmask(dispatch);
        });
    }
    return next(action);
  };
}

function isPromise(val) {
  return val && typeof val.then === "function";
}
