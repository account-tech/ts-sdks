import * as config from "./config/structs";
import * as dao from "./dao/structs";
import * as version from "./version/structs";
import {StructClassLoader} from "../_framework/loader";

export function registerClasses(loader: StructClassLoader) { loader.register(config.ConfigDaoAction);
loader.register(config.ConfigDaoIntent);
loader.register(dao.ConfigWitness);
loader.register(dao.Dao);
loader.register(dao.Group);
loader.register(dao.Registry);
loader.register(dao.Staked);
loader.register(dao.Vote);
loader.register(dao.Voted);
loader.register(dao.Votes);
loader.register(version.V1);
 }
