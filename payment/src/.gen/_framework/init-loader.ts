import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_e12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0 from "../_dependencies/source/0xe12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0/init";
import * as package_source_841fd25185f32719f2003fe80a34e934b00fd06ae393a96c8043eeddb0c134d9 from "../account-payment/init";
import * as package_source_3e3387bfcd0feeca97d7b7d8bfa3056e901e7e77702e46fd3427fa071c2834bf from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_3e3387bfcd0feeca97d7b7d8bfa3056e901e7e77702e46fd3427fa071c2834bf.registerClasses(loader);
package_source_841fd25185f32719f2003fe80a34e934b00fd06ae393a96c8043eeddb0c134d9.registerClasses(loader);
package_source_e12b413d040fad46e6510a1ade973f23e2933a03631029120193b870fec7aae0.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
