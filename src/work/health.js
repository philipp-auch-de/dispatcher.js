let errorFeature = undefined;
let errorDate = undefined;
let errorMessage = undefined;

export function featureSuccess(name) {
  if (name === errorFeature) {
    errorFeature = undefined;
    errorDate = undefined;
    errorMessage = undefined;
  }
}

export function featureError(name, message) {
  errorFeature = name;
  errorDate = new Date();
  errorMessage = message;
}

export function getHealth() {
  if (!errorFeature) return { health: 'ok' };
  return { health: 'error', error: { feature: errorFeature, date: errorDate, message: errorMessage } };
}
