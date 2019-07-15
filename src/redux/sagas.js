import { all } from "redux-saga/effects";
import userSagas from "./users/sagas";
import teamsSagas from "./teams/sagas";
import restrictionsSagas from "./restrictions/sagas";
import projetsSagas from "./projets/sagas";
import boxsSagas from "./boxs/sagas";
import docsSagas from "./document/sagas";
import pagesSagas from "./pages/sagas";
import metadataSagas from "./metadata/sagas";

export default function* rootSaga() {
  yield all([
    userSagas(),
    teamsSagas(),
    restrictionsSagas(),
    projetsSagas(),
    boxsSagas(),
    docsSagas(),
    pagesSagas(),
    metadataSagas()
  ]);
}
