import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import menu from "./menu/reducer";
import settings from "./settings/reducer";
import users from "./users/reducer";
/*import teams from "./teams/reducer";
import boxs from "./boxs/reducer";
import docs from "./document/reducer";
import restrictions from "./restrictions/reducer";
import projets from "./projets/reducer";
import pages from "./pages/reducer";*/

const reducers = combineReducers({
  form: formReducer,
  appData: combineReducers({
    users
    /*restrictions,
    projets,
    boxs,
    docs,
    pages,
    teams*/
  }),
  menu,
  settings,
  authUser: {}
});

export default reducers;
