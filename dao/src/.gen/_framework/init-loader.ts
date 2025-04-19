import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_f1538cc0d2f1b655c3c3c1db081a840633d6a593d6102ccb80e88e5ea3d32733 from "../_dependencies/source/0xf1538cc0d2f1b655c3c3c1db081a840633d6a593d6102ccb80e88e5ea3d32733/init";
import * as package_source_fd3987517eff09e8b165ae080703ca6921a953e239deccde90f71f4a783396b3 from "../_dependencies/source/0xfd3987517eff09e8b165ae080703ca6921a953e239deccde90f71f4a783396b3/init";
import * as package_source_9b79b60a02c37c340ee81b9ab449038852a89c51bdee9d93da15f60959f36ca5 from "../account-dao/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_9b79b60a02c37c340ee81b9ab449038852a89c51bdee9d93da15f60959f36ca5.registerClasses(loader);
package_source_f1538cc0d2f1b655c3c3c1db081a840633d6a593d6102ccb80e88e5ea3d32733.registerClasses(loader);
package_source_fd3987517eff09e8b165ae080703ca6921a953e239deccde90f71f4a783396b3.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
