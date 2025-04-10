import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_352d1a7f5e8564c8015317691511bc155817c7481deb1c66ee2615cfef41244e from "../_dependencies/source/0x352d1a7f5e8564c8015317691511bc155817c7481deb1c66ee2615cfef41244e/init";
import * as package_source_5dc85f69022101e075affe09af643b8bdd99c50fd1e4611a3660621c5c63de6a from "../account-multisig/init";
import * as package_source_5f7b38cbec63d97799d5b82f5231e030da5f5f0065282a63ab43cdde448d38a5 from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_352d1a7f5e8564c8015317691511bc155817c7481deb1c66ee2615cfef41244e.registerClasses(loader);
package_source_5dc85f69022101e075affe09af643b8bdd99c50fd1e4611a3660621c5c63de6a.registerClasses(loader);
package_source_5f7b38cbec63d97799d5b82f5231e030da5f5f0065282a63ab43cdde448d38a5.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
