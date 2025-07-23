import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_3506d95c270e2ae16bd3cbf11b701808390807450697a1bd302b29e7b59e8fdc from "../_dependencies/source/0x3506d95c270e2ae16bd3cbf11b701808390807450697a1bd302b29e7b59e8fdc/init";
import * as package_source_a8ab4e47d58f47ce46a8a0748c8511a733264ea55f4896ed81673414a26b4ab0 from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_3506d95c270e2ae16bd3cbf11b701808390807450697a1bd302b29e7b59e8fdc.registerClasses(loader);
package_source_a8ab4e47d58f47ce46a8a0748c8511a733264ea55f4896ed81673414a26b4ab0.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
