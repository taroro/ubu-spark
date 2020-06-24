import { combineReducers } from "redux";

import sidebar from "./sidebarReducers";
import theme from "./themeReducer";
import auth from "./authReducers";

import { reducer as toastr } from "react-redux-toastr";

export default combineReducers({
  auth,
  sidebar,
  theme,
  toastr
});
