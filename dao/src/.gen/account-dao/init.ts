import * as config from "./config/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(config.ConfigDaoIntent);
loader.register(config.ConfigDaoAction);
 }
