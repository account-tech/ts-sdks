import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_c60d0aa043cadd8ea6b905d46fee76bedb6389052632b31e973e4a0f7e83d643 from "../_dependencies/source/0xc60d0aa043cadd8ea6b905d46fee76bedb6389052632b31e973e4a0f7e83d643/init";
import * as package_source_de3063e4616e600224b93d213620d3fb5d2abeda0101685c2f7c8b7d08da8143 from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_c60d0aa043cadd8ea6b905d46fee76bedb6389052632b31e973e4a0f7e83d643.registerClasses(loader);
package_source_de3063e4616e600224b93d213620d3fb5d2abeda0101685c2f7c8b7d08da8143.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
