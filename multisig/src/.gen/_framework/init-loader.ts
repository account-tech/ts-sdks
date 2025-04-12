import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_e12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0 from "../_dependencies/source/0xe12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0/init";
import * as package_source_45473e7747b0f740c3cdf51cc255f3dc5ff9a628da6899860865b7ff82afcc1a from "../account-multisig/init";
import * as package_source_3e3387bfcd0feeca97d7b7d8bfa3056e901e7e77702e46fd3427fa071c2834bf from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_3e3387bfcd0feeca97d7b7d8bfa3056e901e7e77702e46fd3427fa071c2834bf.registerClasses(loader);
package_source_45473e7747b0f740c3cdf51cc255f3dc5ff9a628da6899860865b7ff82afcc1a.registerClasses(loader);
package_source_e12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
