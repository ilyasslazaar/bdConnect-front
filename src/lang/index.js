import { addLocaleData } from "react-intl";
import enLang from "./entries/en-US";
import frLang from "./entries/fr-FR"

const AppLocale = {
  en: enLang,
  fr: frLang
};
addLocaleData([...AppLocale.en.data, ...AppLocale.fr.data]);

export default AppLocale;
