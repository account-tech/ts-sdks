import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_bd8fc1947cf119350184107a3087e2dc27efefa0dd82e25a1f699069fe81a585 from "../_dependencies/source/0xbd8fc1947cf119350184107a3087e2dc27efefa0dd82e25a1f699069fe81a585/init";
import * as package_source_5b249579964953a3f49ed605ff0329302c0c218e1603fbb9921e19bfacb901a8 from "../account-multisig/init";
import * as package_source_77a39df37fab5b6d47c9976f114ef1ac21313edee5a446135c08fdbaf615b623 from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_5b249579964953a3f49ed605ff0329302c0c218e1603fbb9921e19bfacb901a8.registerClasses(loader);
package_source_77a39df37fab5b6d47c9976f114ef1ac21313edee5a446135c08fdbaf615b623.registerClasses(loader);
package_source_bd8fc1947cf119350184107a3087e2dc27efefa0dd82e25a1f699069fe81a585.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
