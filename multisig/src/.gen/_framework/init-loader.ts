import * as package_source_1 from "../_dependencies/source/0x1/init";
import * as package_source_2 from "../_dependencies/source/0x2/init";
import * as package_source_87bee60d3ea6dc5b42e1074134373af27733fb3c5ebc3ac8e013901426d85d53 from "../_dependencies/source/0x87bee60d3ea6dc5b42e1074134373af27733fb3c5ebc3ac8e013901426d85d53/init";
import * as package_source_460632ef4e9e708658788229531b99f1f3285de06e1e50e98a22633c7e494867 from "../account-multisig/init";
import * as package_source_10c87c29ea5d5674458652ababa246742a763f9deafed11608b7f0baea296484 from "../account-protocol/init";
import {StructClassLoader} from "./loader";

function registerClassesSource(loader: StructClassLoader) { package_source_1.registerClasses(loader);
package_source_2.registerClasses(loader);
package_source_10c87c29ea5d5674458652ababa246742a763f9deafed11608b7f0baea296484.registerClasses(loader);
package_source_460632ef4e9e708658788229531b99f1f3285de06e1e50e98a22633c7e494867.registerClasses(loader);
package_source_87bee60d3ea6dc5b42e1074134373af27733fb3c5ebc3ac8e013901426d85d53.registerClasses(loader);
 }

export function registerClasses(loader: StructClassLoader) { registerClassesSource(loader); }
