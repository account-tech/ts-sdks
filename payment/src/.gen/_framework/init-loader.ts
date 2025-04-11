import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_b323fd685ed857f7fea452532fa61e04de6dd1c3b5efbb672cfc70385da30e2b from "../_dependencies/source/0xb323fd685ed857f7fea452532fa61e04de6dd1c3b5efbb672cfc70385da30e2b/init";
import * as package_source_7b3f58516d1f727ae03c168d416481a55775ed1588f27eee3ee7136722c58cdb from "../account-payment/init";
import * as package_source_b6cf8766b9e7d10e8e060b3d724a08eae8285a1d37285b0622e22bb13e9c80ab from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_7b3f58516d1f727ae03c168d416481a55775ed1588f27eee3ee7136722c58cdb.registerClasses(loader);
package_source_b323fd685ed857f7fea452532fa61e04de6dd1c3b5efbb672cfc70385da30e2b.registerClasses(loader);
package_source_b6cf8766b9e7d10e8e060b3d724a08eae8285a1d37285b0622e22bb13e9c80ab.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
