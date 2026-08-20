type Listener = (active: boolean) => void;

const listeners = new Set<Listener>();
let active = false;

export function startLoading() {
  active = true;
  listeners.forEach((listener) => listener(active));
}

export function stopLoading() {
  active = false;
  listeners.forEach((listener) => listener(active));
}

export function subscribeLoading(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
