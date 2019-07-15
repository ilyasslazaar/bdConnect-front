import { addLocaleData } from "react-intl";
import enLang from "./entries/en-US";
import arLang from "./entries/ar-MA";

const AppLocale = {
  en: enLang,
  ar: arLang
};
addLocaleData([...AppLocale.en.data, ...AppLocale.ar.data]);

export default AppLocale;
