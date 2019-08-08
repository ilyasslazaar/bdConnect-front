import { all } from "redux-saga/effects";
import userSagas from "./users/sagas";
import pagesSagas from "./pages/sagas";

export default function* rootSaga() {
  yield all([userSagas(), pagesSagas()]);
}
