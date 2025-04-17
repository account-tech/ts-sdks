import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_816b73e87c1862caf0b2db0ff090f34743014f015dc438531ae52bc0e7f1e387 from "../_dependencies/source/0x816b73e87c1862caf0b2db0ff090f34743014f015dc438531ae52bc0e7f1e387/init";
import * as package_source_e0a321104fa859cc9dcf962ef62a32e93ca2b1d5e493eb2454050af5203cefc8 from "../account-dao/init";
import * as package_source_531d84bc93b829669db33056e6bfaae9c31ca8627ced49699524707a80391d4f from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_531d84bc93b829669db33056e6bfaae9c31ca8627ced49699524707a80391d4f.registerClasses(loader);
package_source_816b73e87c1862caf0b2db0ff090f34743014f015dc438531ae52bc0e7f1e387.registerClasses(loader);
package_source_e0a321104fa859cc9dcf962ef62a32e93ca2b1d5e493eb2454050af5203cefc8.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
