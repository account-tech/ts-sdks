import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_2c137265d68d158493ba021f7c59913785fe524c6f19c22c8dea8e591a1d9c20 from "../_dependencies/source/0x2c137265d68d158493ba021f7c59913785fe524c6f19c22c8dea8e591a1d9c20/init";
import * as package_source_86d6c90d7c6aafa3dcde015b9651cbd5754c8299c3881a67a37ba6f5e09e277a from "../account-multisig/init";
import * as package_source_ee067c667ba529cfe69c2768a483b4269fa02eebacf69e0e69329c596873812c from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_2c137265d68d158493ba021f7c59913785fe524c6f19c22c8dea8e591a1d9c20.registerClasses(loader);
package_source_86d6c90d7c6aafa3dcde015b9651cbd5754c8299c3881a67a37ba6f5e09e277a.registerClasses(loader);
package_source_ee067c667ba529cfe69c2768a483b4269fa02eebacf69e0e69329c596873812c.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
